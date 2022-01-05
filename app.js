//expressJS and related middleware
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());

//import middleware for working with cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//load environment variables from the .env file
require("dotenv").config();

//importing routes
const homeRouter = require("./routes/home");
const tournamentsRouter = require("./routes/tournaments");
const apiRouter = require("./routes/api/api");

//logging middleware
const logger = require("morgan");
app.use(logger(process.env.NODE_ENV == "development" ? "dev" : "combined"));

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
app.use("/api", apiRouter);

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
app.use(function(err, req, res, _next) {
	res.status(err.status || 500);
	res.render("error", {
		status: err.errorStatus,
		message: err.errorMessage,
		error: process.env.NODE_ENV == "development"? err : {},
		layout: false
	});
});

const pg = require("./models/postgres");
pg.sequelize
	.authenticate()
	.then(() => {
		console.log("Postgres connection has been established successfully.");
		app.emit("ready");
	})
	.catch(err => {
		console.error("Unable to connect to the database:", err);
	});

//listen on http port when ready
app.on("ready", () => {
	app.listen(process.env.PORT, ()=>{
		console.log(`Listening on port ${process.env.PORT}...`);
	});
});
