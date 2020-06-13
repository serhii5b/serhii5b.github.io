let jokeLink = document.querySelector('.joke_link'),
	jokeText = document.querySelector('.joke-text h3'),
	updatedDate = document.querySelector('.updated_date'),
	joke_category = document.querySelector('.joke_category'),
	input_search = document.querySelector('.input_search')
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
			}

		}
	});
});


async function getJoke(url) {
	let response = await fetch(url);
	let data = await response.json();

	renderJoke(data);
}

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

function renderJoke(data){
	let current_time = Date.now();
	let current_joke = data;
	let { value, id, updated_at, categories, url } = data;

	let jokeObj = new Joke(value, id, updated_at, categories, url);

	jokeLink.innerText = id;
	jokeLink.setAttribute('href', url);
	jokeText.innerText = value;
	updatedDate.innerText = ((current_time - Date.parse(updated_at))/1000/60/60);
	if(categories.length !== 0) {
		joke_category.style.display = 'block';
		joke_category.innerText = categories;
	} else {
		joke_category.style.display = 'none';
	}

}


function addToFavourites(data){
	let card = document.querySelector('.card');
	let favourites_joke = document.querySelector('.favourites_joke');
	let card_fav = document.querySelector('.card-fav img');
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


addToFavourites();