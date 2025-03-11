import { patchAccomodation } from '@/db/controllers/accomodationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function patchActivitiesHandler(req: NextApiRequest,res: NextApiResponse){
    
    if (req.method === 'PATCH') {
        return patchAccomodation(req, res)
    }
}