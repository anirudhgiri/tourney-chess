const express = require("express");
const tournamentRouter = express.Router();
const {tournamentModel} = require("../../models/tournamentModel");
const User = require("../../models/userModel");

tournamentRouter.get("/:id", async(req,res) => {
	const tournament = await tournamentModel.findOne({id: req.params.id, isPublic: true});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.id}' not found`
		});

	else
		res.json({success:true, message: tournament});
});

tournamentRouter.all("*", (req,res,next)=> {
	if(!req.session.username)
		res.status(401).json({success:false, message: "Not logged in"});
	else
		next();
});

tournamentRouter.get("/", async (req,res) => {
	const tournaments = await tournamentModel.find({owner: req.session.userId});
	res.json({success:true, message: tournaments});
});

tournamentRouter.get("/:privateId", async(req,res) => {
	const tournament = await tournamentModel.findOne({privateId: req.params.privateId});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.privateId}' of user '${req.session.userId}' not found`
		});

	else if(req.session.userId == tournament.owner)
		res.json({success:true, message: tournament});
	else
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
});

tournamentRouter.post("/", async (req, res) => {

	const document = {
		owner: req.session.userId,
		...req.body
	};
	let tournament =  new tournamentModel(document);
	let saveTournament = tournament.save();

	let user = await User.findOneAndUpdate({id:req.session.userId},{$push:{tournaments: tournament.privateId}});
	let saveUser = user.save();

	await Promise.all([saveTournament, saveUser]);
	res.json({success:true, message: tournament});
});

tournamentRouter.post("/:privateId/players", async (req,res) => {
	const tournament = await tournamentModel.findOne({privateId: req.params.privateId});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.privateId}' not found`
		});

	else if(req.session.userId !== tournament.owner)
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
	else{
		for(let i = 0; i < req.body.players.length; i++){
			let doc = {
				...req.body.players[i],
			};
			tournament.players.push(doc);
		}
		await tournament.save();
		res.json({success:true, message: tournament});
	}

});

tournamentRouter.put("/:privateId/makePublic", async (req,res) => {
	const tournament = await tournamentModel.findOne({id: req.params.privateId});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.privateId}' of user '${req.params.userId}' not found`
		});

	else if(tournament.isPublic)
		res.status(400).json({success:false, message: "Tournament is already public"});

	else if(req.session.userId == tournament.owner){
		tournamentModel.findOneAndUpdate({id: req.params.privateId},{isPublic: true}).exec();
		res.status(200).json({success:true, message: "Tournament successfully made public!"});
	}

	else
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
});

tournamentRouter.put("/:privateId/makePrivate", async (req,res) => {
	const tournament = await tournamentModel.findOne({id: req.params.privateId});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.privateId}' of user '${req.params.userId}' not found`
		});

	else if(!tournament.isPublic)
		res.status(400).json({success:false, message: "Tournament is already private"});

	else if(req.session.userId == tournament.owner){
		tournamentModel.findOneAndUpdate({id: req.params.privateId},{isPublic: false}).exec();
		res.status(200).json({success:true, message: "Tournament successfully made private!"});
	}

	else
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
});

tournamentRouter.delete("/:privateId", async (req,res) => {
	const tournament = await tournamentModel.findOne({id: req.params.privateId, owner:req.session.userId});
	if(!tournament)
		res.status(404).json({
			success:false,
			message: `Tournament with tournamentId '${req.params.privateId}' of user '${req.params.userId}' not found`
		});

	else if(req.session.userId == tournament.owner){
		tournamentModel.deleteOne({privateId: req.params.privateId, owner:req.params.userId}).exec();
		User.findOneAndUpdate({id: req.params.userId},{$pull: {tournaments: req.params.privateId}}).exec();
		res.status(200).json({success:true, message: "Tournament deleted successfully"});
	}

	else
		res.status(403).json({success:false, message: "You are not the owner of this tournament"});
});

module.exports = tournamentRouter;

