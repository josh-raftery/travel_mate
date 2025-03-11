import { testApiHandler } from 'next-test-api-route-handler';
import seed from '@/db/seeds/seed';
import data from '@/db/data';
import db from '../db/connection'
import ActivitiesByIdHandler from '@/pages/api/activities/[destination_id]/index';
import postActivityHandler from '@/pages/api/activities/index';
import patchActivityHandler from '@/pages/api/activities/[destination_id]/[activity_id]/index';
import activitiesByItineraryHandler from '@/pages/api/[itinerary_id]/activities/index'

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/:itinerary_id/activities", () => {
    test("GET:200 sends an array of activities to the client", async () => {
        await testApiHandler({
            pagesHandler: activitiesByItineraryHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.activities).toEqual( 
                    [
                        { "destination_id": 1,
                            "name": "Pub Crawl",
                            "description": "Visit 8 bars on Kho San Road",
                            "start_date": "03/12/2025",
                            "start_time": "20:00",
                            "end_date": "03/12/2025",
                            "end_time": "23:59",
                            "cost": 1000,
                            activity_id: 1,
                            "currency": "THB",
                            itinerary_id: 1
                        },
                        {
                            "destination_id": 1,
                            "name": "Guided City Tour",
                            "description": "Explore Bangkok's historical sights",
                            "start_date": "04/12/2025",
                            "start_time": "09:00",
                            "end_date": "04/12/2025",
                            "end_time": "15:00",
                            activity_id: 2,
                            itinerary_id: 1,
                            "cost": 500,
                            "currency": "THB"  },
                     
                         { "destination_id": 2,
                            "name": "Tipsy Tubing",
                            "description": "Tube down the river, with bars and games along the way!",
                            "start_date": "07/12/2025",
                            "start_time": "11:00",
                            itinerary_id: 1,
                            "end_date": "07/12/2025",
                            activity_id: 3,
                            "end_time": "17:00",
                            "cost": 700,
                            "currency": "THB"  
                        }
                    ]
                );
            },
        });
    })
    test("GET:400 route returns appropriate error message for wrong type", async () => {
        await testApiHandler({
            pagesHandler: activitiesByItineraryHandler,
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
            pagesHandler: activitiesByItineraryHandler,
            params: { itinerary_id: 61 },
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

describe("/api/activities/:destination_id", () => {
    test("GET:200 sends an array of activities to the client", async () => {
        await testApiHandler({
            pagesHandler: ActivitiesByIdHandler,
            params: { destination_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.activities).toEqual( 
                    [
                        { 
                            activity_id: 1,
                            "destination_id": 1,
                            "name": "Pub Crawl",
                             itinerary_id: 1,
                            "description": "Visit 8 bars on Kho San Road",
                            "start_date": "03/12/2025",
                            "start_time": "20:00",
                            "end_date": "03/12/2025",
                            "end_time": "23:59",
                            "cost": 1000,
                            "currency": "THB"  
                        },
                        { 
                            activity_id: 2,
                            itinerary_id: 1,
                            "destination_id": 1,
                            "name": "Guided City Tour",
                            "description": "Explore Bangkok's historical sights",
                            "start_date": "04/12/2025",
                            "start_time": "09:00",
                            "end_date": "04/12/2025",
                            "end_time": "15:00",
                            "cost": 500,
                            "currency": "THB" 
                        }
                    ]
                );
            },
        });
    })
    test("GET:400 route returns appropriate error message for wrong type", async () => {
        await testApiHandler({
            pagesHandler: ActivitiesByIdHandler,
            params: { destination_id: "one" },
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
            pagesHandler: ActivitiesByIdHandler,
            params: { destination_id: 61 },
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

describe('/api/activities', () => {
    test("POST:201 Valid response upon valid request", async () => {
        await testApiHandler({
            pagesHandler: postActivityHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "destination_id": 3,
                            "name": "Hanoi War Museum",
                            "description": "See the horrors of the Vietnam war",
                            "start_date": "22/12/2025",
                            "start_time": "11:00",
                            "end_date": "22/12/2025",
                            "end_time": "17:00",
                             itinerary_id: 1,
                             "cost": 700,
                            "currency": "VND"  
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.activity).toEqual(
                    {
                        "destination_id": 3,
                        "name": "Hanoi War Museum",
                        "description": "See the horrors of the Vietnam war",
                        itinerary_id: 1,
                        "start_date": "22/12/2025",
                        "start_time": "11:00",
                        "end_date": "22/12/2025",
                        "end_time": "17:00",
                        "cost": 700,
                        "currency": "VND",
                        activity_id: 9 
                    }
                );
            },
        });
    })
    test("POST:201 Valid response upon request with optional fields being left blank", async () => {
        await testApiHandler({
            pagesHandler: postActivityHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "destination_id": 3,
                            "name": "Hanoi Skyscraper Viewpoint",
                            "description": "",
                            "start_date": "",
                            itinerary_id: 1,
                            "start_time": "",
                            "end_date": "",
                            "end_time": "",
                            "cost": 0,
                            "currency": ""  
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.activity).toEqual(
                    {
                        "destination_id": 3,
                        "name": "Hanoi Skyscraper Viewpoint",
                        "description": "",
                        "start_date": "",
                        itinerary_id: 1,
                        "start_time": "",
                        "end_date": "",
                        "end_time": "",
                        "cost": 0,
                        "currency": "",
                        activity_id: 10
                    }
                );
            },
        });
    })
    test("POST:201 Valid response upon valid request with surplus fields", async () => {
        await testApiHandler({
            pagesHandler: postActivityHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "destination_id": 3,
                        "name": "Hanoi Skate Park",
                        "description": "Shred.",
                        "start_date": "28/12/2025",
                        "start_time": "11:00",
                        itinerary_id: 1,
                        "end_date": "28/12/2025",
                        "end_time": "17:00",
                        "cost": 700,
                        "currency": "VND",
                        additional: true
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.activity).toEqual(
                    {
                        "destination_id": 3,
                        "name": "Hanoi Skate Park",
                        "description": "Shred.",
                        "start_date": "28/12/2025",
                        "start_time": "11:00",
                        itinerary_id: 1,
                        "end_date": "28/12/2025",
                        "end_time": "17:00",
                        "cost": 700,
                        "currency": "VND",
                        activity_id: 11
                    }
                );
            },
        });
    })
    test("POST:400 Error response when request field missing", async () => {
        await testApiHandler({
            pagesHandler: postActivityHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "name": "Hanoi Skate Park",
                            "description": "Shred.",
                            "start_date": "28/12/2025",
                            "start_time": "11:00",
                            itinerary_id: 1,
                            "end_date": "28/12/2025",
                            "end_time": "17:00",
                            "cost": 700,
                            "currency": "VND"
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})

describe('/api/activities/:destination_id/:activity_id', () => {
    test("PATCH:200 Updates the activity and responds with the patched activity", async () => {
        await testApiHandler({
            pagesHandler: patchActivityHandler,
            params: { activity_id: 11 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "destination_id": 3,
                        "name": "Hanoi Skate Park",
                        "description": "Shred.",
                        "start_date": "28/12/2025",
                        "start_time": "11:00",
                        "end_date": "28/12/2025",
                        itinerary_id: 1,
                        "end_time": "17:00",
                        "cost": 800,
                        "currency": "VND"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.activity).toEqual(
                    {
                        "destination_id": 3,
                        "name": "Hanoi Skate Park",
                        "description": "Shred.",
                        itinerary_id: 1,
                        "start_date": "28/12/2025",
                        "start_time": "11:00",
                        "end_date": "28/12/2025",
                        "end_time": "17:00",
                        "cost": 800,
                        "currency": "VND",
                        activity_id: 11
                    }
                );
            },
        });
    })
    test("PATCH:200 Updates the activity and responds with the patched activity - ignoring additional properties in the request", async () => {
        await testApiHandler({
            pagesHandler: patchActivityHandler,
            params: { activity_id: 11 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            additional: true,
                            "destination_id": 3,
                            "name": "Hanoi Skate Park",
                            "description": "Shred.",
                            "start_date": "28/12/2025",
                            "start_time": "11:00",
                            itinerary_id: 1,
                            "end_date": "28/12/2025",
                            "end_time": "17:00",
                            "cost": 1000,
                            "currency": "VND",
                            activity_id: 11
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.activity).toEqual(
                    {
                        "destination_id": 3,
                        "name": "Hanoi Skate Park",
                        "description": "Shred.",
                        "start_date": "28/12/2025",
                        "start_time": "11:00",
                        "end_date": "28/12/2025",
                        itinerary_id: 1,
                        "end_time": "17:00",
                        "cost": 1000,
                        "currency": "VND",
                        activity_id: 11
                    }
                );
            },
        });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent activity_id", async () => {
        await testApiHandler({
            pagesHandler: patchActivityHandler,
            params: { activity_id: 17 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "destination_id": 3,
                            "name": "Hanoi Skate Park",
                            "description": "Shred.",
                            itinerary_id: 1,
                            "start_date": "28/12/2025",
                            "start_time": "11:00",
                            "end_date": "28/12/2025",
                            "end_time": "17:00",
                            "cost": 700,
                            "currency": "VND"
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(404);
                expect(json.msg).toBe("not found")
            },
        });
    })
    test("PATCH:400 sends an appropriate status and error message when given an invalid request body", async () => {
        await testApiHandler({
            pagesHandler: patchActivityHandler,
            params: { activity_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "name": "Hanoi Skate Park",
                            "description": "Shred.",
                            "start_date": "28/12/2025",
                            "start_time": "11:00",
                            itinerary_id: 1,
                            "end_date": "28/12/2025",
                            "end_time": "17:00",
                            "cost": 700,
                            "currency": "VND"
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})


