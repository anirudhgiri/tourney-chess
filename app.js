//expressJS and related middleware
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

//load environment variables from the .env file
require("dotenv").config();

//importing routes
const homeRouter = require("./routes/home");
const tournamentsRouter = require("./routes/tournaments");

//logging middleware
const logger = require("morgan");
app.use(logger("common"));

//template engine configuration
const hbs = require("express-handlebars");
app.engine( "hbs", hbs.engine( {
	extname: "hbs",
	defaultLayout: "main",
	layoutsDir: __dirname + "/views/layouts/",
	partialsDir: __dirname + "/views/partials/"
}));
app.set("view engine", "hbs");

//routing
app.use("/", homeRouter);
app.use("/tournaments", tournamentsRouter);

//catch error 404
app.use((req,res) => {
	res.status(404);
	res.render("error", {
		status: 404,
		message: "Error 404, Page Not Found",
		error: {},
		layout: false
	});
});

//catch all other errors
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render("error", {
		status: err.errorStatus,
		message: err.errorMessage,
		error: process.env.NODE_ENV == "development"? err : {},
		layout: false
	});
	next();
});

app.listen(process.env.PORT, ()=>{
	console.log(`Listening on port ${process.env.PORT}...`);
});
