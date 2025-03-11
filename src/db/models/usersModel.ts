import Users from '@/interfaces/Users';
import db from '../connection'
import UsersRequest from '@/interfaces/UsersRequest';
import updateItineraryUsernames from '../utils/updateItineraryUsernames';

export async function selectUser(username: any): Promise<Users>{

    if (Number(username)) {
        return Promise.reject({
          status: 400,
          msg: "bad request",
        });
    }

    return db
    .query(
        `SELECT *
        FROM users 
        WHERE username = $1 
        ;`,
        [username]
    )

    .then(({ rows }) => {
        if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "not found",
        });
        }
        return rows[0];
    });
}

export async function insertUser(body: UsersRequest): Promise<Users>{

    const {username, name} = body

    if (!username || !name) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    return db

    .query(
        `INSERT INTO users 
        (username,name) 
        VALUES 
        ($1,$2)
        RETURNING *;`, 
        [username, name]
    )

    .then(({ rows }) => {
        return rows[0];
    });
}

export async function updateUser(body: Users, oldUsername: any): Promise<Users>{ 

    const {username, name} = body

    if (!username || !name || !oldUsername) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        });
    }

    const { rows } = await db

        .query(
            `UPDATE users 
            SET username = $1 , name = $2
            WHERE username = $3 
            RETURNING *;`,
        [username, name, oldUsername]
        );
    if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "not found"
        });
    } else {
        return rows[0];
    }
}