const inputText = document.querySelector('input');
let autoConpliteWrapper = document.querySelector(`.autocomplite-wrapper`);
const inputWrapper = document.querySelector('.input-wrapper')
let autoConplites
let selectedRepos = document.querySelector('.selected-repos');

function getRepos (key) {
  return fetch(`https://api.github.com/search/repositories?q=${key}&per_page=5&page=1`).then(
    response => response.json(),
  )
}

function createAutoComplite(reposTitle) {
  autoConpliteWrapper.innerHTML = '';
  const reposNameText = document.createElement(`p`);
  reposNameText.textContent = reposTitle;
  reposNameText.classList.add(`autocomplite__elem`);

  return reposNameText
} 

function createAddedRepo (repos) {
  const reposCard = document.createElement(`div`);
  reposCard.classList.add(`selected-repo`);

  const ButtonRemoveRepos = document.createElement('button');
  ButtonRemoveRepos.classList.add(`button-remove`)
  reposCard.append(ButtonRemoveRepos);

  const liName = document.createElement('p');
  liName.innerHTML = `Name: ${repos.name}`;
  reposCard.append(liName);
 
  const liOwner = document.createElement('p');
  liOwner.innerHTML = `Owner: ${repos.owner.login}`;
  reposCard.append(liOwner);

  const liStarts = document.createElement('p');
  liStarts.innerHTML = `stars: ${repos.stargazers_count}`;
  reposCard.append(liStarts);

  selectedRepos.appendChild(reposCard);
}
 
async function autoConplite(input) {
  if(!input.value) {
    autoConpliteWrapper.innerHTML = '';
    return
  }
  try {
    const repos = await getRepos(input.value);
    if(!repos.items) return

    autoConplites = repos.items;
    const fragment = document.createDocumentFragment();

      autoConplites.forEach(element => {
        const card = createAutoComplite(element.name);
        fragment.appendChild(card)
      });
      autoConpliteWrapper.appendChild(fragment);
  } catch (e) {console.log(e)}
} 

const debounce = (fn, debounceTime) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
};

let debounAutoConp = debounce(autoConplite, 500)

inputText.addEventListener('input', debounAutoConp.bind(this, inputText))

autoConpliteWrapper.addEventListener('click', (e) => {
  const node = e.target.parentNode;
  let selectedRepos = (autoConplites[[...node.children].indexOf(e.target)]);
  createAddedRepo (selectedRepos);

  inputText.value = ``;
  autoConpliteWrapper.innerHTML = '';
})

selectedRepos.addEventListener('click', (elem) => {
  if(!elem.target.classList.contains('button-remove')) return

  elem.target.parentNode.remove()

})
  // добавить слушатель на изменение поисковой строки, добавить туда таймер
  // добавить слушатель на клик по элементу выпадающего меню через делегирование
  // добавить слушатель на кнопку удаления 

 