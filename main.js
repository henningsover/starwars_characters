const charactersUrls = getAllUrlPages();
const charactersSection = document.querySelector('#characters');
const infoSection = document.querySelector('.info');
const searchField = document.querySelector('#searchField');
let characters = [];

function getAllUrlPages() {
  let urls = [];
  for (let i = 1; i < 10; i++) {
    let page = "https://swapi.dev/api/people/?page=" + i;
    urls.push(page);
  }
  return urls;
}

function loadCharacters() {
  Promise.all(charactersUrls.map(u => fetch(u))).then(responses =>
    Promise.all(responses.map(res => res.json()))
  ).then(results => {
    results.forEach(result => {
      let characterArr = result.results;
      characterArr.forEach(character => {
        characters.push(character)
      })
      console.log(characters)
    })
    getAdditionalInfo(characters)
    drawCharacters(characters)
  })
}
loadCharacters();

function getAdditionalInfo(charactersResult) {
  charactersResult.forEach(function (character, i) {
    fetch(character.homeworld)
      .then(response => response.json())
      .then(function (data) {
        character.homeworld = data.name;
      }).catch(function (err) {
        console.log('error', err);
      })
    // character.films.forEach(function (film, i) {
    //   fetch(film)
    //     .then(response => response.json())
    //     .then(function (data) {
    //       character.films.splice(i, 1, data.title)
    //     }).catch(function (err) {
    //       console.log('error', err);
    //     })
    // })
  })
}

function drawCharacters(toDraw) {
  charactersSection.innerHTML = "";
  let filterText = searchField.value.toLowerCase();
  if (filterText) {
    toDraw = toDraw.filter(function (character) {
      return character.name.toLowerCase().includes(filterText)
    })
  }
  toDraw.forEach(function (character, i) {
    let characterWrapper = document.createElement('div');
    characterWrapper.classList.add('character');
    characterWrapper.setAttribute('id', i)
    characterWrapper.addEventListener('click', showInfo);
    let name = document.createElement('span');
    name.innerHTML = character.name;
    characterWrapper.appendChild(name);
    charactersSection.appendChild(characterWrapper);
  });
}
function showInfo() {
  if (infoSection.classList.contains('hidden')) {
    infoSection.classList.remove('hidden')
  }
  let characterId = parseInt(this.id)
  console.log(characterId)
  let characterToDisplay = characters[characterId];
  console.log(characterToDisplay)
  let infoWrapper = document.querySelector('.info');
  let name = document.querySelector('.info__name');
  name.innerHTML = characterToDisplay.name;
  let birthDate = document.querySelector('.info__birth');
  birthDate.innerHTML = "<strong>Year of birth:</strong> " + characterToDisplay.birth_year
  let height = document.querySelector('.info__height');
  height.innerHTML = "<strong>Height:</strong> " + characterToDisplay.height
  let eyes = document.querySelector('.info__eyes');
  eyes.innerHTML = "<strong>Eye color:</strong> " + characterToDisplay.eye_color
  let hair = document.querySelector('.info__hair');
  hair.innerHTML = "<strong>Hair color:</strong> " + characterToDisplay.hair_color
  let homeWorld = document.querySelector('.info__homeworld');
  homeWorld.innerHTML = "<strong>Home world:</strong> " + characterToDisplay.homeworld;
  // let filmsUl = document.querySelector('.info__films');
  // filmsUl.innerHTML = "";
  // characterToDisplay.films.forEach(function (film) {
  //   let filmLi = document.createElement('li');
  //   filmLi.innerHTML = film;
  //   filmsUl.appendChild(filmLi);
  // })
}
const closeBtn = document.querySelector('.close-btn')
closeBtn.addEventListener('click', function () {
  infoSection.classList.add('hidden');
})

searchField.addEventListener('input', function () {
  drawCharacters(characters);
  console.log(searchField.value)
})
