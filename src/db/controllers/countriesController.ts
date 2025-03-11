import { NextApiRequest, NextApiResponse } from "next";
import { insertCountry, selectCountries, updateCountry } from "../models/countriesModel";
import apiErrorHandler from "@/db/utils/apiErrorHandler";

export async function getCountries(req: NextApiRequest, res: NextApiResponse){
    const { itinerary_id } = req.query

    try {
        const countries = await selectCountries(itinerary_id);
        res.status(200).json({ countries });
    } catch (err) {
        console.log(err)
        apiErrorHandler(err,res)
    }
}

export async function postCountry(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    
    try {
        const country = await insertCountry(body);
        console.log(country,' <------  response')
        res.status(201).json({ country });
    } catch (err) {
        console.log(err)
        apiErrorHandler(err,res)
    }
}

export async function patchCountry(req: NextApiRequest, res: NextApiResponse){
    const {body} = req
    const { country_id } = req.query
    
    try {
        const country = await updateCountry(body, Number(country_id));
        res.status(200).json({ country });
    } catch (err) {
        console.log(err)
        apiErrorHandler(err,res)
    }
}