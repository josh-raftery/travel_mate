import { getItineraries, patchItinerary } from '@/db/controllers/itinerariesController';
import { getUser } from '@/db/controllers/usersController';
import { NextApiRequest, NextApiResponse } from 'next';

export default function itineraryHandler(req: NextApiRequest, res: NextApiResponse){
  
  if (req.method === 'GET') {
    return getItineraries(req, res)
  }

  if (req.method === 'PATCH') {
    return patchItinerary(req, res)
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
