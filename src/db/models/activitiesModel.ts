import db from '../connection'
import Activities from '@/interfaces/Activities';

export async function selectActivities(queries:any){
    for(let key in queries){
        if(key != 'activity_id' && key != 'destination_id'  && key != 'itinerary_id'){
            return Promise.reject({
                status: 400,
                msg: "bad request",
            });
        }
    }

    const {activity_id,destination_id, itinerary_id} = queries
    
    if (!Number(activity_id) && activity_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    } else if (!Number(destination_id) && destination_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    } else if (!Number(itinerary_id) && itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    } 

    const activityValues = []

    let sqlQueryString = 
        `SELECT *
        FROM activities`

    if(activity_id){
        sqlQueryString += ' WHERE activity_id = $1'
        activityValues.push(Number(activity_id))
    }

    if(destination_id){
        sqlQueryString += ' WHERE destination_id = $1'
        activityValues.push(destination_id)
    }

    if(itinerary_id){
        sqlQueryString += ' WHERE itinerary_id = $1'
        activityValues.push(itinerary_id)
    }

    sqlQueryString += ';'

    return db
    .query(sqlQueryString,activityValues)

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


export async function insertActivities(body: Activities){
    const {
        destination_id,
        description,
        name,
        start_date,
        start_time,
        end_date,
        end_time,
        cost,
        itinerary_id,
        currency
    } = body
    
    if (!destination_id || !name || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db
    .query(
        `INSERT INTO activities (
        destination_id,
        description,
        name,
        itinerary_id,
        start_date,
        start_time,
        end_date,
        end_time,
        cost,
        currency
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;`, 
        [
            destination_id,
            description,
            name,
            itinerary_id,
            start_date,
            start_time,
            end_date,
            end_time,
            cost,
            currency
        ]
    )
    .then(({ rows }) => {
        return rows[0];
    });
}

export async function updateActivities(body: Activities, activity_id: any){
    const {
        description,
        itinerary_id,
        name,
        start_date,
        start_time,
        end_date,
        end_time,
        cost,
        currency,
        destination_id
    } = body

    if (!destination_id || !name || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db

    .query(
        `UPDATE activities 
        SET description = $1, itinerary_id = $2, name = $3, start_date = $4, start_time = $5, end_date = $6, end_time = $7, cost = $8, currency = $9, destination_id = $10
        WHERE activity_id = $11 
        RETURNING *;`, 
        [
            description,
            itinerary_id,
            name,
            start_date,
            start_time,
            end_date,
            end_time,
            cost,
            currency,
            destination_id,
            activity_id
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