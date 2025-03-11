import { testApiHandler } from 'next-test-api-route-handler';
import seed from '@/db/seeds/seed';
import data from '@/db/data';
import db from '../db/connection'
import transportationByIdHandler from '@/pages/api/[itinerary_id]/transportation/index';
import postTransportationByIdHandler from '@/pages/api/transportation/index';
import patchTransportationHandler from '@/pages/api/[itinerary_id]/transportation/[transportation_id]/index';

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/transportation/:itinerary_id", () => {
    test("GET:200 sends an array of transportation to the client", async () => {
        await testApiHandler({
            pagesHandler: transportationByIdHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.transportation).toEqual([
                    {
                        "itinerary_id": 1,
                        "transportation_type": "bus",
                        "start_destination": "Bangkok",
                        "leaving_date": "07/12/2025",
                        "leaving_time": "09:00",
                        "end_destination": "Pai",
                        "arrival_date": "07/12/2025",
                        "arrival_time": "12:00",
                        "transportation_order": 1,
                        "cost": 500,
                        "currency": "THB",
                        transportation_id: 1 
                    },
                    {
                        "itinerary_id": 1,
                        "transportation_type": "flight",
                        "start_destination": "Pai",
                        "leaving_date": "21/12/2025",
                        "leaving_time": "09:00",
                        "end_destination": "Hanoi",
                        "arrival_date": "21/12/2025",
                        "arrival_time": "12:00",
                        "transportation_order": 2,
                        "cost": 2000,
                        "currency": "THB",
                        transportation_id: 2
                    }
                ]);
            },
        });
    })
    test("GET:400 route returns appropriate error message for wrong type", async () => {
        await testApiHandler({
            pagesHandler: transportationByIdHandler,
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
    test("GET:404 route returns appropriate error message for non-existent itinerary_id", async () => {
        await testApiHandler({
            pagesHandler: transportationByIdHandler,
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

describe('/api/transportation', () => {
    test("POST:201 Valid response upon valid request", async () => {
        await testApiHandler({
            pagesHandler: postTransportationByIdHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 3,
                        "transportation_type": "bullet train",
                        "start_destination": "end_destinationkyo",
                        "leaving_date": "15/05/2025",
                        "leaving_time": "09:00",
                        "end_destination": "Shibuya",
                        "arrival_date": "15/05/2025",
                        "arrival_time": "12:00",
                        "transportation_order": 3,
                        "cost": 15000,
                        "currency": "JPY" 
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.transportation).toEqual({
                    "itinerary_id": 3,
                    "transportation_type": "bullet train",
                    "start_destination": "end_destinationkyo",
                    "leaving_date": "15/05/2025",
                    "leaving_time": "09:00",
                    "end_destination": "Shibuya",
                    "arrival_date": "15/05/2025",
                    "arrival_time": "12:00",
                    "transportation_order": 3,
                    "cost": 15000,
                    "currency": "JPY",
                    transportation_id: 6 
               });
            },
        });
    })
    test("POST:201 Valid response upon request with optional field being left blank", async () => {
        await testApiHandler({
            pagesHandler: postTransportationByIdHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "transportation_type": "flight",
                        "start_destination": "Hanoi",
                        "leaving_date": "",
                        "leaving_time": "",
                        "end_destination": "Ho Chi Minh",
                        "arrival_date": "",
                        "arrival_time": "",
                        "transportation_order": 3,
                        "cost": 0,
                        "currency": ""
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.transportation).toEqual({
                    "itinerary_id": 1,
                    "transportation_type": "flight",
                    "start_destination": "Hanoi",
                    "leaving_date": "",
                    "leaving_time": "",
                    "end_destination": "Ho Chi Minh",
                    "arrival_date": "",
                    "arrival_time": "",
                    "transportation_order": 3,
                    "cost": 0,
                    "currency": "",
                    transportation_id: 7 
               });
            },
        });
    })
    test("POST:201 Valid response upon valid request with surplus fields", async () => {
        await testApiHandler({
            pagesHandler: postTransportationByIdHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "transportation_type": "flight",
                        "start_destination": "Ho Chi Minh",
                        "leaving_date": "",
                        "leaving_time": "",
                        "end_destination": "Saigon",
                        "arrival_date": "",
                        "arrival_time": "",
                        "transportation_order": 4,
                        "cost": 0,
                        "currency": "",
                        additional: true
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.transportation).toEqual({
                    "itinerary_id": 1,
                    "transportation_type": "flight",
                    "start_destination": "Ho Chi Minh",
                    "leaving_date": "",
                    "leaving_time": "",
                    "end_destination": "Saigon",
                    "arrival_date": "",
                    "arrival_time": "",
                    "transportation_order": 4,
                    "cost": 0,
                    "currency": "",
                    transportation_id: 8
               });
            },
        });
    })
    test("POST:400 Error response when request field missing", async () => {
        await testApiHandler({
            pagesHandler: postTransportationByIdHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "transportation_type": "flight",
                        "leaving_date": "",
                        "leaving_time": "",
                        "end_destination": "Saigon",
                        "arrival_date": "",
                        "arrival_time": "",
                        "transportation_order": 4,
                        "cost": 0,
                        "currency": "",
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})

describe('/api/transportation/:itinerary_id/:transportation_id', () => {
    test("PATCH:200 Updates the transportation and responds with the patched transportation", async () => {
        await testApiHandler({
            pagesHandler: patchTransportationHandler,
            params: { transportation_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "transportation_type": "bus",
                        "start_destination": "Bangkok",
                        "leaving_date": "07/12/2025",
                        "leaving_time": "09:00",
                        "end_destination": "Pai",
                        "arrival_date": "07/12/2025",
                        "arrival_time": "12:00",
                        "transportation_order": 1,
                        "cost": 800,
                        "currency": "THB" 
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.transportation).toEqual({
                    "itinerary_id": 1,
                    "transportation_type": "bus",
                    "start_destination": "Bangkok",
                    "leaving_date": "07/12/2025",
                    "leaving_time": "09:00",
                    "end_destination": "Pai",
                    "arrival_date": "07/12/2025",
                    "arrival_time": "12:00",
                    "transportation_order": 1,
                    "cost": 800,
                    "currency": "THB",
                    transportation_id: 1
               });
            },
        });
    })
    test("PATCH:200 Updates the transportation and responds with the patched transportation - ignoring additional properties in the request", async () => {
        await testApiHandler({
            pagesHandler: patchTransportationHandler,
            params: { transportation_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        extra: true,
                        "itinerary_id": 1,
                        "transportation_type": "bus",
                        "start_destination": "Bangkok",
                        "leaving_date": "07/12/2025",
                        "leaving_time": "09:00",
                        "end_destination": "Pai",
                        "arrival_date": "07/12/2025",
                        "arrival_time": "12:00",
                        "transportation_order": 1,
                        "cost": 1000,
                        "currency": "THB" 
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.transportation).toEqual({
                    "itinerary_id": 1,
                    "transportation_type": "bus",
                    "start_destination": "Bangkok",
                    "leaving_date": "07/12/2025",
                    "leaving_time": "09:00",
                    "end_destination": "Pai",
                    "arrival_date": "07/12/2025",
                    "arrival_time": "12:00",
                    "transportation_order": 1,
                    "cost": 1000,
                    "currency": "THB",
                    transportation_id: 1
               });
            },
        });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent transportation_id", async () => {
        await testApiHandler({
            pagesHandler: patchTransportationHandler,
            params: { transportation_id: 17 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "itinerary_id": 1,
                        "transportation_type": "bus",
                        "start_destination": "Bangkok",
                        "leaving_date": "07/12/2025",
                        "leaving_time": "09:00",
                        "end_destination": "Pai",
                        "arrival_date": "07/12/2025",
                        "arrival_time": "12:00",
                        "transportation_order": 1,
                        "cost": 1200,
                        "currency": "THB" 
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
            pagesHandler: patchTransportationHandler,
            params: { transportation_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "transportation_type": "bus",
                        "start_destination": "Bangkok",
                        "leaving_date": "07/12/2025",
                        "leaving_time": "09:00",
                        "end_destination": "Pai",
                        "arrival_date": "07/12/2025",
                        "arrival_time": "12:00",
                        "transportation_order": 1,
                        "cost": 1000,
                        "currency": "THB" 
                   })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})