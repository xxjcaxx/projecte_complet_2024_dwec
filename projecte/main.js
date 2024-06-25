import "./styles.scss";
import * as bootstrap from "bootstrap";
import { buildMenu, buildMoviesComponent } from "./views/views";
//import { exampleMovies } from "./tests/examplemovies";
import { getData, getSupabase, stringToArray } from "./models/http";

document.addEventListener("DOMContentLoaded", async () => {
  const menuDiv = document.querySelector("#menu");
  const containerDiv = document.querySelector("#container");
  containerDiv.innerHTML = "";
  menuDiv.append(buildMenu());
  const movies = (await getData(await getSupabase("movies")))  // candidato a compose
    .map(m => { 
      m.genre = stringToArray(m.genre);
      m.companies = stringToArray(m.companies);
      m.countries = stringToArray(m.countries);
      return m;
    });
  containerDiv.append(buildMoviesComponent(movies));
  console.log(movies.length);
});
