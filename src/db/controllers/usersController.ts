import { NextApiRequest, NextApiResponse } from 'next';
import { insertUser, selectUser, updateUser } from '../models/usersModel';
import apiErrorHandler from '@/db/utils/apiErrorHandler';
import { patchItinerary } from './itinerariesController';

export async function getUser(req: NextApiRequest, res: NextApiResponse) {


    const { username } = req.query

    try {
        const user = await selectUser(username);
        res.status(200).json({ user });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function postUser(req: NextApiRequest, res: NextApiResponse){
    const { body } = req

    try {
        const user = await insertUser(body);
        res.status(201).json({ user });
    } catch (err) {
        apiErrorHandler(err,res)
    }
}

export async function patchUser(req: NextApiRequest, res: NextApiResponse){
    const { body } = req
    const { username } = req.query

    try {
        const user = await updateUser(body,username);
        res.status(200).json({ user });
    } catch (err) {
        console.log(err, 'patch user cntrller')
        apiErrorHandler(err,res)
    }
}
