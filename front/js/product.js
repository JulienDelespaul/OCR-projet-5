const APIBaseUrl = "http://localhost:3000/api/products";

fetchDataAndCreateProductCard();

// Grab product id from the url
function getProductIdFromUrl() {
	const url = window.location.search;
	const ID = new URLSearchParams(url).get("id");
	return ID;
}

// Fetch the products data and create all product cards
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
