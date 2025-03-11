import Accomodation from '@/interfaces/Accomodation';
import db from '../connection'

export async function selectAccomodation(queries:any){
    for(let key in queries){
        if(key != 'accomodation_id' && key != 'destination_id'  && key != 'itinerary_id'){
            return Promise.reject({
                status: 400,
                msg: "bad request",
            });
        }
    }

    const {accomodation_id,destination_id, itinerary_id} = queries
    
    if (!Number(accomodation_id) && accomodation_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    } else if (!Number(destination_id) && destination_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }  else if (!Number(itinerary_id) && itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    } 

    const accomodationValues = []

    let sqlQueryString = 
        `SELECT *
        FROM accomodation`

    if(accomodation_id){
        sqlQueryString += ' WHERE accomodation_id = $1'
        accomodationValues.push(Number(accomodation_id))
    }

    if(destination_id){
        sqlQueryString += ' WHERE destination_id = $1'
        accomodationValues.push(destination_id)
    }

    if(itinerary_id){
        sqlQueryString += ' WHERE itinerary_id = $1'
        accomodationValues.push(itinerary_id)
    }

    sqlQueryString += ';'

    return db
    .query(sqlQueryString,accomodationValues)

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


export async function insertAccomodation(body: Accomodation){
    const {
        destination_id,
        name,
        start_date,
        end_date,
        address,
        cost,
        currency,
        itinerary_id
    } = body
    
    if (!destination_id || !name || !address || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db
    .query(
        `INSERT INTO accomodation (
        destination_id,
        name,
        start_date,
        end_date,
        address,
        cost,
        currency,
        itinerary_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
        RETURNING *;`, 
        [
            destination_id,
            name,
            start_date,
            end_date,
            address,
            cost,
            currency,
            itinerary_id
        ]
    )
    .then(({ rows }) => {
        return rows[0];
    });
}

export async function updateAccomodation(body: Accomodation, accomodation_id: any){
    const {
        destination_id,
        name,
        start_date,
        end_date,
        address,
        cost,
        currency,
        itinerary_id
    } = body

    if (!destination_id || !name || !address || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db

    .query(
        `UPDATE accomodation 
        SET destination_id = $1, name = $2, start_date = $3, end_date = $4, address = $5, cost = $6, currency = $7, itinerary_id = $8
        WHERE accomodation_id = $9
        RETURNING *;`, 
        [
            destination_id,
            name,
            start_date,
            end_date,
            address,
            cost,
            currency,
            itinerary_id,
            accomodation_id
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