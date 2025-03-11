import { getActivities } from '@/db/controllers/activitiesController';
import { postDestination } from '@/db/controllers/destinationsController';
import { getTransportation } from '@/db/controllers/transportationController';
import { NextApiRequest,NextApiResponse } from 'next';

export default function getActivitiesByIdHandler(req: NextApiRequest,res: NextApiResponse){

    if (req.method === 'GET') {
        return getActivities(req, res)
    }

}