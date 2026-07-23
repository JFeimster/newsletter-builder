import { NextRequest, NextResponse } from "next/server";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

function database() {
  const db = globalThis.__NEWSLETTER_BUILDER_ENV__?.DB;
  if (!db) throw new Error("Durable project storage is unavailable.");
  return db;
}

async function userOrUnauthorized() {
  const user = await getChatGPTUser();
  return user ?? null;
}

export async function GET() {
  const user = await userOrUnauthorized();
  if (!user) return NextResponse.json({ error: "signin_required" }, { status: 401 });
  const rows = await database().prepare(
    "SELECT id, name, data_json, created_at, updated_at FROM publication_projects WHERE owner_email = ? ORDER BY updated_at DESC"
  ).bind(user.email).all<{id:string;name:string;data_json:string;created_at:number;updated_at:number}>();
  return NextResponse.json({
    projects: rows.results.map((row: {id:string;name:string;data_json:string;created_at:number;updated_at:number}) => ({
      id: row.id,
      name: row.name,
      project: JSON.parse(row.data_json),
      created_at: row.created_at,
      updated_at: row.updated_at,
    })),
    user: { displayName: user.displayName, email: user.email },
  });
}

export async function POST(request: NextRequest) {
  const user = await userOrUnauthorized();
  if (!user) return NextResponse.json({ error: "signin_required" }, { status: 401 });
  const body = await request.json() as { project?: Record<string, unknown> };
  if (!body.project || typeof body.project.newsletter_id !== "string" || typeof body.project.name !== "string") {
    return NextResponse.json({ error: "invalid_project" }, { status: 400 });
  }
  const project = body.project;
  const projectId = project.newsletter_id as string;
  const now = Date.now();
  const db = database();
  const existing = await db.prepare(
    "SELECT created_at, COALESCE(MAX(v.version), 0) AS latest_version FROM publication_projects p LEFT JOIN publication_versions v ON v.project_id = p.id AND v.owner_email = p.owner_email WHERE p.id = ? AND p.owner_email = ?"
  ).bind(projectId, user.email).first<{created_at:number|null;latest_version:number|null}>();
  const version = (existing?.latest_version ?? 0) + 1;
  const savedProject = { ...project, version, status: "saved", updated_at: new Date(now).toISOString() };
  const json = JSON.stringify(savedProject);
  await db.batch([
    db.prepare(
      "INSERT INTO publication_projects (id, owner_email, name, data_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, data_json = excluded.data_json, updated_at = excluded.updated_at WHERE owner_email = excluded.owner_email"
    ).bind(projectId, user.email, String(project.name), json, existing?.created_at ?? now, now),
    db.prepare(
      "INSERT INTO publication_versions (id, project_id, owner_email, version, data_json, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(crypto.randomUUID(), projectId, user.email, version, json, now),
  ]);
  return NextResponse.json({ project: savedProject, saved_at: now });
}

export async function DELETE(request: NextRequest) {
  const user = await userOrUnauthorized();
  if (!user) return NextResponse.json({ error: "signin_required" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const db = database();
  await db.batch([
    db.prepare("DELETE FROM publication_versions WHERE project_id = ? AND owner_email = ?").bind(id, user.email),
    db.prepare("DELETE FROM publication_projects WHERE id = ? AND owner_email = ?").bind(id, user.email),
  ]);
  return NextResponse.json({ deleted: id });
}
