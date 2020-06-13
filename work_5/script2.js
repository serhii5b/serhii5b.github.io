let input_search = document.querySelector('.input_search')
let cat_select = document.querySelector('#cat_select');
let radio = document.querySelectorAll('input[name="radio"]');

let jokes = [];
let favouriteJokes = [];

const randomJokeURL = 'https://api.chucknorris.io/jokes/random';
const categoriesURL = 'https://api.chucknorris.io/jokes/categories';
const catJokeURL = 'https://api.chucknorris.io/jokes/random?category='
const searchQueryURL = 'https://api.chucknorris.io/jokes/search?query=';
let searchQuery = '';


/*******************************************/
input_search.addEventListener('change', (event) => {
	searchQuery = searchQueryURL + event.target.value;
	console.log(searchQuery);
});

/*******************************************/
function renderCategories(categories){
	categories.forEach((item) => {
		let opt = document.createElement("option");
		opt.innerHTML = item;
		opt.value = item;
		cat_select.appendChild(opt);
	});
}

function getCategories(){
	let categories = [];
	fetch(categoriesURL)
		.then(res => res.json())
		.then(body => {
			categories = body;
			renderCategories(categories);
		})
		.catch(error => {
			console.log(error);
		});			
}

getCategories();



/************************************/
function renderJoke(data){
	const cardWrapper = document.querySelector('.card-wrapper');
	let card = '';

	data.forEach(joke => {
		let { value, id, updated_at, categories, url } = joke;
		let current_time = Date.now();
		let lastUpdate = Math.floor(((current_time - Date.parse(updated_at))/1000/60/60));
		let current_joke = joke;
		card += `
				<div class="card">
						<div class="card-icon">
							<img src="img/icon.png" alt="">
						</div>
						<div class="card-main">
							<div class="joke_link">ID: <a href="${url}">${id} <img src="img/link.png"></a></div>
							<div class="joke-text">
								<h3>${joke.value}</h3>
							</div>
							<div style="display: flex; justify-content: space-between;">
								<div class="updated_date">Last update: <span>${lastUpdate}</span> hours ago</div>
								<div class="joke_category ${categories.length ? 'show': 'hide'}">${categories}</div>
							</div>
						</div>
						<div class="card-fav">
							<img src="img/heart.png" alt="" onclick="addToFavourites(this)">
						</div>
					</div>
		`;
	});
	cardWrapper.innerHTML = card;

	let cardJokeId = document.querySelector('.joke_link a').innerText;
	let cardJoke = document.querySelector('.card-fav img');
	cardJoke.addEventListener('click', () => {
		// cardJokeId = cardJoke.parentNode.parentNode;
		jokes.forEach(item => {
			console.log(item);
		});
		// console.log('Current id: ', cardJokeId);
	});
	// console.log('jokes arr: ', jokes);


	jokes = [];
}

function getJoke(url) {
	fetch(url)
		.then(res => res.json())
		.then(body => {
			if(body.hasOwnProperty('result')){
				jokes = body.result;
			} else {
				jokes.push(body);
			}
			renderJoke(jokes);
		})
		.catch(error => {
			console.log(error);
		});			
}
getJoke(randomJokeURL);

/*****************************************/
function getInputValue(){
	let searchInput = document.querySelector('.input_search');
	searchInput.addEventListener('change', () => {
		
		let searchText = searchQuery + searchInput.value;
		console.log(searchText);
		getJoke(searchText);
	});
}
	
radio.forEach(radioItem => {
	cat_select.style.display = 'none';
	input_search.style.display = 'none';
	radioItem.addEventListener('click', () => {
		switch(radioItem.value){
			case 'random':
				cat_select.style.display = 'none';
				input_search.style.display = 'none';
			break;
			case 'categories':
				 cat_select.style.display = 'block';
				 input_search.style.display = 'none';
			break;
			case 'search':
				 cat_select.style.display = 'none';
				 // input_search.style.transition = '.5s';
				 input_search.style.display = 'block';
				 
			break;
		}
	});
})




document.querySelector('.btn').addEventListener('click', () => {
		// joke.renderJoke();
	radio.forEach((item, ind) => {
		if(radio[ind].checked){
			radio_val = radio[ind].value;
			switch(radio_val){
				case 'random': 
					// cat_select.style.display = 'none'; 
					getJoke(randomJokeURL);
					break;
				case 'categories': 
					// cat_select.style.display = 'block';
					let catUrl = catJokeURL + getCategory();
					getJoke(catUrl);
					break;
				case 'search':
					getJoke(searchQuery);
					break;
			}

		}
	});
	// favJokes();
});




function addToFavourites(element){
	const card = element.parentNode.parentNode;
	// console.log(card);
	if(element.getAttribute('src') === 'img/heart.png'){
		element.setAttribute('src', 'img/heart-red.png');
		const cardClone = card.cloneNode(true);
		cardClone.style.backgroundColor = '#fff';
		document.querySelector('.favourites_jokes').prepend(cardClone);
	} else {
		let favJokesList =  document.querySelectorAll('.favourites_jokes .card');
		// console.log(favJokesList);
		favJokesList.forEach(item => {
			// console.log(item.querySelector('.joke_link a').innerHTML);
			if(item.querySelector('.joke_link a').innerHTML === card.querySelector('.joke_link a').innerHTML){
				item.remove();
				console.log(card.querySelector('.card-fav img'));
				card.querySelector('.card-fav img').setAttribute('src', 'img/heart.png');
			}
		})
	}
	
}


function getCategory(){
	return cat_select.value;
}

/**************************************************/
document.querySelector('.fav-btn').addEventListener('click', () => {
	document.querySelector('aside').classList.add('active');
	document.querySelector('#overlay-modal').classList.add('active');
});

document.querySelector('.fav-btn-close').addEventListener('click', () => {
	document.querySelector('aside').classList.remove('active');
	document.querySelector('#overlay-modal').classList.remove('active');
});
