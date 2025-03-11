import { getCountries } from '@/db/controllers/countriesController';
import { NextApiRequest, NextApiResponse } from 'next';

export default function itineraryHandler(req: NextApiRequest, res: NextApiResponse){
  
  if (req.method === 'GET') {
    return getCountries(req, res)
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};