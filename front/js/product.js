// ---------------------------------
// Inject product data into the html
// ---------------------------------

const APIBaseUrl = "http://localhost:3000/api/products";
const productID = new URLSearchParams(window.location.search).get("id");

// Fetch the product data and create the product card
async function fetchDataAndCreateProductCard() {
	let product = await getProduct();
	injectProductData(product);
}

// Grab product data from the API
function getProduct() {
	return fetch(APIBaseUrl + "/" + productID)
		.then((res) => {
			if (res.ok) {
				return res.json();
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

fetchDataAndCreateProductCard();

// -----------------------------------------
// Generate the cart object in local storage
// -----------------------------------------

const addToCartBTN = document.querySelector("#addToCart");

// Listen the addToCart button and initiate order data validation process
function addToCart() {
	addToCartBTN.addEventListener("click", () => {
		compareOrderDataWithCart();
	});
}

// Compare the current order data with the cart object in local storage
// And update accordingly
function compareOrderDataWithCart() {
	let cartContent = getCartDataFromLocalStorage();
	orderData = getProductOrderData();
	if (orderData === undefined) {
		return;
	}
	// Test if the product with the same color is already in the cart
	let isProductInCart = cartContent.find((el) => el.id == orderData.id && el.color == orderData.color);
	if (isProductInCart) {
		// If the product with the same color is already in the cart, update the quantity
		isProductInCart.quantity = parseInt(isProductInCart.quantity) + parseInt(orderData.quantity);
	} else {
		// If the product with the same color is not in the cart, unshift the order data into the cart
		cartContent.unshift(orderData);
	}
	// Save the cart content into local storage (overwrite previous cart content)
	saveCartContentIntoLocalStorage(cartContent);
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

// Check if current order is valid, return current product order data if valid
function getProductOrderData() {
	const productQuantityLine = document.querySelector(".item__content__settings__quantity");
	const productColorLine = document.querySelector(".item__content__settings__color");

	const productOrderData = {
		id: productID,
		color: document.querySelector("#colors").value,
		quantity: document.querySelector("#quantity").value,
	};

	// Check if a color has been specified, display an error message if not
	const pColor = document.querySelector(".item__content__settings__color p");

	if (productOrderData.color == "") {
		if (!pColor) {
			let p = document.createElement("p");
			p.textContent = "Choisissez une couleur";
			p.style.backgroundColor = "red";
			productColorLine.appendChild(p);
		}
	} else {
		if (pColor) {
			productColorLine.removeChild(pColor);
		}
	}

	// Check if a quantity has been specified, display an error message if not
	const pQuantity = document.querySelector(".item__content__settings__quantity p");
	if (productOrderData.quantity == "0") {
		if (!pQuantity) {
			let p = document.createElement("p");
			p.textContent = "Choisissez une quantité";
			p.style.backgroundColor = "red";
			productQuantityLine.appendChild(p);
		}
	} else {
		if (pQuantity) {
			productQuantityLine.removeChild(pQuantity);
		}
	}

	// Check if the color and the quantity are not empty, return the product order data if valid
	// Change the color and the text of the order button to visually indicate that the order is valid
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
