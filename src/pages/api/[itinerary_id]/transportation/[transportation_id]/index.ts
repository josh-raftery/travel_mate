import { patchTransportation } from '@/db/controllers/transportationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function transportationHandler(req: NextApiRequest,res: NextApiResponse){
    
    if (req.method === 'PATCH') {
        return patchTransportation(req, res)
    }
}