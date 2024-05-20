export {buildMoviesComponent,buildMenu}

const buildMenu = () => {
    const divWrapper = document.createElement('div');
    const menu = `<nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Movies</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
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
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>`;
divWrapper.innerHTML = menu;
return divWrapper.querySelector('nav');
}

const buildMoviesComponent = (movies) => {

const divWrapper = document.createElement('div');
divWrapper.classList.add('accordion');
divWrapper.innerHTML =  movies.map((m,index) => `<div class="accordion-item">
<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${index}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${index}">
    
<h2 class="accordion-header" id="panelsStayOpen-heading${index}"></h2>${m.original_title}
</button>
<div id="panelsStayOpen-collapse${index}"  class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${index}">
<div class="accordion-body">
${m.overview}
</div>
</div>

</div>`).join('');
return divWrapper;

}