//expressJS and related middleware
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());

//load environment variables from the .env file
require("dotenv").config();

//protecting the api from spam requests
const rateLimit = require("express-rate-limit");
const mongoStore_rl = require("rate-limit-mongo");
const limiter = rateLimit({
	store: new mongoStore_rl({
		uri: process.env.MONGODB_CONNECTION_URI,
		expireTimeMs: 5 * 60 * 1000
	}),
	windowMs: 5 * 60 * 1000,
	max: 500,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

//session handling
const session = require("express-session");
const mongoStore_session = require("connect-mongo");
app.use(session({
	secret: process.env.SECRET_KEY,
	cookie: {
		maxAge: 30*60*1000,
		secure: true,
	},
	store: mongoStore_session.create({mongoUrl: process.env.MONGODB_CONNECTION_URI}),
	saveUninitialized: false,
	resave: false
}));

//importing routes
const tournamentsRouter = require("./routes/dashboard/tournaments");
const apiRouter = require("./routes/api/api");
const dashboardRouter = require("./routes/dashboard/dashboard");

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
app.use("/dashboard", dashboardRouter);
app.use("/tournaments", tournamentsRouter);
app.use("/api", apiRouter);
app.get("/", (req,res) => {res.redirect("/dashboard/home");});

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

const mongoose = require("./models/mongoose");
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.connection.once("open", () => {
	console.log("MongoDB connection has been established successfully.");
	app.emit("ready");
});

const https = require("https");
const fs = require("fs");
const path = require("path");

const key = fs.readFileSync(path.join(__dirname,process.env.SSL_KEY_FILENAME));
const cert = fs.readFileSync(path.join(__dirname,process.env.SSL_CERT_FILENAME));
const options = {key,cert};

const server = https.createServer(options, app);
//listen on port when ready
app.on("ready", () => {
	server.listen(process.env.PORT, ()=>{
		console.log(`Listening on port ${process.env.PORT}...`);
	});
});
