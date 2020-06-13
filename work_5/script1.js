let input_search = document.querySelector('.input_search')
let cat_select = document.querySelector('#cat_select');
let radio = document.getElementsByName('radio');

let jokes = [];

const urlRandomJoke = 'https://api.chucknorris.io/jokes/random';
const categoriesUrl = 'https://api.chucknorris.io/jokes/categories';
const urlCatJoke = 'https://api.chucknorris.io/jokes/random?category='
const searchQuery = 'https://api.chucknorris.io/jokes/search?query=';


class Joke{
	constructor(joke, id, updatedDate, category, jokeUrl, isFavourite = false){
		this.joke = joke;
		this.id = id;
		this.updatedDate = updatedDate;
		this.category = category;
		this.jokeUrl = jokeUrl;
		this.isFavourite = isFavourite;
	}
}

getCategories();
getJoke(urlRandomJoke);

function getInputValue(){
	let searchInput = document.querySelector('.input_search');
	console.log(searchInput);
	searchInput.addEventListener('change', () => {
		
		let searchText = searchQuery + searchInput.value;
		console.log(searchText);
		getJoke(searchText);
	});
}
	


getInputValue();

document.querySelector('.btn').addEventListener('click', () => {
	
	radio.forEach((item, ind) => {
		if(radio[ind].checked){
			radio_val = radio[ind].value;
			switch(radio_val){
				case 'random': 
					cat_select.style.display = 'none'; 
					getJoke(urlRandomJoke);
					break;
				case 'categories': 
					cat_select.style.display = 'block';
					let catUrl = urlCatJoke + getCategory();
					getJoke(catUrl);
					break;
				case 'search':
					
					break;
			}

		}
	});
});


async function getJoke(url) {
	let response = await fetch(url);
	let data = await response.json();

	jokes.push(data);
	renderJoke(data);
}
/*****Отримання категорій****/
async function getCategories() {
	
	let response = await fetch(categoriesUrl);
	let data = await response.json();

	data.forEach((item) => {
		let opt = document.createElement("option");
		opt.innerHTML = item;
		opt.value = item;
		cat_select.appendChild(opt);
	});
}

/******Рендер шутеек**********/
function renderJoke(data){
	const cardWrapper = document.querySelector('.card-wrapper');
	let card = '';

	jokes.forEach(joke => {
		let current_time = Date.now();
		let current_joke = data;
		let { value, id, updated_at, categories, url } = joke;

		let jokeObj = new Joke(value, id, updated_at, categories, url);
		let lastUpdate = Math.floor(((current_time - Date.parse(updated_at))/1000/60/60));
			console.log(value, id, updated_at, categories, url);
		card += `
				<div class="card">
						<div class="card-icon">
							<img src="img/icon.png" alt="">
						</div>
						<div class="card-main">
							<div>ID: <a class="joke_link" href="${url}">${id}</a></div>
							<div class="joke-text">
								<h3>${joke.value}</h3>
							</div>
							<div>Last update: <span class="updated_date">${lastUpdate}</span> hours ago</div>
							
						</div>
						<div class="card-fav">
							<img src="img/heart.png" alt="">
						</div>
					</div>
		`;
	});
	cardWrapper.innerHTML = card;
	jokes = [];
}
/*<div class="joke_category ${categories ? 'show': 'hide'}">${categories}</div>*/

function addToFavourites(){
	let card = document.querySelector('.card');
	let favourites_joke = document.querySelector('.favourites_joke');
	let card_fav = document.querySelector('.card-fav img');
	console.log(card);
	card_fav.addEventListener('click', (event) => {
		if(event.target.style.backgroundColor === '') {
			event.target.style.backgroundColor = 'red';
			const cardClone = card.cloneNode(true);
			favourites_joke.appendChild(cardClone);
			console.log(cardClone);
			console.log(data);
		} else {
			event.target.style.backgroundColor = '';
		}
		
	});
}

function getCategory(){
	return cat_select.value;
}

let card = document.querySelector('.card-wrapper .card');
