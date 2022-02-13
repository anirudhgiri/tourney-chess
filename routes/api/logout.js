const express = require("express");
const logoutRouter = express.Router();

logoutRouter.get("/",(req,res) => {
	if(req.session.username){
		req.session.destroy();
		res.status(200).json({success:true, message: "Successfully logged out!"});
	}
	else
		res.status(401).json({success:false, message: "Not logged in!"});
});

module.exports = logoutRouter;
