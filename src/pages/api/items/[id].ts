import { dataApi } from "@/datastore";
import type { NextApiRequest, NextApiResponse } from "next";

//* 200 - HTTP OK
//* 204 - Success No Content (No reload)
//! 405 - Method Not Allowed

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  switch (req.method) {
    case "PUT":
      //TODO: Validate the body with Zod
      dataApi.put(id, req.body);
      res.status(204).end();
      break;

    case "DELETE":
      dataApi.delete(id);
      res.status(204).end();
      break;

    case "GET":
      res.status(200).json(dataApi.getDetail(id));
      break;

    default:
      res.status(405).end();
  }
}
