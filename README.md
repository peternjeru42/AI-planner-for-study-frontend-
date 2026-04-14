# AI-planner-for-study-frontend-

Next.js frontend for StudyFlow.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- JWT-based API integration with the Django backend

## Run locally

```bash
npm install
npm run dev
```

## Backend connection

Set the backend API base URL with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## Notes

- Auth, dashboard, subjects, assessments, planner, progress, notifications, settings, and admin pages are wired to the backend API.
- Local build uses Webpack because this machine requires the Next.js WASM SWC fallback.
