const express = require("express");
const apiRouter = express.Router();

const signupRouter = require("./signup");
const loginRouter = require("./login");
const tournamentsRouter = require("../../src/routes/tournaments");

apiRouter.use("/signup", signupRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/tournaments", tournamentsRouter)

module.exports = apiRouter;
