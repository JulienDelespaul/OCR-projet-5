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

// Get current product order data
function getProductOrderData() {
	const productOrderData = { id: getProductIdFromUrl(), color: document.querySelector("#colors").value, quantity: document.querySelector("#quantity").value };
	console.log("productOrderData", productOrderData);
	return productOrderData;
}

// Listen the addToCart button and retrieve current order data
function addToCart() {
	const addToCartBTN = document.querySelector("#addToCart");
	addToCartBTN.addEventListener("click", () => {
		compareOrderDataWithCart();
	});
}

// Compare the current order data with the cart object in local storage
// And update accordingly
function compareOrderDataWithCart() {
	let orderData = getProductOrderData();
	console.log("orderData: ", orderData);
	let cartContent = [JSON.parse(localStorage.getItem("cart"))];
	console.log("cartContent: ", cartContent);
	cartContent.flat();
	console.log("cartContent: ", cartContent);
	if (Array.isArray(cartContent) && cartContent.length > 0) {
		// if (cartContent[0].id[0] === orderData[0].id[0]) {
		// 	// To do : make it loop
		// 	console.log("yeah");
		// 	// 	// check if product is already present in cart
		// 	// 	// if true, then check if color is the same
		// 	// 	// if color is the same, update quantity

		// 	// 	// if color is different, add product to cart array
		// 	// 	// if product is not present in cart, add product to cart array
		// 	console.log("produit présent dans cartContent", cartContent);
		// } else {
		// 	console.log("nope");
		// 	console.log("test", JSON.stringify(cartContent));
		// 	console.log(cartContent);
		// 	localStorage.setItem("cart", JSON.stringify(cartContent));
		// }
		cartContent.unshift(orderData);
		localStorage.setItem("cart", JSON.stringify(cartContent));
	} else {
		console.log(JSON.stringify(orderData));
		localStorage.setItem("cart", JSON.stringify(orderData));
	}
}

addToCart();
