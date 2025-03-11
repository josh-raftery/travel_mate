import { getItineraries, postItinerary } from '@/db/controllers/itinerariesController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function getItinerariesHandler(req: NextApiRequest,res: NextApiResponse){
    if (req.method === 'GET') {
        return getItineraries(req,res)
    }

    if(req.method == 'POST'){
        return postItinerary(req,res)
    }
}