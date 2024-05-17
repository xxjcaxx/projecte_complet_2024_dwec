import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import * as _http from "../http"


const server = setupServer(
    http.get('https://ygvtpucoxveebizknhat.supabase.co/rest/v1/fallo', (req, res, ctx) => {
        //console.log('dins mocj');
        return HttpResponse.error()
    }),
);

describe("http service", () => {
    describe("getSupabase", async () => {
        beforeAll(() => server.listen());
        afterAll(() => server.close());
        let getSupabasePromise = _http.getSupabase('movies');
        let getSupabaseNotExists = _http.getSupabase('notexists');
        test("getSupabase should return a promise", () => {
            expect(getSupabasePromise).toBeInstanceOf(Promise);
        });
        test("getSupabase should return a promise that not fails and returns a Response", async () => {
            await expect(getSupabasePromise).resolves.toBeInstanceOf(Response);
        });
        let response = await getSupabasePromise;
        test("getSupabase should return a response 200 ok", async () => {
            expect(response.status).toBe(200);
            expect(response.statusText).toBe('OK');
        });
        test("getSupabase should return an error", async () => {
            try {
                await _http.getSupabase('fallo');
                throw new Error('La función debería haber lanzado un error');
            } catch (error) {
                console.log(error);
                expect(error).toBe('Network Error');
            }
        });
        test("getSupabase should return an error if table dont exists", async () => {
            try {
                await getSupabaseNotExists;
                throw new Error('La función debería haber lanzado un error');
            } catch (error) {
                expect(error).toBe('Bad request');
            }
        });

    });
});