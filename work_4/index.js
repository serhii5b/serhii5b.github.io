function render() {
	const productsStore = localStorageUtil.getProducts();

	headerPage.render(productsStore.length);
	productsPage.render();

}

spinnerPage.render();

let CATALOG = [];

fetch('db/catalog.json')
	.then(res => res.json())
	.then(body => {
		CATALOG = body;
		spinnerPage.handleClear();
		render();
	})
	.catch(error => {
		spinnerPage.handleClear();
		errorPage.render();
	});