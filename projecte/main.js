import "./styles.scss";
//import * as bootstrap from "bootstrap";
import { buildMenu, buildMoviesComponent } from "./views";
//import { exampleMovies } from "./tests/examplemovies";
import { getData, getSupabase } from "./http";

document.addEventListener("DOMContentLoaded", async () => {
  const menuDiv = document.querySelector("#menu");
  const containerDiv = document.querySelector("#container");
  containerDiv.innerHTML = "";
  menuDiv.append(buildMenu());
  const movies = await getData(await getSupabase("movies"));
  containerDiv.append(buildMoviesComponent(movies));
  console.log(movies.length);
});
