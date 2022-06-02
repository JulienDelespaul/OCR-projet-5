const APIBaseUrl = "http://localhost:3000/api/products";

fetchDataAndCreateAllProductsCards();

// Fetch the products data and create all product cards
async function fetchDataAndCreateAllProductsCards() {
	const products = await getAllProducts();
	for (product of products) {
		createProductCard(product);
	}
}

// Grab all products data from the API
function getAllProducts() {
	return fetch(APIBaseUrl)
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

// Create a product card in html and inject the product data inside
function createProductCard(product) {
	const items = document.querySelector(".items");

	// Create product page url
	let a = document.createElement("a");
	a.href = `./product.html?id=${product._id}`;
	items.appendChild(a);

	// Create product article
	let article = document.createElement("article");
	a.appendChild(article);

	// Inject product image
	let img = document.createElement("img");
	img.setAttribute("src", product.imageUrl);
	img.setAttribute("alt", product.altTxt);
	article.appendChild(img);

	// Inject product name
	let h3 = document.createElement("h3");
	h3.classList.add("productName");
	h3.textContent = product.name;
	article.appendChild(h3);

	// Inject product description
	let p = document.createElement("p");
	p.classList.add("productDescription");
	p.textContent = product.description;
	article.appendChild(p);
	return a;
}
