import { testApiHandler } from 'next-test-api-route-handler';
import seed from '@/db/seeds/seed';
import data from '@/db/data';
import db from '../db/connection'
import accomodationByIdHandler from '@/pages/api/accomodation/[destination_id]/index';
import postAccomodationHandler from '@/pages/api/accomodation/index';
import patchAccomodationHandler from '@/pages/api/accomodation/[destination_id]/[accomodation_id]/index';
import getAccomodationByItineraryHandler from '@/pages/api/[itinerary_id]/accomodation/index';

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/accomodation/:destination_id", () => {
    test("GET:200 sends an array of accomodation to the client", async () => {
        await testApiHandler({
            pagesHandler: accomodationByIdHandler,
            params: { destination_id: 3 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.accomodation).toEqual(
                    [
                        { 
                            "destination_id": 3, 
                            "name": "Hanoi House", 
                            "start_date": "21/12/2025", 
                            itinerary_id: 1,
                            "end_date": "25/12/2025", 
                            "currency": "VND",
                            "cost": 800, 
                            "address": "123 Old Quarter, Hanoi, Vietnam",
                            accomodation_id: 1
                        }
                    ]
                )
            },
        });
    })
    test("GET:400 route returns appropriate error message for wrong type", async () => {
        await testApiHandler({
            pagesHandler: accomodationByIdHandler,
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
            pagesHandler: accomodationByIdHandler,
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

describe("/api/:itinerary_id/accomodation", () => {
    test("GET:200 sends an array of accomodation to the client", async () => {
        await testApiHandler({
            pagesHandler: getAccomodationByItineraryHandler,
            params: { itinerary_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.accomodation).toEqual(
                    [
                        { 
                            accomodation_id: 1,
                            "destination_id": 3, 
                            "name": "Hanoi House", 
                            "start_date": "21/12/2025", 
                             itinerary_id: 1,
                             "end_date": "25/12/2025", 
                            "currency": "VND",
                            "cost": 800, 
                            "address": "123 Old Quarter, Hanoi, Vietnam" 
                          }
                    ]
                )
            },
        });
    })
    test("GET:400 route returns appropriate error message for wrong type", async () => {
        await testApiHandler({
            pagesHandler: getAccomodationByItineraryHandler,
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
            pagesHandler: getAccomodationByItineraryHandler,
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


describe('/api/accomodation', () => {
    test("POST:201 Valid response upon valid request", async () => {
        await testApiHandler({
            pagesHandler: postAccomodationHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        "destination_id": 3, 
                        "name": "Hanoi Hotel", 
                        itinerary_id: 1,
                        "start_date": "25/12/2025", 
                        "end_date": "26/12/2025", 
                        "currency": "VND",
                        "cost": 600, 
                        "address": "124 Old Quarter, Hanoi, Vietnam"
                      })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.accomodation).toEqual(
                    {
                        "destination_id": 3, 
                        "name": "Hanoi Hotel", 
                        "start_date": "25/12/2025", 
                        "end_date": "26/12/2025", 
                        itinerary_id: 1,
                        "currency": "VND",
                        "cost": 600, 
                        "address": "124 Old Quarter, Hanoi, Vietnam",
                        accomodation_id: 7
                    }
                );
            },
        });
    })
    test("POST:201 Valid response upon request with optional fields being left blank", async () => {
        await testApiHandler({
            pagesHandler: postAccomodationHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "destination_id": 3, 
                        "name": "Hanoi Hotel",
                        "start_date": "", 
                        "end_date": "", 
                        "currency": "",
                        itinerary_id: 1,
                        "cost": 0,
                        "address": "126 Old Quarter, Hanoi, Vietnam",
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.accomodation).toEqual(
                    {
                        "destination_id": 3, 
                        "name": "Hanoi Hotel", 
                        "start_date": "", 
                        "end_date": "", 
                        "currency": "",
                        itinerary_id: 1,
                        "cost": 0,
                        "address": "126 Old Quarter, Hanoi, Vietnam",
                        accomodation_id: 8
                    }
                );
            },
        });
    })
    test("POST:201 Valid response upon valid request with surplus fields", async () => {
        await testApiHandler({
            pagesHandler: postAccomodationHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "destination_id": 3, 
                        "name": "Hanoi Hotel", 
                        "start_date": "25/12/2025", 
                        "end_date": "26/12/2025", 
                        "currency": "VND",
                        "cost": 600, 
                        itinerary_id: 1,
                        "address": "123 Old Quarter, Hanoi, Vietnam",
                        additional: true
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.accomodation).toEqual({
                    "destination_id": 3, 
                    "name": "Hanoi Hotel", 
                    "start_date": "25/12/2025", 
                    "end_date": "26/12/2025", 
                    itinerary_id: 1,
                    "currency": "VND",
                    "cost": 600, 
                    "address": "123 Old Quarter, Hanoi, Vietnam",
                    accomodation_id: 9
                });
            },
        });
    })
    test("POST:400 Error response when request field missing", async () => {
        await testApiHandler({
            pagesHandler: postAccomodationHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "destination_id": 3, 
                        "name": "Hanoi Hotel", 
                        "start_date": "25/12/2025", 
                        "end_date": "26/12/2025", 
                        itinerary_id: 1,
                        "currency": "VND",
                        "cost": 600,
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})

describe('/api/accomodation/:destination_id/:accomodation_id', () => {
    test("PATCH:200 Updates the accomodation and responds with the patched accomodation", async () => {
        await testApiHandler({
            pagesHandler: patchAccomodationHandler,
            params: { accomodation_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        { 
                            "destination_id": 3, 
                            "name": "Hanoi House", 
                            "start_date": "21/12/2025", 
                            itinerary_id: 1,
                            "end_date": "25/12/2025", 
                            "currency": "VND",
                            "cost": 500, 
                            "address": "123 Old Quarter, Hanoi, Vietnam" 
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.accomodation).toEqual(
                    { 
                        "destination_id": 3, 
                        "name": "Hanoi House", 
                        "start_date": "21/12/2025", 
                        "end_date": "25/12/2025", 
                        "currency": "VND",
                        itinerary_id: 1,
                        "cost": 500, 
                        "address": "123 Old Quarter, Hanoi, Vietnam",
                        accomodation_id: 1
                    }
                );
            },
        });
    })
    test("PATCH:200 Updates the accomodation and responds with the patched accomodation - ignoring additional properties in the request", async () => {
        await testApiHandler({
            pagesHandler: patchAccomodationHandler,
            params: { accomodation_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        { 
                            "destination_id": 3, 
                            "name": "Hanoi House", 
                            "start_date": "21/12/2025", 
                            "end_date": "25/12/2025", 
                            "currency": "VND",
                            "cost": 400, 
                            itinerary_id: 1,
                            "address": "123 Old Quarter, Hanoi, Vietnam",
                            additional: true
                        }
                    )
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.accomodation).toEqual(
                    { 
                        "destination_id": 3, 
                        "name": "Hanoi House", 
                        "start_date": "21/12/2025", 
                        "end_date": "25/12/2025", 
                        itinerary_id: 1,
                        "currency": "VND",
                        "cost": 400, 
                        "address": "123 Old Quarter, Hanoi, Vietnam",
                        accomodation_id: 1
                    }
                );
            },
        });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent accomodation_id", async () => {
        await testApiHandler({
            pagesHandler: patchAccomodationHandler,
            params: { accomodation_id: 17 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        { 
                            "destination_id": 3, 
                            "name": "Hanoi House", 
                            "start_date": "21/12/2025", 
                            "end_date": "25/12/2025", 
                            itinerary_id: 1,
                            "currency": "VND",
                            "cost": 400, 
                            "address": "123 Old Quarter, Hanoi, Vietnam",
                            additional: true
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
            pagesHandler: patchAccomodationHandler,
            params: { accomodation_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        { 
                            "name": "Hanoi House", 
                            "start_date": "21/12/2025", 
                            itinerary_id: 1,
                            "end_date": "25/12/2025", 
                            "currency": "VND",
                            "cost": 400, 
                            "address": "123 Old Quarter, Hanoi, Vietnam",
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
