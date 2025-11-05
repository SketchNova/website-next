This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
 
Live match data
----------------

The site includes a server-side helper to fetch live match data from Football-Data.org when a
`FOOTBALL_DATA_API_KEY` environment variable is set. If no key is provided, the site falls back to the
static placeholder matches in `src/components/MatchCard.tsx`.

To enable live matches on Vercel:

1. Get a free API key from https://www.football-data.org/ (register and copy your X-Auth-Token).
2. In your Vercel project settings, add an environment variable named `FOOTBALL_DATA_API_KEY` with that token.
3. Push a commit or re-deploy; the server will fetch scheduled matches for the Premier League and show them.

Notes:
- The helper queries the Premier League endpoint by default. Change `src/lib/football.ts` to query another competition if needed.
- Keep your API key private — don't commit it to the repo.

Live news
---------

The site can fetch live news using the NewsAPI.org endpoint. To enable live news:

1. Get an API key from https://newsapi.org/ (register and copy your API key).
2. In your Vercel project settings, add an environment variable named `NEWS_API_KEY` with that token.
3. Push a commit or re-deploy; the server will then fetch recent articles mentioning "Manchester United" and display them on the homepage.

Notes:
- If no API key is provided, the site falls back to the static items in `src/components/NewsCard.tsx`.
- The query is currently fixed to "Manchester United" — update `src/lib/news.ts` if you want a different search term or broader coverage.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
