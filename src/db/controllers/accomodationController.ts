import apiErrorHandler from "@/db/utils/apiErrorHandler";
import { NextApiRequest, NextApiResponse } from 'next';
import { insertAccomodation, selectAccomodation, updateAccomodation } from "../models/accomodationModel";

export async function getAccomodation(req: NextApiRequest, res: NextApiResponse){
    
    try {
        const accomodation = await selectAccomodation(req.query);
        res.status(200).json({ accomodation });
    } catch (err) {
        console.log(err)
        apiErrorHandler(err,res)
    }
}

export async function postAccomodation(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    
    try {
        const accomodation = await insertAccomodation(body);
        res.status(201).json({ accomodation });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function patchAccomodation(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    const {accomodation_id} = req.query

    try {
        const accomodation = await updateAccomodation(body, accomodation_id);
        res.status(200).json({ accomodation });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}