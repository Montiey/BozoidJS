const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Remove phrase to frick jar';
exports.allowBot = false;
exports.command = 'delfrick';
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
		let exists = false
		index = 0
		for(entry of json.list){
			if(entry.toLowerCase() == phrase.toLowerCase()){
				exists = true

				console.log("Removing frick " + index)

				json.list.splice(index, 1)

				break;
			}

			index++
		}
		if(!exists){
			msg.react("👎");
		} else{
			msg.react("👌");
		}
	});
};
