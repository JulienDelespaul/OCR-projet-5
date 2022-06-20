// ---------------------------------
// Inject product data into the html
// ---------------------------------

const APIBaseUrl = "http://localhost:3000/api/products";

fetchDataAndCreateProductCard();

// Grab product id from the url
function getProductIdFromUrl() {
	const url = window.location.search;
	const ID = new URLSearchParams(url).get("id");
	return ID;
}

// Fetch the product data and create the product card
async function fetchDataAndCreateProductCard() {
	const product = await getProduct();
	injectProductData(product);
}

// Grab product data from the API
function getProduct() {
	const productID = getProductIdFromUrl();
	return fetch(APIBaseUrl + "/" + productID)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				console.log("Error: " + res.status);
			}
		})
		.then((products) => {
			return products;
		})
		.catch((error) => {
			console.log(error);
		});
}

// Inject product data into the html
function injectProductData(product) {
	// Inject product image
	const itemImg = document.querySelector(".item__img");
	let img = document.createElement("img");
	img.setAttribute("src", product.imageUrl);
	img.setAttribute("alt", product.altTxt);
	itemImg.appendChild(img);

	// Inject product name
	const itemName = document.querySelector("#title");
	itemName.textContent = product.name;

	// Inject product price
	const itemPrice = document.querySelector("#price");
	itemPrice.textContent = product.price;

	// Inject product description
	const itemDescription = document.querySelector("#description");
	itemDescription.textContent = product.description;

	// Inject product colors
	const itemColors = document.querySelector("#colors");
	for (color of product.colors) {
		let option = document.createElement("option");
		option.value = color;
		option.textContent = color;
		itemColors.appendChild(option);
	}
}

// -----------------------------------------
// Generate the cart object in local storage
// -----------------------------------------
const addToCartBTN = document.querySelector("#addToCart");

// Listen the addToCart button and retrieve current order data
function addToCart() {
	addToCartBTN.addEventListener("click", () => {
		compareOrderDataWithCart();
	});
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

// Compare the current order data with the cart object in local storage
// And update accordingly

// Cut all the above into separates functions
function compareOrderDataWithCart(orderData) {
	let cartContent = getCartDataFromLocalStorage();
	orderData = getProductOrderData();
	if (orderData === undefined) {
		return;
	}
	// Test if the product is already in the cart
	let isProductInCart = cartContent.find((el) => el.id == orderData.id && el.color == orderData.color);
	if (isProductInCart) {
		// If the product is already in the cart, update the quantity
		isProductInCart.quantity = parseInt(isProductInCart.quantity) + parseInt(orderData.quantity);
	} else {
		cartContent.unshift(orderData);
	}
	saveCartContentIntoLocalStorage(cartContent);
}

// Push Order data into the cartContent array
function pushOrderDataToCartContent() {
	cartContent.push(orderData);
}
const productQuantityBackground = document.querySelector(".item__content__settings__quantity");
const productColorBackground = document.querySelector(".item__content__settings__color");

// Get current product order data
function getProductOrderData() {
	const productOrderData = {
		id: getProductIdFromUrl(),
		color: document.querySelector("#colors").value,
		quantity: document.querySelector("#quantity").value,
	};

	// Check if a color has been specified and adjust error message accordingly
	const pColor = document.querySelector(".item__content__settings__color p");

	if (productOrderData.color == "") {
		if (!pColor) {
			let p = document.createElement("p");
			p.textContent = "Choisissez une couleur";
			p.style.backgroundColor = "red";
			productColorBackground.appendChild(p);
		}
	} else {
		if (pColor) {
			productColorBackground.removeChild(pColor);
		}
	}

	// Check if a quantity has been specified and adjust error message accordingly
	const pQuantity = document.querySelector(".item__content__settings__quantity p");
	if (productOrderData.quantity == "0") {
		if (!pQuantity) {
			let p = document.createElement("p");
			p.textContent = "Choisissez une quantité";
			p.style.color = "white";
			p.style.fontSize = "1rem";
			p.style.backgroundColor = "red";
			productQuantityBackground.appendChild(p);
		}
	} else {
		if (pQuantity) {
			productQuantityBackground.removeChild(pQuantity);
		}
	}

	// Check if color and quantity are not empty, send the order data to the cart
	if (productOrderData.color != "" && productOrderData.quantity != "0") {
		addToCartBTN.textContent = "Ajouté au panier";
		addToCartBTN.animate({ backgroundColor: ["white", "green"] }, { duration: 500 });
		addToCartBTN.style.backgroundColor = "green";
		return productOrderData;
	}
}

// Save cartContent into local storage
function saveCartContentIntoLocalStorage(cartContent) {
	localStorage.setItem("cart", JSON.stringify(cartContent));
}

addToCart();
