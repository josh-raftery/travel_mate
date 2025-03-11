import apiErrorHandler from "@/db/utils/apiErrorHandler";
import { insertDestination, selectDestinations, updateDestination } from "../models/destinationsModel";
import { NextApiRequest, NextApiResponse } from 'next';
import { insertTransportation, selectTransportation, updateTransportation } from "../models/transportationModel";

export async function getTransportation(req: NextApiRequest, res: NextApiResponse){
    
    try {
        const transportation = await selectTransportation(req.query);
        res.status(200).json({ transportation });
    } catch (err) {
        console.log(err)
        apiErrorHandler(err,res)
    }
}

export async function postTransportation(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    
    try {
        const transportation = await insertTransportation(body);
        res.status(201).json({ transportation });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function patchTransportation(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    const {transportation_id} = req.query

    try {
        const transportation = await updateTransportation(body, transportation_id);
        res.status(200).json({ transportation });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}