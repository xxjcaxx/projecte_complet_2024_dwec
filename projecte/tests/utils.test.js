/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { env } from "../environment";

import * as _http from "../models/http";
import * as _views from "../views/views";
import * as _movies from "../models/movies";
import { exampleMovies } from "./examplemovies";
import { Observable } from "rxjs";

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
    beforeAll(async () => {
      server.listen({
        onUnhandledRequest: "bypass",
      });
      (await _http.login(env.EMAIL, env.PASSWORD));
    });
    afterAll(() => server.close());

    test("getSupabase should return a observable", () => {
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
    test("getSupabase should return some movies", async () => {
      let getSupabasePromise = _http.getSupabase("movies");
      let response = await getSupabasePromise;
      let data = await _http.getData(response);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
      expect(data.length).toBeGreaterThan(0);
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
      genre: ["Animation", "Comedy", "Family"],
      companies: ["Pixar Animation Studios"],
      countries: ["United States of America"],
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

    test("getData should return a observable", async () => {
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

  describe("user management", async () => {

    const responseOk = {"id":"8662025a-25be-4777-ae54-66cb6e58929e","aud":"authenticated","role":"authenticated","email":"test@gmail.com","phone":"","confirmation_sent_at":"2024-06-28T14:39:09.806587958Z","app_metadata":{"provider":"email","providers":["email"]},"user_metadata":{"email":"test@gmail.com","email_verified":false,"phone_verified":false,"sub":"8662025a-25be-4777-ae54-66cb6e58929e"},"identities":[{"identity_id":"209fd965-9ea1-4b16-8e1d-4ce200dfd400","id":"8662025a-25be-4777-ae54-66cb6e58929e","user_id":"8662025a-25be-4777-ae54-66cb6e58929e","identity_data":{"email":"test@gmail.com","email_verified":false,"phone_verified":false,"sub":"8662025a-25be-4777-ae54-66cb6e58929e"},"provider":"email","last_sign_in_at":"2024-06-28T14:39:09.786271233Z","created_at":"2024-06-28T14:39:09.786321Z","updated_at":"2024-06-28T14:39:09.786321Z","email":"test@gmail.com"}],"created_at":"2024-06-28T14:39:09.756356Z","updated_at":"2024-06-28T14:39:11.379383Z","is_anonymous":false};

    const server = setupServer(
      http.post(
        "https://ygvtpucoxveebizknhat.supabase.co/auth/v1/signup",
        // eslint-disable-next-line
        async ({request}) => {
          let peticion = await request.text();
          console.log(peticion);
          if (peticion == `{"email":"test@gmail.com","password":"passwd"}`){
            return HttpResponse.json(responseOk);
          }
          return HttpResponse.json([`mal`]);
        },
      ),
    );
    beforeAll(() => {
      server.listen({
        onUnhandledRequest(request) {
          console.log('Unhandled %s %s', request.method, request.url)
        },
      });
    });
    afterAll(() => server.close());

    test("signup should send a valid json with user data", async () => {
      let signupPromise = await _http.signup("test@gmail.com","passwd");
      let data = await _http.getData(signupPromise);
      expect(data).toEqual(responseOk);
    });

  });
});

describe("Views", () => {
  describe("moviesComponent", async () => {
    let moviesComponent = _views.buildMoviesComponent(
      _movies.parseMovies(exampleMovies),
    );
    test("moviesComponent should return an element", () => {
      expect(moviesComponent).toBeInstanceOf(Element);
    });
  });
  describe("stringToArray", async () => {
    test("stringToArray should return an Array of movies", () => {
      let complexArray = `['Procirep', 'Constellation Productions', 'France 3 Cinéma', 'Claudie Ossard Productions', 'Eurimages', 'MEDIA Programme of the European Union', 'Cofimage 5', 'Televisión Española (TVE)', 'Tele München Fernseh Produktionsgesellschaft (TMG)', "Club d'Investissement Média", 'Canal+ España', 'Elías Querejeta Producciones Cinematográficas S.L.', 'Centre National de la Cinématographie (CNC)', 'Victoires Productions', 'Constellation', 'Lumière Pictures', 'Canal+', 'Studio Image', 'Cofimage 4', 'Ossane', 'Phoenix Images']`;
      let result = _movies.stringToArray(complexArray);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(21);
    });
  });
});

describe("Movies model", () => {
  test("stringToArray should return an Array of movies", () => {
    let complexArray = `['Procirep', 'Constellation Productions', 'France 3 Cinéma', 'Claudie Ossard Productions', 'Eurimages', 'MEDIA Programme of the European Union', 'Cofimage 5', 'Televisión Española (TVE)', 'Tele München Fernseh Produktionsgesellschaft (TMG)', "Club d'Investissement Média", 'Canal+ España', 'Elías Querejeta Producciones Cinematográficas S.L.', 'Centre National de la Cinématographie (CNC)', 'Victoires Productions', 'Constellation', 'Lumière Pictures', 'Canal+', 'Studio Image', 'Cofimage 4', 'Ossane', 'Phoenix Images']`;
    let result = _movies.stringToArray(complexArray);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(21);
    expect(result[9]).toBe(`Club d'Investissement Média`); // El complicado por la ' 
  });

  test("parseMovies should return an Array of movies with arrays parsed", () => {
    let result = _movies.parseMovies(exampleMovies);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(4);
    expect(result.every((m) => m.genre instanceof Array)).toBe(true);
    expect(result.every((m) => m.companies instanceof Array)).toBe(true);
    expect(result.every((m) => m.countries instanceof Array)).toBe(true);
  });

  test("parseMovies should return an Array of movies with arrays parsed", () => {
    let result = _movies.parseMovies(exampleMovies);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(4);
    expect(result.every((m) => m.genre instanceof Array)).toBe(true);
    expect(result.every((m) => m.companies instanceof Array)).toBe(true);
    expect(result.every((m) => m.countries instanceof Array)).toBe(true);
  });

  describe("getMovies", () => {
    const server = setupServer(
      http.get(
        "https://ygvtpucoxveebizknhat.supabase.co/rest/v1/movies",
        // eslint-disable-next-line
        (req, res, ctx) => {
          return HttpResponse.json(exampleMovies);
        },
      ),
    );
    beforeAll(() => {
      server.listen({
        onUnhandledRequest: "bypass",
      });
    });
    afterAll(() => server.close());
    test("getMovies should return an Observable that returns an array of parsed movies", async () => {
      _movies.getMovies();
      expect(_movies.moviesSubject).toBeInstanceOf(Observable);
      _movies.moviesSubject.subscribe(movies => {
        expect(movies).toBeInstanceOf(Array);
        expect(movies.length).toBe(4);
        expect(movies[0].genre).toBeInstanceOf(Array);
      });
    });
  });
});
