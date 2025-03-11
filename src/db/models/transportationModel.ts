import Destinations from '@/interfaces/Destinations';
import db from '../connection'
import Transportation from '@/interfaces/Transportation';

export async function selectTransportation(queries:any){
    for(let key in queries){
        if(key != 'transportation_id' && key != 'itinerary_id'){
            return Promise.reject({
                status: 400,
                msg: "bad request",
            });
        }
    }

    const {transportation_id,itinerary_id} = queries
    
    if (!Number(transportation_id) && transportation_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    const transportationValues = []

    let sqlQueryString = 
        `SELECT *
        FROM transportation`

    if(transportation_id){
        sqlQueryString += ' WHERE transportation_id = $1'
        transportationValues.push(Number(transportation_id))
    }

    if(itinerary_id){
        sqlQueryString += ' WHERE itinerary_id = $1'
        transportationValues.push(itinerary_id)
    }

    sqlQueryString += ';'

    return db
    .query(sqlQueryString,transportationValues)

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


export async function insertTransportation(body: Transportation){
    const {
        itinerary_id,
        transportation_type,
        start_destination,
        leaving_date,
        leaving_time,
        end_destination,
        arrival_date,
        arrival_time,
        transportation_order,
        cost,
        currency
    } = body
    
    if (!itinerary_id || !transportation_type || !start_destination || !end_destination  || !transportation_order) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db
    .query(
        `INSERT INTO transportation (
        itinerary_id,
        transportation_type,
        start_destination,
        leaving_date,
        leaving_time,
        end_destination,
        arrival_date,
        arrival_time,
        transportation_order,
        cost,
        currency
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;`, 
        [itinerary_id, transportation_type, start_destination, leaving_date, leaving_time, end_destination, arrival_date, arrival_time, transportation_order, cost, currency]
    )
    .then(({ rows }) => {
        return rows[0];
    });
}

export async function updateTransportation(body: Transportation, transportation_id: any){
    const {
        transportation_type,
        start_destination,
        leaving_date,
        leaving_time,
        end_destination,
        arrival_date,
        arrival_time,
        transportation_order,
        cost,
        currency,
        itinerary_id
    } = body

    console.log(transportation_id, 'joshtest')

    if (!transportation_type || !start_destination || !end_destination  || !transportation_order || !transportation_id || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db

    .query(
        `UPDATE transportation 
        SET itinerary_id = $1, transportation_type = $2, start_destination = $3, leaving_date = $4, leaving_time = $5, end_destination = $6, arrival_date = $7, arrival_time = $8, transportation_order = $9, cost = $10, currency = $11
        WHERE transportation_id = $12 
        RETURNING *;`, 
        [itinerary_id, transportation_type, start_destination, leaving_date, leaving_time, end_destination, arrival_date, arrival_time, transportation_order, cost, currency,transportation_id]
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