import Countries from '@/interfaces/Countries';
import db from '../connection'

export async function selectCountries(itinerary_id: any){

    if (!Number(itinerary_id)  || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    const countryValues =[]

    let sqlQueryString = 
        `SELECT *
        FROM countries`

    if(itinerary_id){
        sqlQueryString += ' WHERE itinerary_id = $1'
        countryValues.push(Number(itinerary_id))
    }

    sqlQueryString += ';'

    return db
    .query(sqlQueryString,countryValues)

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

export async function insertCountry(body:Countries){
    const {country,country_order,itinerary_id} = body
        
    if (!country || Number(country) || !country_order || !Number(country_order) || !itinerary_id || !Number(itinerary_id)) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db
    .query(
        `INSERT INTO countries 
        (country,country_order,itinerary_id) 
        VALUES 
        ($1, $2, $3)
        RETURNING *;`, 
        [country,country_order,itinerary_id]
    )

    .then(({ rows }) => {
        return rows[0];
    });
}

export async function updateCountry(body:any, country_id:number){
    const {country,country_order,itinerary_id} = body
    
    if (!country || !country_order || !itinerary_id) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db

    .query(
        `UPDATE countries 
        SET country = $1, country_order = $2, itinerary_id = $3
        WHERE country_id = $4
        RETURNING *;`, 
        [country,country_order,Number(itinerary_id), country_id]
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

// export async function deleteCountry(country_id:number){
//     // delete transport, accom, activities, destinations
//     .then(() => {
//         return db.query(
//             `DELETE FROM countries 
//             WHERE country_id = $1
//             ;`
//         ,[country_id])
//     })
// }