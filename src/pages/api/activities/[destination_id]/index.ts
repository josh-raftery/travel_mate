import { getActivities } from '@/db/controllers/activitiesController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function getActivitiesByIdHandler(req: NextApiRequest,res: NextApiResponse){

    if (req.method === 'GET') {
        return getActivities(req, res)
    }

}