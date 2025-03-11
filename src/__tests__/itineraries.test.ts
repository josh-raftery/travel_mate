import { testApiHandler } from 'next-test-api-route-handler';
import seed from '@/db/seeds/seed';
import data from '@/db/data';
import db from '../db/connection'
import getItinerariesHandler from '@/pages/api/itineraries';
import itineraryHandler from '@/pages/api/itineraries/[itinerary_id]';

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/itineraries", () => {
    test("GET:200 sends an array of all itineraries", async () => {
        await testApiHandler({
            pagesHandler: getItinerariesHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.itineraries).toEqual(
                    [
                        {
                            itinerary_id: 1,
                            name: 'Southeast Asia Adventure',
                            username: "josh"
                        },
                        {
                            itinerary_id: 2,
                            name: 'European Highlights',
                            username: "emily"
                        },
                        {
                            itinerary_id: 3,
                            name: 'Japanese Experience',
                            username: "alex"
                        }
                    ]
                );
            },
        });
    })
    test("POST:201 Valid response upon valid request", async () => {
        await testApiHandler({
            pagesHandler: getItinerariesHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        "name": "South America Adventure"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.itinerary).toEqual({
                    username: "josh",
                    "itinerary_id": 4,
                    "name": "South America Adventure"
                });
            },
        });
    })
    test("POST:201 Valid response upon valid request with surplus fields", async () => {
        await testApiHandler({
            pagesHandler: getItinerariesHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        "name": "USA Adventure",
                        "murica": true
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.itinerary).toEqual({
                    username: "josh",
                    "itinerary_id": 5,
                    "name": "USA Adventure"
                });
            },
        });
    })
    test("POST:400 Error response when request field missing", async () => {
        await testApiHandler({
            pagesHandler: getItinerariesHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "username": "josh",
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})

describe("/api/itineraries/:username", () => {
    test("GET:200 fetches appropriate itineraries when you query for a valid user", async () => {
        await testApiHandler({
            pagesHandler: getItinerariesHandler,
            params: {
                username: "josh"
            },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.itineraries).toEqual(
                    [
                        {
                            "username": "josh",
                            "itinerary_id": 1,
                            "name": "Southeast Asia Adventure"
                        },
                        {
                            "username": "josh",
                            "itinerary_id": 4,
                            "name": "South America Adventure"
                        },
                        {
                            "username": "josh",
                            "itinerary_id": 5,
                            "name": "USA Adventure"
                        }
                    ]
                );
            },
        });
    })
    test("GET:400 returns appropriate error message for invalid query ", async () => {
        await testApiHandler({
            pagesHandler: getItinerariesHandler,
            params: {
                user: "josh"
            },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
    test("GET:404 returns appropriate error message for non-existant username ", async () => {
        await testApiHandler({
            pagesHandler: getItinerariesHandler,
            params: {
                username: "jack"
            },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(404);
                expect(json.msg).toBe("not found")
            },
        });
    })
})

describe("/api/itineraries/:itineraries_id", () => {
    test("GET:200 sends an itinerary to the client", async () => {
        await testApiHandler({
            pagesHandler: itineraryHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.itineraries[0]).toEqual({
                    username: "josh",
                    "itinerary_id": 1,
                    "name": "Southeast Asia Adventure"
                });
            },
        });
    })
    test("GET:400 route returns appropriate error message for wrong type", async () => {
        await testApiHandler({
            pagesHandler: itineraryHandler,
            params: { itinerary_id: "one" },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toEqual("bad request")
            },
        });
    })
    test("GET:404 route returns appropriate error message for non-existent itinerry_id", async () => {
        await testApiHandler({
            pagesHandler: itineraryHandler,
            params: { itinerary_id: 6 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(404);
                expect(json.msg).toEqual("not found")
            },
        });
    })

    test("PATCH:200 Updates the user and responds with the patched user", async () => {
        await testApiHandler({
            pagesHandler: itineraryHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        "name": "Southeast Asia Adventure!"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.itinerary).toEqual({
                    username: "josh",
                    "itinerary_id": 1,
                    "name": "Southeast Asia Adventure!"
                });
            },
        });
    })
    test("PATCH:200 Updates the itineraries and responds with the patched itinerary - ignoring additional properties in the request", async () => {
        await testApiHandler({
            pagesHandler: itineraryHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        "name": "Southeast Asia Adventure!!!",
                        "cool": true
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.itinerary).toEqual({
                    username: "josh",
                    "itinerary_id": 1,
                    "name": "Southeast Asia Adventure!!!"
                });
            },
        });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent itinerary_id", async () => {
        await testApiHandler({
            pagesHandler: itineraryHandler,
            params: { itinerary_id: 7 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        "name": "Southeast Asia Adventure"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(404);
                expect(json.msg).toBe("not found")
            },
        });
    })
    test("PATCH:400 sends an appropriate status and error message when given an invalid request body", async () => {
        await testApiHandler({
            pagesHandler: itineraryHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "josh",
                        "title": "Southeast Asia Adventure"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})