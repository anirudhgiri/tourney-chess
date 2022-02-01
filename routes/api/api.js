const express = require("express");
const apiRouter = express.Router();

const signupRouter = require("./signup");
const loginRouter = require("./login");
const tournamentRouter = require("./tournaments");

apiRouter.use("/signup", signupRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/tournaments", tournamentRouter);

module.exports = apiRouter;
