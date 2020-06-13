const ROOT_PRODUCTS = document.querySelector('#products');
const ROOT_HEADER = document.querySelector('#header');
const ROOT_SHOPPING = document.querySelector('#shopping');
const ROOT_SPINNER = document.querySelector('#spinner');
const ROOT_ERROR = document.querySelector('#error');



class LocalStorageUtil{
	constructor(){
		this.keyName = 'products';
	}

	getProducts(){
		const productsLocalStorage = localStorage.getItem(this.keyName);
		if(productsLocalStorage !== null){
			return JSON.parse(productsLocalStorage);
		}
		return [];
	}

	putProducts(id){
		let products = this.getProducts();
		let pushProduct = false;
		const index = products.indexOf(id);
		if(index === -1){
			products.push(id);
			pushProduct = true;
		} else {
			products.splice(index, 1);
		}

		localStorage.setItem(this.keyName, JSON.stringify(products));

		return {pushProduct, products};
	}
}

const localStorageUtil = new LocalStorageUtil();


/**********************************/
class Header{
	handleOpenShoppingPage(){
		shoppingPage.render();
	}

	render(count) {
		const html = `
			<div class="header-container">
				<div class="header-counter" onclick="headerPage.handleOpenShoppingPage();"> 
					📂 ${count}
				</div>
			</div>
		`;

		ROOT_HEADER.innerHTML = html;
	}
}
const headerPage = new Header();


/**********************************/
class Products {

	constructor(){
		this.classNameActive = 'products-element__btn_active';
		this.labelAdd = 'Add to cart';
		this.labelRemove = 'Remove from cart';

	}

	handleSetLocationStorage(element, id){
		const { pushProduct, products } = localStorageUtil.putProducts(id);

		if(pushProduct){
			element.classList.add(this.classNameActive);
			element.innerHTML = this.labelRemove;
		} else {
			element.classList.remove(this.classNameActive);
			element.innerHTML = this.labelAdd;
		}
		console.log(element, id);
		headerPage.render(products.length);
	}

	render() {
		const productsStore = localStorageUtil.getProducts();
		let htmlCatalog = '';

		CATALOG.forEach(({ id, name, price, img }) => {
			let activeClass = '';
			let activeText = '';

			if(productsStore.indexOf(id) === -1){
				activeText = this.labelAdd;
			} else {
				activeClass = ' ' + this.classNameActive;
				activeText = this.labelRemove;
			}

			htmlCatalog += `
				<li class="products-element">
					<span class="products-element__name">${name}</span>
					<img src="${img}" class="products-element__img">
					<span class="products-element__price">💰 ${price.toLocaleString() } USD</span>
					<button class="products-element__btn ${activeClass}" onclick="productsPage.handleSetLocationStorage(this, '${id}')">
						${ activeText }
					</button>
				</li>
			`;
		});

		const html = `
			<ul class="products-container">
				${htmlCatalog}
			</ul>
		`;

		ROOT_PRODUCTS.innerHTML = html;
	}
}

const productsPage = new Products();


/**********************************/
class Shopping{
	handleClear() {
		ROOT_SHOPPING.innerHTML = '';
	}

	deleteProducts(element, id){
		const { pushProduct, products } = localStorageUtil.putProducts(id);

		shoppingPage.render();
		productsPage.render();
		headerPage.render(products.length);
	}
	calculateSum(element, price){
		console.log(price * element.value);
		return price * element.value;
	}

	render() {
		const productsStore = localStorageUtil.getProducts();
		let htmlCatalog = '';
		let sumCatalog = 0;
		let sumCatalog1 = 0;

		CATALOG.forEach(({ id, name, price }) => {
			if(productsStore.indexOf(id) !== -1){
				htmlCatalog += `
				<tr>
					<td class="shopping-element__name">✔️ ${name}</td>
					<td class="shopping-element__price">${price.toLocaleString()} USD</td>
					<td class="shopping-element__count"><input type="number" value="1" oninput="shoppingPage.calculateSum(this, '${price}')"></td>
					<td class="shopping-element__btn"><button onclick="shoppingPage.deleteProducts(this, '${id}')">X</button></td>
				</tr>`;
				sumCatalog += price;
				sumCatalog1 += shoppingPage.calculateSum(this, price);
				console.log(sumCatalog1);
			}
		})

		const html = `
			<div class="shopping-container">
				<div class="shoppng__close" onclick="shoppingPage.handleClear();"></div>
				<table>
					${htmlCatalog}
					<tr>
						<td class="shopping-element__name">💲 Сумма</td>
						<td class="shopping-element__price">${sumCatalog.toLocaleString()} USD</td>
						<td class="shopping-element__price">${sumCatalog1.toLocaleString()} USD</td>
					</tr>
				</table>
			<div>`;

		ROOT_SHOPPING.innerHTML = html;
	}
}

const shoppingPage = new Shopping();


class Spinner {
	handleClear(){
		ROOT_SPINNER.innerHTML = '';
	}

	render() {
		const html = `<div class="spinner-container"><img src="img/spinner.svg" class="spinner__img"></div>`;

		ROOT_SPINNER.innerHTML = html;
	}
}

const spinnerPage = new Spinner();

/**********************************/
class ErrorInfo{
	render() {
		const html = `
		<div class="error-container">
			<div class="error-message">
			     <h3>No access</h3>
			</div>
		</div>`;

		ROOT_ERROR.innerHTML = html;
	}
}

const errorPage = new ErrorInfo();