// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { mockData } from "@/lib/generateData";
import { ProductResponse, Product } from "@/interfaces/index";
import crypto from "crypto";

const CREATED_STATUS_CODE = 201;
const NOT_ACCEPTABLE_STATUS_CODE = 406;

/**
 * Handler for api/product end point to get all products available
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query, method } = req;
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "src/lib/brian-tran_imb_assignment-1.0.0-swagger.json");
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory, "utf8");
  const objectData = JSON.parse(fileContents);
  const result = new Array<Product>();
  switch (method) {
  case "GET":
    return res.status(200).json({
      objectData,
      // Uncomment to use static mock data reading in from json file
      // result: staticMockData.result
    });
  }
}
