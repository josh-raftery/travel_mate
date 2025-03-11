import { testApiHandler } from 'next-test-api-route-handler';
import seed from '@/db/seeds/seed';
import data from '@/db/data';
import db from '../db/connection'
import countryByIdHandler from '@/pages/api/[itinerary_id]/countries';
import countryHandler from '@/pages/api/countries/index';
import patchCountryHandler from'@/pages/api/countries/[country_id]/index';

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/:itinerary_id/countries", () => {
    test("GET:200 fetches appropriate country when you query for a valid itinerary", async () => {
        await testApiHandler({
            pagesHandler: countryByIdHandler,
            params: {
                itinerary_id: "1"
            },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.countries).toEqual(
                    [
                        { "itinerary_id": 1, "country": "Thailand", "country_id": 1, "country_order": 1 },
                        { "itinerary_id": 1, "country": "Vietnam", "country_id": 2, "country_order": 2 }
                    ]
                );
            },
        });
    })
    test("GET:400 returns appropriate error message for invalid query ", async () => {
        await testApiHandler({
            pagesHandler: countryByIdHandler,
            params: {
                itinerary: "1"
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
    test("GET:404 returns appropriate error message for non-existant itinerary_id ", async () => {
        await testApiHandler({
            pagesHandler: countryByIdHandler,
            params: {
                itinerary_id: "20"
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
describe('/api/countries', () => {
    test("POST:201 Valid response upon valid request", async () => {
        await testApiHandler({
            pagesHandler: countryHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "itinerary_id": 1, "country": "Cambodia", "country_order": 3 })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.country).toEqual({ "itinerary_id": 1, "country": "Cambodia", "country_order": 3, "country_id": 6 });
            },
        });
    })
    test("POST:201 Valid response upon valid request with surplus fields", async () => {
        await testApiHandler({
            pagesHandler: countryHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "itinerary_id": 1, "country": "Laos", "country_order": 4, nice: true })
                });

                const json = await response.json();
                expect(response.status).toBe(201);
                expect(json.country).toEqual({ "itinerary_id": 1, "country": "Laos", "country_order": 4, country_id: 7 });
            },
        });
    })
    test("POST:400 Error response when request field missing", async () => {
        await testApiHandler({
            pagesHandler: countryHandler,
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "itinerary_id": 1, "country": "Laos"})
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})
describe('/api/countries/:country_id', () => {
    test("PATCH:200 Updates the country and responds with the patched country", async () => {
        await testApiHandler({
            pagesHandler: patchCountryHandler,
            params: { country_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        "itinerary_id": 1, 
                        "country": "Thailand", 
                        "country_order": 2 
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.country).toEqual({ 
                    country_id: 1,
                    "itinerary_id": 1, 
                    "country": "Thailand", 
                    "country_order": 2 
                });
            },
        });
    })
    test("PATCH:200 Updates the country and responds with the patched country - ignoring additional properties in the request", async () => {
        await testApiHandler({
            pagesHandler: patchCountryHandler,
            params: { country_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        "itinerary_id": 1, 
                        "country": "Thailand", 
                        "country_order": 1,
                        extra: true 
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(200);
                expect(json.country).toEqual({ 
                    country_id: 1,
                    "itinerary_id": 1, 
                    "country": "Thailand", 
                    "country_order": 1 
                });
            },
        });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent country_id", async () => {
        await testApiHandler({
            pagesHandler: patchCountryHandler,
            params: { country_id: 17 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        "itinerary_id": 1, 
                        "country": "Thailand", 
                        "country_order": 2 
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
            pagesHandler: patchCountryHandler,
            params: { country_id: 1 },
            test: async ({ fetch }) => {
                const response = await fetch({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        "itinerary_id": 1, 
                        "country": "Thailand"
                    })
                });

                const json = await response.json();
                expect(response.status).toBe(400);
                expect(json.msg).toBe("bad request")
            },
        });
    })
})