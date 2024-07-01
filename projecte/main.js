import "./styles.scss";
// eslint-disable-next-line no-unused-vars
import * as bootstrap from "bootstrap";
import { buildMenu, buildMoviesComponent } from "./views/views";
import { getMovies, moviesSubject } from "./models/movies";
import {state} from "./models/state";
import { loginForm } from "./views/login";
import { profileForm } from "./views/profile";

const fillElement = (container) => (content) => {
  container.innerHTML = "";
  container.append(content);
};

let subscription = null;


state.subscribe(currentState => {
  getMovies(`${ 'criteria' in currentState.route ? `${currentState.route.criteria}=ilike.*${currentState.route.value}*` : '' }${currentState.search}`);
});


const router = async (route, container) => {
  console.log(route);
  if (subscription) {
    subscription.unsubscribe();
  }
  const fillContainer = fillElement(container);
  // Rutas con expresiones regulares
  if (/#\/movies\/genre\/.+/.test(route)) {
    let genreID = route.split("/")[3];
    state.next({search: '', route: {criteria: 'genre', value: genreID}});
    subscription = moviesSubject.subscribe((movies) => {
      fillContainer(buildMoviesComponent(movies));
    });
  }
  // Rutas a páginas específicas
  else {
    switch (route) {
      case "#/":
        state.next({search: '', route: {}});
        subscription = moviesSubject.subscribe((movies) => {
          fillContainer(buildMoviesComponent(movies));
        });
        break;
      case "#/movies":
        state.next({search: '', route: {}});
        subscription = moviesSubject.subscribe((movies) => {
          fillContainer(buildMoviesComponent(movies));
        });
        break;
      case "#/login":
          fillContainer(loginForm());
          break;
      case "#/profile":
            fillContainer(profileForm());
            break;
      // Añadir más rutas según sea necesario
      default:
        console.log("404 page not found");
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
