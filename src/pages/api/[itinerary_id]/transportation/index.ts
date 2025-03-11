import { postDestination } from '@/db/controllers/destinationsController';
import { getTransportation } from '@/db/controllers/transportationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function getTransportationByIdHandler(req: NextApiRequest,res: NextApiResponse){

    if (req.method === 'GET') {
        return getTransportation(req, res)
    }

}