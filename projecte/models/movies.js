export { stringToArray, parseMovies, getMovies, moviesSubject };
import { getData, getSupabase } from "./http";
import { _ } from "../utils/functionals";
// eslint-disable-next-line no-unused-vars
import { from, tap, map, switchMap, Subject } from "rxjs";

const stringToArray = (string) =>
  string.split(",").map((S) =>
    S.replace(/[\\[\]"]/g, "")
      .replace(/^[ ']+/g, "")
      .replace(/'$/g, ""),
  );

const parseArrays = (movie) => {
  const movieCopy = structuredClone(movie);
  ["genre", "companies", "countries"].forEach(
    (a) => (movieCopy[a] = stringToArray(movieCopy[a])),
  );
  return movieCopy;
};

const parseMovies = _.compose(_.curriedMap(parseArrays));

const moviesSubject = new Subject();

const getMovies = (search) => {
  let subscription = from(getSupabase("movies", "*", search))
    .pipe(switchMap(getData), map(parseMovies))
    .subscribe((movies) => {
      moviesSubject.next(movies);
      subscription.unsubscribe();
    });
};
