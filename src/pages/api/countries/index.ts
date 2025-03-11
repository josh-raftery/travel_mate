import { postCountry } from '@/db/controllers/countriesController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function countryHandler(req: NextApiRequest,res: NextApiResponse){
    
    if(req.method == 'POST'){
        return postCountry(req,res)
    }
}