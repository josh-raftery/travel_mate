import { postDestination } from '@/db/controllers/destinationsController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function postDestinationHandler(req: NextApiRequest,res: NextApiResponse){

    if(req.method == 'POST'){
        return postDestination(req,res)
    }
}