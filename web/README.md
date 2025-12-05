This folder now contains the entire portfolio. The legacy Vite client and Express server have been removed, so all development happens inside `web/`.

## Repository layout

- `web/` – Next.js 16 application with App Router (the code you are editing)
- `web/src/app/api` – Next API routes used for features such as the résumé download

Everything else in the repo exists only to support this app (e.g. `public/` assets and configs that sit next to this README).

## Getting Started

Install dependencies and run the dev server from this directory:

```bash
cd web
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000). Start editing by modifying files such as `src/app/page.tsx`; changes hot-reload automatically.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
