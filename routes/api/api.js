const express = require("express");
const apiRouter = express.Router();

const signupRouter = require("./signup");
const loginRouter = require("./login");
const tournamentRouter = require("./tournaments");
const logoutRouter = require("./logout");

apiRouter.use("/signup", signupRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/tournaments", tournamentRouter);
apiRouter.use("/logout", logoutRouter);

module.exports = apiRouter;
