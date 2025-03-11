import { getAccomodation } from '@/db/controllers/accomodationController';
import { postDestination } from '@/db/controllers/destinationsController';
import { getTransportation } from '@/db/controllers/transportationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function getAccomodationByIdHandler(req: NextApiRequest,res: NextApiResponse){

    if (req.method === 'GET') {
        return getAccomodation(req, res)
    }

}