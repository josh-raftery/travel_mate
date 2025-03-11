import Destinations from '@/interfaces/Destinations';
import db from '../connection'

export async function selectDestinations(queries:any){
    for(let key in queries){
        if(key != 'itinerary_id' && key != 'destination_id'){
            return Promise.reject({
                status: 400,
                msg: "bad request",
            });
        }
    }

    const {itinerary_id,destination_id} = queries
    
    if (!Number(itinerary_id) && itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    const destinationValues = []

    let sqlQueryString = 
        `SELECT *
        FROM destinations`

    if(itinerary_id){
        sqlQueryString += ' WHERE itinerary_id = $1'
        destinationValues.push(Number(itinerary_id))
    }

    if(destination_id){
        sqlQueryString += ' WHERE destination_id = $1'
        destinationValues.push(destination_id)
    }

    sqlQueryString += ';'

    return db
    .query(sqlQueryString,destinationValues)

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


export async function insertDestination(body: Destinations){
    const {
        itinerary_id,
        country_id,
        destination,
        arriving,
        destination_order,
    } = body
    
    if (!itinerary_id || !country_id || !destination || !destination_order) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db
    .query(
        `INSERT INTO destinations (itinerary_id, country_id, destination, arriving, destination_order) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`, 
        [itinerary_id, country_id, destination, arriving, destination_order]
    )
    .then(({ rows }) => {
        return rows[0];
    });
}

export async function updateDestination(body: Destinations, destination_id: any){
    const {
        itinerary_id,
        country_id,
        destination,
        arriving,
        destination_order,
    } = body

    if (!destination_id || !itinerary_id || !country_id || !destination || !arriving || !destination_order) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db

    .query(
        `UPDATE destinations 
        SET itinerary_id = $1, country_id = $2, destination = $3, arriving = $4, destination_order = $5
        WHERE destination_id = $6 
        RETURNING *;`, 
        [
            itinerary_id,
            country_id,
            destination,
            arriving,
            destination_order,
            destination_id
        ]
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