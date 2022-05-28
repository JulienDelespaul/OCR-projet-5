/** Get all products data from the api
/* @return {Object} All products data
*/
const getAllProducts = () => {
	fetch("http://localhost:3000/api/products")
		.then(function (res) {
			if (res.ok) {
				return res.json();
			}
		})
		.catch(function (err) {
			// Une erreur est survenue
		});
};

const makeProductCard = (getAllProducts) => {
	Object.entries(products).map((product) => {
		console.log(product);
	});
};

makeProductCard();
