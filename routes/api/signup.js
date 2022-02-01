const crypto = require("crypto");

const express = require("express");
const signupRouter = express.Router();

const User = require("../../models/userModel");
const {Op} = require("sequelize");


signupRouter.post("/", async (req, res)=> {
	const userlookup = await User.findOne({where: {[Op.or]:[{username: req.body.username}, {email: req.body.email}]}});

	if(userlookup)
		res.status(401).json({success:false, message: "username taken!"});
	else{
		const pwdSalt = crypto.randomBytes(32).toString("hex");
		const pwdHash = crypto.pbkdf2Sync(req.body.password,pwdSalt,100000,64,"sha512").toString("hex");
		User.create({username: req.body.username, email: req.body.email, passwordHash: pwdHash, passwordSalt: pwdSalt});
		res.status(200).json({success:true, message:"successfully signed up!"});
	}
});

signupRouter.get("/", (req,res) => {
	res.render("signup", {layout: "plain", title: "Tourney Chess - SignUp", loginPage: true});
});


module.exports = signupRouter;
