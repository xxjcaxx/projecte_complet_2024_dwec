import "./styles.scss";
import * as bootstrap from "bootstrap";
import { buildMenu, buildMoviesComponent } from "./views/views";
//import { exampleMovies } from "./tests/examplemovies";
//import { getData, getSupabase } from "./models/http";
import { getMovies } from "./models/movies";


const fillElement = (container) => (content) => { container.innerHTML = ""; container.append(content); }

const router = async (route, container) => {
  const fillContainer = fillElement(container);
  // Rutas con expresiones regulares
  if (/#\/movies\/genre\/.+/.test(route)) {
    let genreID = route.split("/")[3];
    let movies = await getMovies(`genre=ilike.*${genreID}*`);
    fillContainer(buildMoviesComponent(movies));
  } 
  // Rutas a páginas específicas
  else {
    switch (route) {
      case "#/":
        { let movies = await getMovies();
          fillContainer(buildMoviesComponent(movies));
        break; }
      case "#/movies":
        { 
          let movies = await getMovies();
          fillContainer(buildMoviesComponent(movies));
        break; }
      // Añadir más rutas según sea necesario
      default:
        console.log('404 page not found');
    }
  }
};


document.addEventListener("DOMContentLoaded", async () => {
  const menuDiv = document.querySelector("#menu");
  menuDiv.append(buildMenu());
  const containerDiv = document.querySelector("#container");
  
  window.location.hash = "#/";
  router(window.location.hash, containerDiv);
  window.addEventListener("hashchange", () => {
    router(window.location.hash, containerDiv);
  });
  
});
