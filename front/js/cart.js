const APIBaseUrl = "http://localhost:3000/api/products";
const cartItems = document.querySelector("#cart__items");
const totalQuantity = document.querySelector("#totalQuantity");
const totalPrice = document.querySelector("#totalPrice");
let totalQuantityValue = 0;

fetchDataAndCreateAllProductsCards();
updateTotals();

// Fetch the products data and create all product cards
async function fetchDataAndCreateAllProductsCards() {
	const cartContent = getCartDataFromLocalStorage();
	for (article of cartContent) {
		const productDataFromApi = await getProductFromApi(article);
		createCartProductCard(article, productDataFromApi);
	}
	listenDeleteButton();
	listenChangeQuantityButton();
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
async function getProductFromApi(product) {
	try {
		const productID = product.id;
		const res = await fetch(APIBaseUrl + "/" + productID);
		const json = res.json();
		return json;
	} catch (error) {
		console.log(error);
	}
}

// Create a product card in html and inject the product data inside
function createCartProductCard(product, productDataFromApi) {
	// Create product article
	let article = document.createElement("article");
	article.classList.add("cart__item");
	article.setAttribute("data-id", product.id);
	article.setAttribute("data-color", product.color);
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
	p.textContent = product.color;
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
	itemContentSettingsQuantityContainer.textContent = "Qté : " + product.quantity;
	itemContentSettingsContainer.appendChild(itemContentSettingsQuantityContainer);

	// Create item content settings quantity button
	let itemContentSettingsQuantityButton = document.createElement("input");
	itemContentSettingsQuantityButton.setAttribute("type", "number");
	itemContentSettingsQuantityButton.classList.add("itemQuantity");
	itemContentSettingsQuantityButton.setAttribute("name", "itemQuantity");
	itemContentSettingsQuantityButton.setAttribute("min", "1");
	itemContentSettingsQuantityButton.setAttribute("max", "100");
	itemContentSettingsQuantityButton.setAttribute("value", product.quantity);
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

	return article;
}

// Listen every change quantity button and update quantity text above the appropriate button accordingly
function listenChangeQuantityButton() {
	let changeQuantityButtons = document.querySelectorAll(".itemQuantity");
	changeQuantityButtons.forEach((button) => {
		button.addEventListener("change", (e) => {
			let itemId = e.target.closest("article").getAttribute("data-id");
			let itemColor = e.target.closest("article").getAttribute("data-color");
			let itemQuantity = e.target.value;
			let htmlQuantity = e.target.previousSibling;
			htmlQuantity.textContent = "Qté : " + itemQuantity;
			htmlQuantity.animate({ color: "#3498db" }, { duration: 250 });
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
	updateTotals();
}

// Listen delete button
function listenDeleteButton() {
	let deleteButtons = document.querySelectorAll(".deleteItem");
	deleteButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			let itemId = e.target.closest(".cart__item").getAttribute("data-id");
			let itemColor = e.target.closest(".cart__item").getAttribute("data-color");
			deleteItemFromCart(itemId, itemColor);
		});
	});
}

// Delete item from cart
function deleteItemFromCart(itemId, itemColor) {
	let cartContent = getCartDataFromLocalStorage();
	let itemToUpdate = cartContent.find((item) => {
		return item.id === itemId && item.color === itemColor;
	});
	cartContent.splice(cartContent.indexOf(itemToUpdate), 1);
	localStorage.setItem("cart", JSON.stringify(cartContent));
	let HTMLarticleToRemove = document.querySelector(`[data-id="${itemId}"][data-color= "${itemColor}"]`);
	HTMLarticleToRemove.remove();
	updateTotals();
}

// Update displayed total price and total quantity, with specific html injection for 0 and 1 item cases

async function updateTotals() {
	totalQuantityValue = 0;
	let totalPriceValue = 0;
	let cartContent = getCartDataFromLocalStorage();
	for (product of cartContent) {
		totalQuantityValue += parseInt(product.quantity);
		let productPrice = 0;
		await getProductFromApi(product).then((product) => {
			productPrice = product.price;
		});
		totalPriceValue += parseInt(product.quantity) * parseInt(productPrice);
	}
	// Display empty cart message if product quantity = 0
	if (totalQuantityValue === 0) {
		let p = document.createElement("p");
		p.textContent = "est vide";
		p.style.fontSize = "3rem";
		p.style.fontWeight = 700;
		p.style.textAlign = "center";
		cartItems.appendChild(p);
		totalsRefresh();
	}

	// Change "articles" to singular if quantity = 1
	if (totalQuantityValue === 1) {
		const articleSingulier = document.querySelector(".cart__price p");
		articleSingulier.innerHTML = 'Total (<span id="totalQuantity">	</span> article) : <span id="totalPrice"></span> €';
		articleSingulier.animate({ color: "#3498db" }, { duration: 250 });
		totalsRefresh();
	}
	// Change "article" to plural if quantity > 1
	if (totalQuantityValue > 1) {
		const articleSingulier = document.querySelector(".cart__price p");
		articleSingulier.innerHTML = 'Total (<span id="totalQuantity">	</span> articles) : <span id="totalPrice"></span> €';
		articleSingulier.animate({ color: "#3498db" }, { duration: 250 });
		totalsRefresh();
	}
	// Refresh total quantity and total price value and displayed value
	function totalsRefresh() {
		const totalQuantity = document.querySelector("#totalQuantity");
		const totalPrice = document.querySelector("#totalPrice");
		totalQuantity.textContent = totalQuantityValue;
		totalPrice.textContent = totalPriceValue.toLocaleString("fr-FR");
	}
}

// ------------
// Form section
// ------------
// Validation of form contact informations and order data
// Generate complete order data and switch to confirmation page

const form = document.querySelector(".cart__order__form");
const orderButton = document.querySelector("#order");
const formValidationValues = [
	{
		name: "firstName",
		regEx: /^[a-zÀ-ÖØ-öø-ÿ\s,.'-]+$/i,
		errorMessageName: "firstNameErrorMsg",
		errorMessageText: "Prénom non valide",
	},
	{
		name: "lastName",
		regEx: /^[a-zÀ-ÖØ-öø-ÿ\s,.'-]+$/i,
		errorMessageName: "lastNameErrorMsg",
		errorMessageText: "Nom non valide",
	},
	{
		name: "address",
		regEx: /^[a-z0-9À-ÖØ-öø-ÿ\s,.'-]+$/i,
		errorMessageName: "addressErrorMsg",
		errorMessageText: "Adresse non valide",
	},
	{
		name: "city",
		regEx: /^[a-z0-9À-ÖØ-öø-ÿ\s,.'-]+$/i,
		errorMessageName: "cityErrorMsg",
		errorMessageText: "Ville non valide",
	},
	{
		name: "email",
		regEx: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
		errorMessageName: "emailErrorMsg",
		errorMessageText: "Email non valide",
	},
];

orderButtonClick();
validateForm();

// Loop through form values and call input validation function
function validateForm() {
	formValidationValues.forEach((value) => {
		validateFormInput(value);
	});
}

// Check if input is valid and display error message if not
function validateFormInput(input) {
	let inputValue = document.querySelector("#" + input.name);
	let errorMessage = document.querySelector("#" + input.errorMessageName);

	inputValue.addEventListener("change", (event) => {
		event.preventDefault();
		nameResult = input.regEx.test(inputValue.value);
		if (!nameResult) {
			inputValue.classList.add("invalid");
			errorMessage.style.color = "red";
			errorMessage.style.height = "26px";
			errorMessage.style.marginTop = "12px";

			errorMessage.textContent = input.errorMessageText;
			inputValue.style.outline = "4px solid red";
		} else {
			errorMessage.textContent = "";
			errorMessage.style.height = "0";
			errorMessage.style.marginTop = "0";

			inputValue.classList.remove("invalid");
			inputValue.style.outline = "4px solid green";
		}
	});
}

// Order button click event

// Listen order button, call form validation function to check form validity, call order data generation function, send order data to the api, use response to send user to order confirmation page
function orderButtonClick() {
	orderButton.addEventListener("click", (event) => {
		validateForm();
		event.preventDefault();
		isValidForm = form.checkValidity();
		if (isValidForm && totalQuantityValue > 0) {
			const clientOrder = makeOrder();

			order = fetch(APIBaseUrl + "/order", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(clientOrder),
			})
				.then((response) => response.json())
				.then((data) => {
					return (window.location.href = `./confirmation.html?id=${data.orderId}`);
				});
		} else {
			orderButton.style.backgroundColor = "red";
			if (!isValidForm) {
				orderButton.value = "Formulaire non valide";
			} else if (totalQuantityValue == 0) {
				orderButton.value = "Votre panier est vide";
			}
			setTimeout(() => {
				orderButton.style.backgroundColor = "#2c3e50";
				orderButton.value = "Commander";
			}, 3000);
		}
	});
}

// Generate order data to be sent to the api
function makeOrder() {
	const cartContent = getCartDataFromLocalStorage();
	const order = {
		contact: {
			firstName: firstName.value,
			lastName: lastName.value,
			address: address.value,
			city: city.value,
			email: email.value,
		},
		products: cartContent.map((productID) => {
			return product.id;
		}),
	};
	return order;
}
