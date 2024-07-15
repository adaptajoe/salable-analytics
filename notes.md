---
components/layout.tsx is for the general layout.

datastore/index.tsx is for containing stub data and data requests

api/items/[id].ts is for Next.js data posting

api/items/index.ts mirrors [id].ts; connects to datastore/index.ts

app.tsx contains the SWRConfig and base component; takes in the fetcher

index.tsx is the default component for the page; handles user interaction; connects to the datastore for data
---

---

---

the put should edit an existing record

The index.ts handler needs to check the method coming in and respond accordingly:

GET respond with data array

POST push data to data array return item with the new id (ie don't post data with an id use the max id in the current list or generate a randomUUID())

Get the id from the req path

update/delete that record

After any change mutate

After that look in to setting up SWR with GetServerSideProps and pass the data to the fallback
on SWRConfig

SWRConfig will be at app and page level. App level takes in the fetcher, the page level will take in the fallback

// Daily line/bar chart for sign ups, revenue, cancellations per product; cumulative line
// Global view
// Click into an individual product shows individual data

----

Use fetch for front-end requests; using swr atm; make a regular fetch with a put or post depending on if you're updating or introducing new data

