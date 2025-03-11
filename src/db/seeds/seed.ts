import format from 'pg-format'
import db from '../connection'
import SeedData from '@/interfaces/SeedData'

const seed = ({ accomodationData, activitiesData, countriesData, destinationsData, transportationData, usersData, itinerariesData }: SeedData) => {
    return db
    .query(`DROP TABLE IF EXISTS accomodation;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS activities;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS transportation;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS destinations;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS countries;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS itineraries;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
        return db.query(`
        CREATE TABLE users (
            username VARCHAR PRIMARY KEY,
            name VARCHAR NOT NULL
        );`
        )
    })
    .then(() => {
        return db.query(`
        CREATE TABLE itineraries (
            username VARCHAR NOT NULL,
            itinerary_id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE
        );`
        )
    })
    .then(() => {
        return db.query(`
        CREATE TABLE countries (
            country_id SERIAL PRIMARY KEY,
            country VARCHAR,
            country_order INT DEFAULT 0 NOT NULL,
            itinerary_id INT REFERENCES itineraries(itinerary_id) NOT NULL
        );`
        )
    })
    .then(() => {
        return db.query(`
        CREATE TABLE destinations (
            destination_id SERIAL PRIMARY KEY,
            destination VARCHAR NOT NULL,
            arriving VARCHAR NOT NULL,
            destination_order INT DEFAULT 0 NOT NULL,
            itinerary_id INT REFERENCES itineraries(itinerary_id) NOT NULL,
            country_id INT REFERENCES countries(country_id) NOT NULL
        );`
        )
    })
    .then(() => {
        const transportationQuery = db.query(`
        CREATE TABLE transportation (
            transportation_id SERIAL PRIMARY KEY,
            itinerary_id INT REFERENCES itineraries(itinerary_id) NOT NULL,
            transportation_type VARCHAR NOT NULL,
            start_destination VARCHAR NOT NULL,
            leaving_date VARCHAR,
            leaving_time VARCHAR,
            end_destination VARCHAR NOT NULL,
            arrival_date VARCHAR,
            arrival_time VARCHAR,
            transportation_order INT DEFAULT 0 NOT NULL,
            currency VARCHAR,
            cost INT DEFAULT 0
        );`
        )

        const activitiesQuery = db.query(`
        CREATE TABLE activities (
            activity_id SERIAL PRIMARY KEY,
            destination_id INT REFERENCES destinations(destination_id) NOT NULL,
            name VARCHAR NOT NULL,
            description VARCHAR,
            start_date VARCHAR,
            start_time VARCHAR,
            end_date VARCHAR,
            end_time VARCHAR,
            itinerary_id INT REFERENCES itineraries(itinerary_id) NOT NULL,
            currency VARCHAR,
            cost INT DEFAULT 0
        );`
        )

        const accomodationQuery = db.query(`
        CREATE TABLE accomodation (
            accomodation_id SERIAL PRIMARY KEY,
            destination_id INT REFERENCES destinations(destination_id) NOT NULL,
            name VARCHAR NOT NULL,
            start_date VARCHAR,
            end_date VARCHAR,
            itinerary_id INT REFERENCES itineraries(itinerary_id) NOT NULL,
            address VARCHAR NOT NULL,
            cost INT DEFAULT 0,
            currency VARCHAR
        );`
        )

        return Promise.all([accomodationQuery, transportationQuery, activitiesQuery])
    })
    .then(() => {
        const insertUsersQueryStr = format(
            `INSERT INTO users (
                username,
                name
            ) VALUES %L;`,
            usersData.map(
                ({
                    username,
                    name
                }) =>
                    [
                        username,
                        name
                    ]
            )
        );

        return db.query(insertUsersQueryStr);
    })
    .then(() => {
        const insertItineraryQueryStr = format(
            `INSERT INTO itineraries (
                username,
                name
            ) VALUES %L;`,
            itinerariesData.map(
                ({
                    username,
                    name
                }) =>
                    [
                        username,
                        name
                    ]
            )
        );

        return db.query(insertItineraryQueryStr);
    }) 
    .then(() => {
        const insertCountriesQueryStr = format(
            `INSERT INTO countries (
                country,
                itinerary_id, 
                country_order
            ) VALUES %L;`,
            countriesData.map(
                ({
                    country,
                    itinerary_id,
                    country_order
                }) =>
                    [
                        country,
                        itinerary_id,
                        country_order
                    ]
            )
        );

        return db.query(insertCountriesQueryStr);
    })
    .then(() => {
        const insertDestinationQueryStr = format(
            `INSERT INTO destinations (
                itinerary_id, 
                country_id, 
                destination, 
                arriving, 
                destination_order
            ) VALUES %L;`,
            destinationsData.map(
                ({
                    itinerary_id,
                    country_id,
                    destination,
                    arriving,
                    destination_order
                }) =>
                    [
                        itinerary_id,
                        country_id,
                        destination,
                        arriving,
                        destination_order
                    ]
            )
        );

        return db.query(insertDestinationQueryStr);
    })
    .then(() => {
        const insertAccomodationQueryStr = format(
            `INSERT INTO accomodation (
                destination_id,
                name,
                start_date,
                itinerary_id,
                end_date,
                address,
                cost,
                currency
            ) VALUES %L;`,
            accomodationData.map((
                {
                    destination_id,
                    name,
                    start_date,
                    itinerary_id,
                    end_date,
                    address,
                    cost,
                    currency
                }) =>
                [
                    destination_id,
                    name,
                    start_date,
                    itinerary_id,
                    end_date,
                    address,
                    cost,
                    currency
                ]
            )
        );
        const accomodationPromise = db.query(insertAccomodationQueryStr);

        const insertActivitiesQueryStr = format(
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
            ) VALUES %L;`,

            activitiesData.map((
                {
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
                }) =>
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
        );

        const activitiesPromise = db.query(insertActivitiesQueryStr);

        const insertTransportationQueryStr = format(
            `INSERT INTO transportation (
                itinerary_id, 
                transportation_type,
                start_destination,
                leaving_date,
                leaving_time,
                end_destination,
                arrival_time,
                arrival_date,
                transportation_order,
                cost,
                currency
            ) VALUES %L;`,

            transportationData.map((
                {
                    itinerary_id,
                    transportation_type,
                    start_destination,
                    leaving_date,
                    leaving_time,
                    end_destination,
                    arrival_time,
                    arrival_date,
                    transportation_order,
                    cost,
                    currency
                }) =>
                [
                    itinerary_id,
                    transportation_type,
                    start_destination,
                    leaving_date,
                    leaving_time,
                    end_destination,
                    arrival_time,
                    arrival_date,
                    transportation_order,
                    cost,
                    currency
                ]
            )
        );
        const transportationPromise = db.query(insertTransportationQueryStr);

        return Promise.all(
            [
                activitiesPromise,
                accomodationPromise,
                transportationPromise
            ]
        )
    })
    .catch((err) => {
        console.log(err, ' seed error')
    })
}

export default seed