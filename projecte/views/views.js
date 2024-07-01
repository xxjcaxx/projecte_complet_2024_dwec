import { fromEvent, map, distinctUntilChanged, debounceTime, tap } from "rxjs";
//import { getMovies } from "../models/movies";
import {state} from "../models/state";

export { buildMoviesComponent, buildMenu };

const buildMenu = () => {
  const divWrapper = document.createElement("div");
  const menu = `<nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Movies 2024</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/login">Login</a>
        </li>
          <li class="nav-item">
          <a class="nav-link" href="#/profile">Profile</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled">Disabled</a>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <input id="searchInput" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>`;
  divWrapper.innerHTML = menu;
  fromEvent(divWrapper.querySelector("#searchInput"), "keyup")
    .pipe(
      map((event) => event.target.value),
      tap((text) => console.log(text)),
      distinctUntilChanged(), //Para evitar keyups en teclas que no cambian el value
      debounceTime(300), // Para no saturar la búsqueda en Supabase
    )
    .subscribe((searchText) => state.next({search: searchText.length > 0 ? `&title=ilike.*${searchText}*` : '', route: {... state.getValue().route}}));
  return divWrapper.querySelector("nav");
};

const buildMoviesComponent = (movies) => {
  const divWrapper = document.createElement("div");
  divWrapper.classList.add("accordion");
  divWrapper.innerHTML = `
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active" aria-current="page">Movies</li>
    ${'criteria' in  state.getValue().route ? `<li class="breadcrumb-item active" aria-current="page">${state.getValue().route.value}</li>` : '<li class="breadcrumb-item active" aria-current="page">All</li>' }
    ${state.getValue().search != '' ? `<li class="breadcrumb-item active" aria-current="page">${state.getValue().search}</li>` : '' }
  </ol>
</nav>

  `+movies
    .map(
      (m, index) => `<div class="accordion-item">
   
<h2 class="accordion-header" id="panelsStayOpen-heading${index}">
<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${index}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${index}">
${m.original_title}
</button>
</h2>

<div id="panelsStayOpen-collapse${index}"  class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${index}">
<div class="accordion-body">
<h3>Overview</h3>
${m.overview}
<h3>Technical Data:</h3>
<ul class="list-group">
  <li class="list-group-item">Release Date: ${m.release_date}</li>
  <li class="list-group-item">Revenue: ${m.revenue}</li>
  <li class="list-group-item">Runtime: ${m.runtime}</li>
  <li class="list-group-item">Tagline: ${m.tagline}</li>
  <li class="list-group-item">Vote Average: ${m.vote_average}</li>
  <li class="list-group-item">Vote Count: ${m.vote_count}</li>
  <li class="list-group-item">Year: ${m.year}</li>
</ul>
<h3>Genres</h3>
<div class="btn-group" role="group" aria-label="Basic example">
  ${m.genre
    .map(
      (g) =>
        `<button type="button" class="btn btn-primary" data-genre="${g}">${g}</button>`,
    )
    .join("")}

</div>
<h3>Companies</h3>
<div class="btn-group" role="group" aria-label="Basic example">
  ${m.companies
    .map(
      (g) =>
        `<button type="button" class="btn btn-primary" data-company="${g}">${g}</button>`,
    )
    .join("")}

</div>
<h3>Countries</h3>
<div class="btn-group" role="group" aria-label="Basic example">
  ${m.countries
    .map(
      (g) =>
        `<button type="button" class="btn btn-primary" data-country="${g}">${g}</button>`,
    )
    .join("")}

</div>
</div>
</div>

</div>`,
    )
    .join("");

  divWrapper.querySelectorAll("button[data-genre]").forEach((button) =>
    button.addEventListener("click", () => {
      window.location.hash = `#/movies/genre/${button.dataset.genre}`;
    }),
  );
  return divWrapper;
};
