const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Frick leaderboards';
exports.allowBot = false;
exports.command = 'jartop';

exports.script = function(cmd, msg){
	let json = fileIO.read("frickjar.json");

	let inA = json.list;
	let outA = [];
	let numTop = 8;

	for(let i = 0; i < numTop; i++){
		let found = null;
		let foundV = 0;
		let realName = "";
		let succ = false;
		for(let j = 0; j < inA.length; j++){
			let member = msg.guild.member(inA[j].id);
			if(inA[j].total > foundV && member != null){
				found = j;
				foundV = inA[j].total;
				succ = true;
			}
		}
		if(succ){
			outA.push(inA.splice(found, 1)[0]);
		}
	}

	let text = "Frick Jar™ top balances:```";
	for(let entry of outA){
		text += "$" + entry.total + " - " + entry.referenceName + "\n";
	}

	text += "```";

	msg.channel.send(text);
};
