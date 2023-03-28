// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';
import { promises as fs } from 'fs';
import { mockData } from '@/lib/generateData'
import { ProductResponse } from '@/interfaces/index'

/**
 * Handler for api/product end point to get all products available
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'src/lib/staticMockData.json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory, 'utf8');
  const staticMockData : ProductResponse = JSON.parse(fileContents);
  // const objectData = JSON.parse(jsonData);
  res.status(200).json({
    response_code: 200,
    // Progrommatically generated mock data
    result : mockData
    // Uncomment to use static mock data reading in from json file
    // result: staticMockData.result
  })
}
