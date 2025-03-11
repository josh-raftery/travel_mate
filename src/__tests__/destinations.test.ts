import { testApiHandler } from 'next-test-api-route-handler';
import seed from '@/db/seeds/seed';
import data from '@/db/data';
import db from '../db/connection'
import destinationsHandler from '@/pages/api/[itinerary_id]/destinations/index';
import postDestinationsHandler from '@/pages/api/destinations/index';
import patchDestinationHandler from '@/pages/api/destinations/[destination_id]/index';

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/:itinerary_id/destinations", () => {
    test("GET:200 sends an destinations to the client", async () => {
        await testApiHandler({
            pagesHandler: destinationsHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.destinations).toEqual([
                    {
                        "itinerary_id": 1,
                        "country_id": 1,
                        "destination": "Bangkok",
                        "destination_id": 1,
                        "arriving": "03/12/2025",
                        "destination_order": 1
                    },
                    {
                        "itinerary_id": 1,
                        "country_id": 1,
                        "destination": "Pai",
                        "destination_id": 2,
                        "arriving": "07/12/2025",
                        "destination_order": 2
                    },
                    {
                        "itinerary_id": 1,
                        "country_id": 2,
                        "destination": "Hanoi",
                        "destination_id": 3,
                        "arriving": "21/12/2025",
                        "destination_order": 1
                    }
                ]);
            },
        });
    })
    test("GET:400 route returns appropriate error message for wrong type", async () => {
        await testApiHandler({
            pagesHandler: destinationsHandler,
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
            pagesHandler: destinationsHandler,
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
})

describe('/api/destinations', () => {
    test("POST:201 Valid response upon valid request", async () => {
        await testApiHandler({
            pagesHandler: postDestinationsHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 3,
                        "country_id": 5,
                        "destination": "Shibuya",
                        "arriving": "15/05/2025",
                        "destination_order": 3
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.destination).toEqual({
                    "itinerary_id": 3,
                    "country_id": 5,
                    "destination": "Shibuya",
                    "arriving": "15/05/2025",
                    "destination_order": 3,
                    "destination_id": 9
               });
            },
        });
    })
    test("POST:201 Valid response upon request with optional field being left blank", async () => {
        await testApiHandler({
            pagesHandler: postDestinationsHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "country_id": 2,
                        "destination": "Ho Chi Minh",
                        "arriving": "",
                        "destination_order": 2
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.destination).toEqual({
                    "itinerary_id": 1,
                    "country_id": 2,
                    "destination": "Ho Chi Minh",
                    "arriving": "",
                    "destination_order": 2,
                    "destination_id": 10
               });
            },
        });
    })
    test("POST:201 Valid response upon valid request with surplus fields", async () => {
        await testApiHandler({
            pagesHandler: postDestinationsHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "country_id": 2,
                        "destination": "Saigon",
                        "arriving": "30/12/2025",
                        "destination_order": 3,
                        additional: true
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.destination).toEqual({
                    "itinerary_id": 1,
                    "country_id": 2,
                    "destination": "Saigon",
                    "arriving": "30/12/2025",
                    "destination_order": 3,
                    "destination_id": 11
               });
            },
        });
    })
    test("POST:400 Error response when request field missing", async () => {
        await testApiHandler({
            pagesHandler: postDestinationsHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "country_id": 2,
                        "destination": "Ho Chi Minh",
                        "arriving": "31/12/2025",
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})

describe('/api/destinations/:destination_id', () => {
    test("PATCH:200 Updates the destination and responds with the patched destination", async () => {
        await testApiHandler({
            pagesHandler: patchDestinationHandler,
            params: { destination_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "country_id": 1,
                        "destination": "Bangkok",
                        "arriving": "05/12/2025",
                        "destination_order": 1
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.destination).toEqual({
                    "itinerary_id": 1,
                    "country_id": 1,
                    "destination": "Bangkok",
                    "arriving": "05/12/2025",
                    "destination_order": 1,
                    "destination_id": 1
               });
            },
        });
    })
    test("PATCH:200 Updates the destination and responds with the patched destination - ignoring additional properties in the request", async () => {
        await testApiHandler({
            pagesHandler: patchDestinationHandler,
            params: { destination_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "country_id": 1,
                        "destination": "Bangkok",
                        "arriving": "04/12/2025",
                        "destination_order": 1,
                        extra: true
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.destination).toEqual({
                    "itinerary_id": 1,
                    "country_id": 1,
                    "destination": "Bangkok",
                    "arriving": "04/12/2025",
                    "destination_order": 1,
                    destination_id: 1
               });
            },
        });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent destination_id", async () => {
        await testApiHandler({
            pagesHandler: patchDestinationHandler,
            params: { destination_id: 17 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "country_id": 1,
                        "destination": "Bangkok",
                        "arriving": "03/12/2025",
                        "destination_order": 1
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
            pagesHandler: patchDestinationHandler,
            params: { destination_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "country_id": 1,
                        "destination": "Bangkok",
                        "arriving": "03/12/2025"
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})