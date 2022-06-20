// Get order Id from local storage
function getOrderIdFromUrl() {
	const url = window.location.search;
	const ID = new URLSearchParams(url).get("id");
	return ID;
}

// Display the order Id in the confirmation page
function getAndDisplayOrderId() {
	let orderId = getOrderIdFromUrl();
	document.querySelector("#orderId").textContent = orderId;
}
getAndDisplayOrderId();
