import type { NextApiRequest, NextApiResponse } from 'next'
import { mockData } from '@/lib/generateData'
import { ProductResponse, Data } from '@/interfaces/index'

const OK_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;
const NOT_FOUND_STATUS_CODE = 404;
const METHOD_NOT_ALLOWED_STATUS_CODE = 405;
const CONFLICT_STATUS_CODE = 409;

export default function productHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse>
) {
  const { query, method } = req;
  const productId : number = Number.parseInt(query.productId as string)
  // Index of specific product Id
  let mockDataIndex = mockData.findIndex(data => data.productId === productId);
  const result = new Array<Data>();
  // Handle specific HTTP methods
  switch (method) {
  case 'GET':
    // If Data is not null then return data and respond with 200
    if (mockData[mockDataIndex])
    {
      result.push(mockData[mockDataIndex])
      return res.status(OK_STATUS_CODE).json({
        response_code: OK_STATUS_CODE,
        result: result
      })
    }
    return res.status(NOT_FOUND_STATUS_CODE).json({
      response_code: NOT_FOUND_STATUS_CODE
    })
  case 'POST':
    // If Data is null then add to database and return result with 201
    if (!mockData[mockDataIndex])
    {
      mockData.push(req.body as Data)
      result.push(req.body)
      return res.status(CREATED_STATUS_CODE).json({
        response_code: CREATED_STATUS_CODE,
        result: result
      })
    } 
    return res.status(CONFLICT_STATUS_CODE).json({
      response_code: CONFLICT_STATUS_CODE
    })
  case 'PUT':
    // If Data is not null then update data return new data and respond with 200
    if (mockData[mockDataIndex])
    {
      mockData[mockDataIndex] = req.body as Data
      result.push(req.body)
      return res.status(OK_STATUS_CODE).json({
        response_code: OK_STATUS_CODE,
        result: result
      })
    }
    return res.status(NOT_FOUND_STATUS_CODE).json({
      response_code: NOT_FOUND_STATUS_CODE
    })
  case 'DELETE':
    // If Data is not null then remove data and return new state with 200
    if (mockData[mockDataIndex])
    {
      mockData.splice(mockDataIndex, 1)
      return res.status(OK_STATUS_CODE).json({
        response_code: OK_STATUS_CODE,
        result : mockData
      })
    }
    return res.status(NOT_FOUND_STATUS_CODE).json({
      response_code: NOT_FOUND_STATUS_CODE
    })
  // Inform client of methods available to this end point
  default:
    res.setHeader('Allow', ['GET','POST', 'PUT', 'DELETE'])
    res.status(METHOD_NOT_ALLOWED_STATUS_CODE).end(`Method ${method} Not Allowed`)
  }
}