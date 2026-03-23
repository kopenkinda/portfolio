## Medialist

Routes:

- `/medialist`
- `/medialist/login`
- `/medialist/manage`

Stack:

- Next.js app router
- Convex db + actions
- Seeded username/password auth in Convex
- AniList anime search
- TMDB TV search

### Env

```bash
NEXT_PUBLIC_CONVEX_URL=
TMDB_API_KEY=
ADMIN_SEED_SECRET=
```

### Seed owner

```bash
npx convex run seed:seedOwner '{
  "seedSecret": "your-secret",
  "username": "dk",
  "password": "change-me",
  "displayName": "Kopenkin Dmitrii",
  "publicSlug": "dk"
}'
```

### Run

```bash
npx convex dev
pnpm dev
```
