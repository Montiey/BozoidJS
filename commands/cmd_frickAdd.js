const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Add phrase to frick jar';
exports.allowBot = false;
exports.command = 'addfrick';
exports.masterOnly = true;
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];


exports.script = function(cmd, msg){
	let phrase = parser.getFreestyle(msg.content, 0);
	console.log("Received frick phrase " + phrase);
	fileIO.update("fricks.json", function(json){
		json.list.push(phrase);
		msg.channel.send("Added to list: `" + phrase + "`");
	});
};
