/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import * as _http from "../models/http";
import * as _views from "../views/views";
import { exampleMovies } from "./examplemovies";

describe("http service", () => {
  describe("getSupabase", async () => {
    const server = setupServer(
      http.get(
        "https://ygvtpucoxveebizknhat.supabase.co/rest/v1/fallo",
        // eslint-disable-next-line
        (req, res, ctx) => {
          return HttpResponse.error();
        },
      ),
    );
    beforeAll(() => {
      server.listen({
        onUnhandledRequest: "bypass",
      });
    });
    afterAll(() => server.close());

    test("getSupabase should return a promise", () => {
      let getSupabasePromise = _http.getSupabase("movies");
      expect(getSupabasePromise).toBeInstanceOf(Promise);
    });
    test("getSupabase should return a promise that not fails and returns a Response", async () => {
      let getSupabasePromise = _http.getSupabase("movies");
      await expect(getSupabasePromise).resolves.toBeInstanceOf(Response);
    });

    test("getSupabase should return a response 200 ok", async () => {
      let getSupabasePromise = _http.getSupabase("movies");
      let response = await getSupabasePromise;
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
    });
    test("getSupabase with bad url should return an error", async () => {
      try {
        await _http.getSupabase("fallo");
        throw new Error("La función debería haber lanzado un error");
      } catch (error) {
        console.log(error);
        expect(error).toBe("Network Error");
      }
    });
    test("getSupabase should return an error if table not exists", async () => {
      let getSupabaseNotExists = _http.getSupabase("notexists");
      try {
        await getSupabaseNotExists;
        throw new Error("La función debería haber lanzado un error");
      } catch (error) {
        expect(error).toBe("Bad request");
      }
    });
  });
  describe("getData", () => {
    const exampleMovie = {
      adult: false,
      belongs_to_collection: "Toy Story Collection",
      budget: "30000000",
      original_language: "en",
      original_title: "Toy Story",
      overview:
        "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz. But when circumstances separate Buzz and Woody from their owner, the duo eventually learns to put aside their differences.",
      popularity: 21.946943,
      release_date: "1995-10-30",
      revenue: "373554033.0",
      runtime: "81.0",
      tagline: "not available",
      title: "Toy Story",
      vote_average: "7.7",
      vote_count: "5415.0",
      languages: "['English']",
      day_of_week: "Monday",
      month: "Oct",
      season: "Q4",
      year: "1995",
      has_homepage: "YES",
      genre: "['Animation', 'Comedy', 'Family']",
      companies: "['Pixar Animation Studios']",
      countries: "['United States of America']",
    };
    const server = setupServer(
      http.get(
        "https://ygvtpucoxveebizknhat.supabase.co/rest/v1/movies",
        // eslint-disable-next-line
        (req, res, ctx) => {
          return HttpResponse.json([exampleMovie]);
        },
      ),
    );
    beforeAll(() => {
      server.listen({
        onUnhandledRequest: "bypass",
      });
    });
    afterAll(() => server.close());

    test("getData should return a promise", async () => {
      let getSupabasePromise = await _http.getSupabase("movies");
      let data = _http.getData(getSupabasePromise);
      expect(data).toBeInstanceOf(Promise);
    });
    test("getData should return a movie", async () => {
      let getSupabasePromise = await _http.getSupabase("movies");
      let data = await _http.getData(getSupabasePromise);
      expect(data).toEqual([exampleMovie]);
    });
  });
});

describe("Views", () => {
  describe("moviesComponent", async () => {
    let moviesComponent = _views.buildMoviesComponent(exampleMovies);
    test("moviesComponent should return an element", () => {
      expect(moviesComponent).toBeInstanceOf(Element);
    });
  });
});
