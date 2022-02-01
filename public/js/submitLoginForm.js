console.log(document.getElementById("loginSubmitButton"));
document.getElementById("loginSubmitButton").addEventListener("click", async event => {
	event.preventDefault();
	const username = document.getElementById("tc_username").value;
	const password = document.getElementById("password").value;
	const credentials = {username, password};
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(credentials)
	};
	let response = await fetch("/api/login", options);
	console.log(response);
});
