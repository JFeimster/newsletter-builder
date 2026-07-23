# Newsletter Builder

An interactive publication operating system for turning a rough newsletter idea
into a positioned, designed, monetizable launch plan.

The application generates and edits:

- publication identity and positioning
- editorial pillars and repeatable issue structures
- a five-email welcome sequence
- lead magnet and referral systems
- sponsor packages
- a distinct 12-issue calendar
- landing-page copy
- a design system
- platform and publication architecture
- launch and implementation exports

## Hosting modes

The codebase intentionally supports two deployment targets:

- **OpenAI Sites** uses Vinext, Cloudflare Workers, ChatGPT sign-in, and the
  configured D1 database for durable saved publications and version history.
- **Vercel** uses the standard Next.js build. The public mirror remains
  session-only unless a separate database and authentication layer are added.

The canonical public URL remains:
`https://newsletter-builder.feimster.chatgpt.site`

## Local development

Requirements:

- Node.js `>=22.13.0`
- npm

Install and run:

```bash
npm ci
npm run dev
```

The local Vinext development server simulates the Sites environment. Browser
session storage keeps the active draft available while the tab remains open.

## Builds

```bash
# Selects the hosting-specific build automatically
npm run build

# OpenAI Sites / Cloudflare artifact
npm run build:sites

# Standard Next.js output for Vercel
npm run build:vercel
```

Vercel sets `VERCEL=1`, so its deployment automatically chooses
`npm run build:vercel`.

## Validation

```bash
npm run lint
VERCEL=1 npm run build:vercel
npm run build:sites
```

## Data and privacy

- The Sites deployment can save signed-in user projects durably using the
  configured D1 binding.
- The Vercel mirror is explicitly session-only.
- No fabricated subscribers, testimonials, sponsors, revenue projections, or
  vendor pricing are used by the builder.
- Platform features and prices should be verified against current official
  sources before implementation.

## Deployment

- Vercel: connect this repository and use the detected Next.js defaults.
- OpenAI Sites: use the Sites lifecycle and preserve `.openai/hosting.json`.

The metadata canonical and social URL intentionally point to the Sites
deployment so the Vercel mirror does not compete with the primary URL in search.
