import { postUser } from '@/db/controllers/usersController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function postUserHandler(req: NextApiRequest,res: NextApiResponse){
    if (req.method === 'POST') {
        return postUser(req,res)
    }
}