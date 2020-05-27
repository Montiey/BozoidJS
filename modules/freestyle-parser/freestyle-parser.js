const fileIO = require("bozoid-file-grabber");
const bozoid = fileIO.read("bozoid.json");
const parser = require("freestyle-parser");


exports.getCommand = function(msg){
	if(msg.substring(0,1) != bozoid.cmdPref) return null;
	
	let command = msg.slice(1).split(" ").slice(0, 1)[0].toLowerCase();
	//console.log("Freestyle> Command " + command);
	return command;
}

exports.getArgs = function(msg){
	let args = msg.split(" ").slice(1);
	//console.log("Freestyle> Parsed " + JSON.stringify(args));

	return args;
}

exports.getArg = function(msg, index){
	return parser.getArgs(msg)[index];
}

exports.getFreestyle = function(msg, index){
	let free = parser.getArgs(msg).slice(index).join(" ");
	//console.log("Freestyle> Combined " + free);

	return free;
}
