import { dataApi } from "@/datastore";
import type { NextApiRequest, NextApiResponse } from "next";

//* 200 - HTTP OK
//* 201 - Created
//! 405 - Method Not Allowed

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      //TODO: Validate the body with Zod
      res.status(201).json(dataApi.post(req.body));
      break;

    case "GET":
      res.status(200).json(dataApi.getList());
      break;

    default:
      res.status(405).end();
  }
}
