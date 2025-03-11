import { patchActivities } from '@/db/controllers/activitiesController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function patchActivitiesHandler(req: NextApiRequest,res: NextApiResponse){
    
    if (req.method === 'PATCH') {
        return patchActivities(req, res)
    }
}