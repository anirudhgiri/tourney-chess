const express = require("express");
const apiRouter = express.Router();

const signupRouter = require("./signup");
const loginRouter = require("./login");

apiRouter.use("/signup", signupRouter);
apiRouter.use("/login", loginRouter);

module.exports = apiRouter;
