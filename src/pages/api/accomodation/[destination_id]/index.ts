import { getAccomodation } from '@/db/controllers/accomodationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function getActivitiesByIdHandler(req: NextApiRequest,res: NextApiResponse){

    if (req.method === 'GET') {
        return getAccomodation(req, res)
    }

}