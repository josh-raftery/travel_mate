import { postAccomodation } from '@/db/controllers/accomodationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function postAccomodationHandler(req: NextApiRequest,res: NextApiResponse){

    if(req.method == 'POST'){
        return postAccomodation(req,res)
    }
}