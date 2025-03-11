import apiErrorHandler from "@/db/utils/apiErrorHandler";
import { insertDestination, selectDestinations, updateDestination } from "../models/destinationsModel";
import { NextApiRequest, NextApiResponse } from 'next';
import { insertTransportation, selectTransportation, updateTransportation } from "../models/transportationModel";
import { insertActivities, selectActivities, updateActivities } from "../models/activitiesModel";

export async function getActivities(req: NextApiRequest, res: NextApiResponse){
    
    try {
        const activities = await selectActivities(req.query);
        res.status(200).json({ activities });
    } catch (err) {
        console.log(err)
        apiErrorHandler(err,res)
    }
}

export async function postActivities(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    
    try {
        const activity = await insertActivities(body);
        res.status(201).json({ activity });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function patchActivities(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    const {activity_id} = req.query

    try {
        const activity = await updateActivities(body, activity_id);
        res.status(200).json({ activity });
    } catch (err) {
        console.log(err, 'joshjosh')
        apiErrorHandler(err,res)
    }
}