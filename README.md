# Grace Store

A full-stack e-commerce storefront for electronics, built with Next.js.

## Tech Stack
- Next.js (App Router, TypeScript)
- MongoDB Atlas (via Mongoose)
- Custom HMAC-SHA256 session authentication
- Framer Motion

## Getting Started

1. Clone the repo
```bash
   git clone https://github.com/EngGrace/grace-store.git
   cd grace-store
```0

2. Install dependencies
```bash
   npm install
```

3. Set up environment variables
   Copy `.env.example` to `.env.local` and fill in your own values:
```bash
   cp .env.example .env.local
```

4. Run the development server
```bash
   npm run dev
```
   Open [http://localhost:3000](http://localhost:3000)

## Deployment
Deployed on [Vercel](https://vercel.com). Set the same environment variables (`MONGO_URI`, `JWT_SECRET`) in your Vercel project settings.

## License
MIT — see [LICENSE](./LICENSE)