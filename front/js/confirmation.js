getAndDisplayOrderId();

// Display the order Id in the confirmation page
function getAndDisplayOrderId() {
	let orderId = getOrderIdFromUrl();
	document.querySelector("#orderId").textContent = orderId;
}

// Get order Id from url
function getOrderIdFromUrl() {
	const url = window.location.search;
	const ID = new URLSearchParams(url).get("id");
	return ID;
}
