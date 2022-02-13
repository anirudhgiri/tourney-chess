const {nanoid} = require("nanoid");

async function generateUniqueId(length, model){
	for(let i = 0; i < 5; i++){
		const id = nanoid(length);
		const doc = await model.findOne({id});
		if(!doc)
			return id;
	}
	throw new Error("Too Many Id Hits");
}

async function generateUniqueIdsBulk(length, number){
	let ids = new Set();
	let iters = 0;
	while(ids.size < number){
		ids.add(nanoid(length));
		iters++;
		if(iters > number + 5)
			throw new Error("Too Many Id Hits");
	}

	return ids.values;
}

module.exports = {
	generateUniqueId,
	generateUniqueIdsBulk
};
