//expressJS and related middleware
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());

//load environment variables from the .env file
require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");

const key = fs.readFileSync(path.join(__dirname,process.env.SSL_KEY_FILENAME));
const cert = fs.readFileSync(path.join(__dirname,process.env.SSL_CERT_FILENAME));
const options = {key,cert};

//protecting the api from spam requests
const slowDown = require("express-slow-down");
const redisStore = require("rate-limit-redis");
const speedLimiter = slowDown({
	store: new redisStore({
		expiry: 5*60,
		prefix: "sl:",
		redisURL: process.env.REDIS_CONNECTION_URI
	}),
	windowMs: 5 * 60 * 1000,
	delayAfter: 150,
	delayMs: 500,
	maxDelayMs: 10000,
	headers: true
});
app.use(speedLimiter);

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
	store: new redisStore({
		expiry: 5*60,
		prefix: "rl:",
		redisURL: process.env.REDIS_CONNECTION_URI
	}),
	windowMs: 5 * 60 * 1000,
	max: 500,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

//session handling
const session = require("express-session");
const redisClient = require("./models/redis");

let RedisStore = require("connect-redis")(session);
app.use(session({
	secret: process.env.SECRET_KEY,
	cookie: {
		maxAge: 30*60*1000,
		secure: false,
	},
	store: new RedisStore({client: redisClient}),
	saveUninitialized: false,
	resave: false
}));

//importing routes
const homeRouter = require("./routes/dashboard/home");
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
		const mongoose = require("./models/mongoose");
		mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
		mongoose.connection.once("open", () => {
			console.log("MongoDB connection has been established successfully.");
			app.emit("ready");
		});
	})
	.catch(err => {
		console.error("Unable to connect to the database:", err);
	});

const server = https.createServer(options, app);
//listen on port when ready
app.on("ready", () => {
	server.listen(process.env.PORT, ()=>{
		console.log(`Listening on port ${process.env.PORT}...`);
	});
});
