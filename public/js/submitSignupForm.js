console.log(document.getElementById("signupSubmitButton"));
document.getElementById("signupSubmitButton").addEventListener("click", async event => {
	event.preventDefault();
	const username = document.getElementById("tc_username").value;
	const email = document.getElementById("tc_email").value;
	const password = document.getElementById("password").value;
	const credentials = {username, email, password};
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(credentials)
	};
	let response = await fetch("/api/signup", options);
	console.log(response);
});
