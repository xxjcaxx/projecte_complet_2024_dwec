export {stringToArray, parseMovies, getMovies}
import { getData, getSupabase } from "./http";

const stringToArray = (string) => {
    let convertedString = string.replace(/',/g, '",').replace(/ '/g, ' "').replace(/\['/g, '["').replace(/'\]/g, '"]');
    return JSON.parse(convertedString);
  };
  
const parseMovies = (movies) => {
    let moviesCopy = structuredClone(movies);
    moviesCopy.forEach(m => { 
    m.genre = stringToArray(m.genre);
    m.companies = stringToArray(m.companies);
    m.countries = stringToArray(m.countries);
  });
  return moviesCopy;
}  

const getMovies = async (search) => {
    const movies = parseMovies(await getData(await getSupabase("movies","*",search)));
    return movies;
}