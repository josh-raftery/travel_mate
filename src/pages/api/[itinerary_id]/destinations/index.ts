import { getDestinations } from '@/db/controllers/destinationsController';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDecorators } from 'typescript';

export default function destinationHandler(req: NextApiRequest, res: NextApiResponse){
  
  if (req.method === 'GET') {
    return getDestinations(req, res)
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
