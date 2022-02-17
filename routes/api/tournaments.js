const express = require("express");
const tournamentRouter = express.Router();
const {tournamentModel} = require("../../models/tournamentModel");
const User = require("../../models/userModel");
const { generateUniqueId, generateUniqueIdsBulk } = require("../../utils/mongoose");

tournamentRouter.get("/:id", async(req,res) => {
	const tournament = await tournamentModel.findOne({id: req.params.id});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.id}' not found`
		});

	else if(req.session.username == tournament.owner)
		res.json({success:true, message: tournament});
	else
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
});

tournamentRouter.all("*", (req,res,next)=> {
	if(!req.session.username)
		res.status(401).json({success:false, message: "Not logged in"});
	else
		next();
});

tournamentRouter.get("/", async (req,res) => {
	const tournaments = await tournamentModel.find({owner: req.session.username});
	res.json({success:true, message: tournaments});
});

tournamentRouter.get("/:userId/:id", async(req,res) => {
	const tournament = await tournamentModel.findOne({id: req.params.id, owner:req.params.userId});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.id}' of user '${req.params.userId}' not found`
		});

	else if(req.session.username == tournament.owner)
		res.json({success:true, message: tournament});
	else
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
});

tournamentRouter.post("/", async (req, res) => {

	const document = {
		id: await generateUniqueId(6, tournamentModel),
		owner: req.session.userId,
		...req.body
	};
	let tournament =  new tournamentModel(document);
	tournament.save();

	let user = await User.findOne({id:req.session.userId});
	user.tournaments.push(tournament.id);
	await user.save();

	res.json({success:true, message: tournament});
});

tournamentRouter.post("/:id/players", async (req,res) => {
	const tournament = await tournamentModel.findOne({id: req.params.id});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.id}' not found`
		});

	else if(req.session.userId !== tournament.owner)
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
	else{
		const ids = generateUniqueIdsBulk(4,req.body.players.length);
		for(let i = 0; i < req.body.players.length; i++){
			let doc = {
				id: ids[i],
				...req.body.players[i],
			};
			tournament.players.push(doc);
		}
		await tournament.save();
		res.json({success:true, message: tournament});
	}

});

module.exports = tournamentRouter;

