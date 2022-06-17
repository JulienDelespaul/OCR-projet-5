// Get order Id from local storage
function getLocalOrderId() {
	let orderId = localStorage.getItem("orderId");
	return JSON.parse(orderId);
}

// Display the order Id in the confirmation page
function getAndDisplayOrderId() {
	let orderId = getLocalOrderId();
	document.querySelector("#orderId").textContent = orderId;
}
getAndDisplayOrderId();
