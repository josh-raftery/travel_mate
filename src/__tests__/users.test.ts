import { testApiHandler } from 'next-test-api-route-handler';
import seed from '@/db/seeds/seed';
import data from '@/db/data';
import db from '../db/connection'

import getUserHandler from '@/pages/api/users/[username]';
import postUserHandler from '@/pages/api/users/index'

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('/api/users/:username', () => {
    test('GET:200 route returns correct user object', async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: 'josh' },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.user).toEqual({
                    "username": "josh",
                    "name": "Josh"
                });
            },
        });
    });
    test('GET:400 route returns appropriate error message for wrong type', async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request");
            },
        });
    });
    test('GET:404 route returns appropriate error message for non-existent user', async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: "joshr" },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(404);
                expect(json.msg).toBe("not found");
            },
        });
    });
    test("PATCH:200 Updates the user and responds with the patched user", async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: 'josh' },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "joshua",
                        name:"Josh"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.user).toEqual({
                    "username": "joshua",
                    "name": "Josh"
                });
            },
        });
    })
    test('PATCH:200 Updates the user and responds with the patched user - ignoring additional properties in the request', async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: 'joshua' },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        name:"Josh",
                        hungry: true
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.user).toEqual({
                    "username": "josh",
                    "name": "Josh"
                });
            },
        });
    })
    test('PATCH:409 Responds with appropriate error message when non-unique username is provided', async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: 'josh' },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "emily",
                        name:"Josh"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(409);
                expect(json.msg).toBe("username already exists")
            },
        });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent username", async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: 'julian' },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        name:"Josh"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(404);
                expect(json.msg).toBe("not found")
            },
        });
    });
    test('PATCH:400 sends an appropriate status and error message when given an invalid request body', async () => {
        await testApiHandler({
            pagesHandler: getUserHandler,
            params: { username: 'josh' },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: "josh",
                        name:"Josh"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
});
describe('/api/users', () => {
    test('POST:201 Valid response upon valid request', async () => {
        await testApiHandler({
            pagesHandler: postUserHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "keith",
                        name: "Keith"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.user).toEqual({
                    username: "keith",
                    name: "Keith"
                });
            },
        });
    })
    test('POST:201 Valid response upon valid request with surplus fields', async () => {
        await testApiHandler({
            pagesHandler: postUserHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "kev",
                        name: "Kev",
                        id: "1"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.user).toEqual({
                    username: "kev",
                    name: "Kev"
                });
            },
        });
    })
    test('POST:409 Error response when a non-unique username is provided', async () => {
        await testApiHandler({
            pagesHandler: postUserHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        name: "Josh"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(409);
                expect(json.msg).toBe("username already exists");
            },
        });
    })
    test('POST:400 Error response when request field missing', async () => {
        await testApiHandler({
            pagesHandler: postUserHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: "Keith"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request");
            },
        });
    })
})
