import { postTransportation } from '@/db/controllers/transportationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function postTransportationHandler(req: NextApiRequest,res: NextApiResponse){

    if(req.method == 'POST'){
        return postTransportation(req,res)
    }
}