# MD Truyện

MD Truyện is a Next.js web novel reader focused on fast browsing, clean chapter reading, internal search, and Docker-based deployment.

## Features

- Next.js App Router + React 19
- Tailwind CSS UI
- Home page with:
  - Hot stories
  - Recently updated stories
  - Categories
  - Recommended stories
  - Completed stories
- Internal story detail pages
- Internal chapter reader pages
- Search page at `/tim-kiem?s=keyword`
- Reader settings saved in `localStorage`
- Affiliate interstitial modal every 5 chapters
- PostgreSQL schema with Prisma
- Docker Compose for local production
- Render Blueprint deployment

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Lucide React
- Cheerio
- PostgreSQL
- Prisma
- Docker

## Local Development

Install dependencies:

```bash
pnpm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Generate Prisma client:

```bash
pnpm db:generate
```

Run dev server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Docker Compose

Build and run the full stack:

```bash
docker compose up -d --build
```

Services:

- Web: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

Default database credentials:

```text
database: book_agent
user: book_agent
password: book_agent_password
```

Check containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f web
```

Stop:

```bash
docker compose down
```

Stop and remove DB volume:

```bash
docker compose down -v
```

## Database

Prisma schema:

```text
prisma/schema.prisma
```

Initial migration:

```text
prisma/migrations/20260503000000_init/migration.sql
```

Main models:

- `Book`
- `Chapter`
- `Genre`
- `BookGenre`
- `CrawlLog`

Run migrations in production:

```bash
pnpm db:migrate
```

Create a development migration:

```bash
pnpm db:dev
```

## Render Deployment

This repo includes:

```text
render.yaml
```

Deploy steps:

1. Push the repo to GitHub.
2. In Render, choose `New` -> `Blueprint`.
3. Select this repo.
4. Render creates:
   - `book-agent-web`
   - `book-agent-db`
5. The web service builds from `Dockerfile`.
6. The container runs Prisma migrations before starting Next.js.

If you create the web service manually instead of using Blueprint, add this environment variable in the Render web service settings:

```text
DATABASE_URL=<Internal Database URL from your Render PostgreSQL instance>
```

The Docker entrypoint skips Prisma migrations when `DATABASE_URL` is missing so the app can still boot, but database-backed features require the variable to be configured.

## Current Data Flow

The app currently crawls public story metadata and chapters at request time, then renders everything inside MD Truyện routes.

The database schema is ready, but the frontend still reads live crawler data first. The next recommended step is to add a sync job that stores books, chapters, genres, and crawl logs in PostgreSQL.

## Important Routes

```text
/                              Home
/tim-kiem?s=keyword            Search
/nguon/sstruyen/[slug]         Story detail
/nguon/sstruyen/[slug]/chuong/[chapterId]
                               Chapter reader
/truyen/kiem-anh-du-hanh       Local sample story
```

## Useful Commands

```bash
pnpm build
pnpm db:generate
pnpm db:migrate
docker compose build web
docker compose up -d
```
