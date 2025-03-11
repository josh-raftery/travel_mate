import apiErrorHandler from "@/db/utils/apiErrorHandler";
import { insertItinerary, selectItineraries, updateItinerary } from "../models/itinerariesModel";
import { NextApiRequest, NextApiResponse } from 'next';

export async function getItineraries(req: NextApiRequest, res: NextApiResponse) {

    try {
        const itineraries = await selectItineraries(req.query);
        res.status(200).json({ itineraries });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function postItinerary(req: NextApiRequest, res: NextApiResponse){

    const {body} = req
    
    try {
        const itinerary = await insertItinerary(body);
        res.status(201).json({ itinerary });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function patchItinerary(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    const {itinerary_id} = req.query

    try {
        const itinerary = await updateItinerary(body, itinerary_id);
        res.status(200).json({ itinerary });
    } catch (err) {
        console.log(err, ' patch itinerary controller')
        apiErrorHandler(err,res)
    }
}