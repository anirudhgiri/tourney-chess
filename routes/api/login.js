const crypto = require("crypto");

const express = require("express");
const loginRouter = express.Router();

const User = require("../../models/userModel");

loginRouter.post("/", async (req, res)=> {
	const userlookup = await User.findOne({where: {username: req.body.username}});

	if(!userlookup)
		res.status(401).json({success:false, message: "Invalid username!"});
	else{
		const calcHash = crypto.pbkdf2Sync(req.body.password, userlookup.dataValues.passwordSalt, 100000, 64, "sha512").toString("hex");
		if(calcHash == userlookup.dataValues.passwordHash)
			res.status(200).json({success:true, message: "Successfully logged in!"});
		else
			res.status(401).json({success:false, message: "Invalid credentials!"});

	}
});

module.exports = loginRouter;