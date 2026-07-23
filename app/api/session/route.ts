import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ signedIn: false });

  return NextResponse.json({
    signedIn: true,
    user: { displayName: user.displayName, email: user.email },
  });
}
