// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { mockData } from "@/lib/generateData";
import { ProductResponse, Product } from "@/interfaces/index";
import crypto from "crypto";

const CREATED_STATUS_CODE = 201;

/**
 * Handler for api/product end point to get all products available
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse>
) {
  const { query, method } = req;
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "src/lib/staticMockData.json");
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory, "utf8");
  const staticMockData : Response = JSON.parse(fileContents);
  // const objectData = JSON.parse(jsonData);
  const result = new Array<Product>();
  switch (method)
  {
  case "GET":
    return res.status(200).json({
      response_code: 200,
      // Progrommatically generated mock data
      result : mockData
      // Uncomment to use static mock data reading in from json file
      // result: staticMockData.result
    });
  case "POST":
    let newData = req.body as Product;
    let hasId = false;
    while (!hasId)
    {
      const productId = crypto.randomUUID().split("-")[0];
      if (!mockData.find(data => data.productId === productId))
      {
        newData.productId = productId;
        hasId = true;
      }
    }
    mockData.push(newData);
    result.push(newData);
    return res.status(CREATED_STATUS_CODE).json({
      response_code: CREATED_STATUS_CODE,
      result: result
    });
  }
}
