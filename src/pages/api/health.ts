import type { NextApiRequest, NextApiResponse } from 'next'
import { HealthResponse } from '@/interfaces/index'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  Promise.all([fetch('http://localhost:3000/api/product'), fetch('http://localhost:3000/api/product/1')]).then(values => {
    for (const value of values) {
      let status = value.status;
      status = value.status;
      if (value.status !== 200)
      {
        return false;
      }
    }
    return true;
  }).then(health => {
    if (health)
    {
      res.status(200).json({
        response_code: 200,
        result: {
          health: "good"
        }
      })
    } else {
      res.status(200).json({
        response_code: 200,
        result: {
          health: "bad"
        }
      })
    }
    
  });
}