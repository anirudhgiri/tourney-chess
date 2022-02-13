const crypto = require("crypto");

const express = require("express");
const signupRouter = express.Router();

const User = require("../../models/userModel");

signupRouter.post("/", async (req, res)=> {
	const userlookup = await User.findOne({$or:[{username: req.body.username},{email: req.body.email}]});

	if(userlookup)
		res.status(401).json({success:false, message: "username taken!"});
	else{
		const passwordSalt = crypto.randomBytes(32).toString("hex");
		const passwordHash = crypto.pbkdf2Sync(req.body.password,passwordSalt,100000,64,"sha512").toString("hex");
		const joinDate = Date.now();
		let newUser = new User({username: req.body.username, email: req.body.email, passwordHash, passwordSalt, joinDate});
		newUser.save();
		res.status(200).json({success:true, message:"successfully signed up!"});
	}
});

signupRouter.get("/", (req,res) => {
	res.render("signup", {layout: "plain", title: "Tourney Chess - SignUp", loginPage: true});
});


module.exports = signupRouter;
