const APIBaseUrl = "http://localhost:3000/api/products";

// Fetch the products data and create all product cards
async function fetchDataAndCreateAllProductsCards() {
	const cartContent = await getCartDataFromLocalStorage();
	for (product of cartContent) {
		createCartProductCard(product);
	}
}

// Create a product card in html and inject the product data inside
async function createCartProductCard(product) {
	const productDataFromApi = await getProductFromApi(product);
	const item = product;
	const cartItems = document.querySelector("#cart__items");

	// Create product article
	let article = document.createElement("article");
	article.classList.add("cart__item");
	article.setAttribute("data-id", item.id);
	article.setAttribute("data-color", item.color);
	cartItems.appendChild(article);

	// Create product image container
	let imgContainer = document.createElement("div");
	imgContainer.classList.add("cart__item__img");
	article.appendChild(imgContainer);

	// Inject product image
	let img = document.createElement("img");
	img.setAttribute("src", productDataFromApi.imageUrl);
	img.setAttribute("alt", productDataFromApi.altTxt);
	imgContainer.appendChild(img);

	// Create item content container
	let itemContentContainer = document.createElement("div");
	itemContentContainer.classList.add("cart__item__content");
	article.appendChild(itemContentContainer);

	// Create item content description container
	let itemContentDescriptionContainer = document.createElement("div");
	itemContentDescriptionContainer.classList.add("cart__item__content__description");
	itemContentContainer.appendChild(itemContentDescriptionContainer);

	// Inject product name
	let h2 = document.createElement("h2");
	h2.textContent = productDataFromApi.name;
	itemContentDescriptionContainer.appendChild(h2);

	// Inject product color
	let p = document.createElement("p");
	p.textContent = item.color;
	itemContentDescriptionContainer.appendChild(p);

	// Inject product price
	let p2 = document.createElement("p");
	p2.textContent = productDataFromApi.price + " €";
	itemContentDescriptionContainer.appendChild(p2);

	// Create item content settings container
	let itemContentSettingsContainer = document.createElement("div");
	itemContentSettingsContainer.classList.add("cart__item__content__settings");
	itemContentContainer.appendChild(itemContentSettingsContainer);

	// Create item content settings quantity
	let itemContentSettingsQuantityContainer = document.createElement("p");
	itemContentSettingsQuantityContainer.textContent = "Qté : " + item.quantity;
	itemContentSettingsContainer.appendChild(itemContentSettingsQuantityContainer);

	// Create item content settings quantity button
	let itemContentSettingsQuantityButton = document.createElement("input");
	itemContentSettingsQuantityButton.setAttribute("type", "number");
	itemContentSettingsQuantityButton.classList.add("itemQuantity");
	itemContentSettingsQuantityButton.setAttribute("name", "itemQuantity");
	itemContentSettingsQuantityButton.setAttribute("min", "1");
	itemContentSettingsQuantityButton.setAttribute("max", "100");
	itemContentSettingsQuantityButton.setAttribute("value", item.quantity);
	itemContentSettingsContainer.appendChild(itemContentSettingsQuantityButton);

	// Create item content settings delete button container
	let itemContentSettingsDeleteButtonContainer = document.createElement("div");
	itemContentSettingsDeleteButtonContainer.classList.add("cart__item__content__settings__delete");
	itemContentSettingsContainer.appendChild(itemContentSettingsDeleteButtonContainer);

	// Create item content settings delete button
	let itemContentSettingsDeleteButton = document.createElement("p");
	itemContentSettingsDeleteButton.classList.add("deleteItem");
	itemContentSettingsDeleteButton.textContent = "Supprimer";
	itemContentSettingsDeleteButtonContainer.appendChild(itemContentSettingsDeleteButton);

	listenChangeQuantityButton();
	listenDeleteButton();

	return article;
}

// Get cart data from local storage
function getCartDataFromLocalStorage() {
	let cartContent = localStorage.getItem("cart");
	if (cartContent) {
		return JSON.parse(cartContent);
	} else {
		return [];
	}
}

// Get cart product data from the api
function getProductFromApi(product) {
	const productID = product.id;
	return fetch(APIBaseUrl + "/" + productID)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				console.log("Error: " + res.status);
			}
		})
		.then((product) => {
			return product;
		})
		.catch((error) => {
			console.log(error);
		});
}

// Listen change quantity button
function listenChangeQuantityButton() {
	let changeQuantityButtons = document.querySelectorAll(".itemQuantity");
	changeQuantityButtons.forEach((button) => {
		button.addEventListener("change", (e) => {
			let itemId = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
			let itemColor = e.target.parentElement.parentElement.parentElement.getAttribute("data-color");
			let itemQuantity = e.target.value;
			updateCartDataInLocalStorage(itemId, itemColor, itemQuantity);
		});
	});
}

// Update cart data in local storage when quantity is changed
function updateCartDataInLocalStorage(itemId, itemColor, itemQuantity) {
	let cartContent = getCartDataFromLocalStorage();
	let itemToUpdate = cartContent.find((item) => {
		return item.id === itemId && item.color === itemColor;
	});
	itemToUpdate.quantity = itemQuantity;
	localStorage.setItem("cart", JSON.stringify(cartContent));
}

// Listen delete button
function listenDeleteButton() {
	let deleteButtons = document.querySelectorAll(".deleteItem");
	deleteButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			e.stopPropagation();
			let itemId = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id");
			let itemColor = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-color");
			console.log(itemId, itemColor);
			deleteItemFromCart(itemId, itemColor);
		});
	});
}

// Delete item from cart
function deleteItemFromCart(itemId, itemColor) {
	console.log("yup");
	let cartContent = getCartDataFromLocalStorage();
	let itemToUpdate = cartContent.find((item) => {
		return item.id === itemId && item.color === itemColor;
	});
	console.log("itemToUpdate", cartContent.indexOf(itemToUpdate));
	cartContent.splice(cartContent.indexOf(itemToUpdate), 1);
	localStorage.setItem("cart", JSON.stringify(cartContent));
	// location.reload(true);
	return;
}

fetchDataAndCreateAllProductsCards();
