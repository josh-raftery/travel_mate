import Itineraries from "@/interfaces/Itineraries";
import db from '../connection'

export async function selectItineraries(queries:any){
    
    for(let key in queries){
        if(key != 'itinerary_id' && key != 'username'){
            return Promise.reject({
                status: 400,
                msg: "bad request",
            });
        }
    }

    const {itinerary_id,username} = queries
    
    if (!Number(itinerary_id) && itinerary_id) {
        return Promise.reject({
          status: 400,
          msg: "bad request",
        });
    }

    const itineraryValues =[]

    let sqlQueryString = 
        `SELECT *
        FROM itineraries`

    if(itinerary_id){
        sqlQueryString += ' WHERE itinerary_id = $1'
        itineraryValues.push(Number(itinerary_id))
    }

    if(username){
        sqlQueryString += ' WHERE username = $1'
        itineraryValues.push(username)
    }

    sqlQueryString += ';'

    return db
    .query(sqlQueryString,itineraryValues)

    .then(({ rows }) => {
        if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "not found",
        });
        }
        return rows;
    });
}

export async function insertItinerary(body: Itineraries){
    const {name,username} = body
    
    if (!name || Number(name) || !username) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db
    .query(
        `INSERT INTO itineraries 
        (name,username) 
        VALUES 
        ($1, $2)
        RETURNING *;`, 
        [name,username]
    )

    .then(({ rows }) => {
        return rows[0];
    });
}

export function updateItinerary(body: Itineraries, itinerary_id: any){
    const {name,username} = body

    if (!name || !username || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db

    .query(
        `UPDATE itineraries 
        SET name = $1, username = $2
        WHERE itinerary_id = $3 
        RETURNING *;`, 
        [name, username, Number(itinerary_id)]
    )

    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "not found"
            })
        } else {
            return rows[0];
        }
    });
}