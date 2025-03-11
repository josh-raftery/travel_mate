import { patchDesination } from '@/db/controllers/destinationsController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function destinationHandler(req: NextApiRequest,res: NextApiResponse){
    
    if (req.method === 'PATCH') {
        return patchDesination(req, res)
    }
}