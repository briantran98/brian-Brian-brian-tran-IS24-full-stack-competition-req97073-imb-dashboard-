import type { NextApiRequest, NextApiResponse } from 'next'
import { mockData } from '@/lib/generateData'
import { ProductResponse, Data } from '@/interfaces/index'

export default function productHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query, method } = req;
  const productId : number = Number.parseInt(query.productId as string)
  let dataLocation = mockData.findIndex(data => data.productId === productId);
  const result = new Array<Data>();
  switch (method) {
  case 'GET':
    if (dataLocation)
    {
      result.push(mockData[dataLocation])
    }
    res.status(200).json({
      response_code: 200,
      result: result
    })
    break;
  case 'POST':
    mockData.push(req.body as Data)
    res.status(201).json({
      response_code: 200,
      
    })
    break;
  case 'PUT':
    mockData[dataLocation] = req.body
    res.status(200).json({
      response_code: 200,
      result: mockData[dataLocation]
    })
    break;
  case 'DELETE':
    mockData.splice(dataLocation, 1)
    res.status(200).json({
      response_code: 200
    })
    break;
  }
}