import { postActivities } from '@/db/controllers/activitiesController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function postActivitiesHandler(req: NextApiRequest,res: NextApiResponse){

    if(req.method == 'POST'){
        return postActivities(req,res)
    }
}