import { getUser, patchUser } from '@/db/controllers/usersController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function getUserHandler(req: NextApiRequest,res: NextApiResponse){

  if (req.method === 'GET') {
    return getUser(req,res)
  }

  if (req.method === 'PATCH') {
    return patchUser(req,res)
  }
};
