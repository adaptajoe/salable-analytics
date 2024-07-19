---
components/layout.tsx is for the general layout.

datastore/index.tsx is for containing stub data and data requests

api/items/[id].ts is for Next.js data posting

api/items/index.ts mirrors [id].ts; connects to datastore/index.ts

app.tsx contains the SWRConfig and base component; takes in the fetcher

index.tsx is the default component for the page; handles user interaction; connects to the datastore for data
---

