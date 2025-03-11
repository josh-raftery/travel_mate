import apiErrorHandler from "@/db/utils/apiErrorHandler";
import { insertDestination, selectDestinations, updateDestination } from "../models/destinationsModel";
import { NextApiRequest, NextApiResponse } from 'next';

export async function getDestinations(req: NextApiRequest, res: NextApiResponse){
    
    try {
        const destinations = await selectDestinations(req.query);
        res.status(200).json({ destinations });
    } catch (err) {
        console.log(err)
        apiErrorHandler(err,res)
    }
}

export async function postDestination(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    
    try {
        const destination = await insertDestination(body);
        res.status(201).json({ destination });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function patchDesination(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    const {destination_id} = req.query

    try {
        const destination = await updateDestination(body, destination_id);
        res.status(200).json({ destination });
    } catch (err) {
        console.log(err, ' patch destination controller')
        apiErrorHandler(err,res)
    }
}