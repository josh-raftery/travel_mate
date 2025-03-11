import Err from "@/interfaces/Err"; 
import { NextApiResponse } from "next";

export default function apiErrorHandler(err:any, res: NextApiResponse): void {
    if (err.code === '23503') {
        res.status(404).json({ msg: 'not found' });
    } else if (err.code === '22P02') {
        res.status(400).json({ msg: 'bad request' });
    } else if(err.code == '23505'){
        res.status(409).json({ msg: 'username already exists' });
    } else if (err.status && err.msg) {
        res.status(err.status).json({ msg: err.msg });
    } else {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}
