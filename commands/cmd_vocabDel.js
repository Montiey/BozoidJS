const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.masterOnly = 'true';
exports.command = 'delvocab';
exports.description = 'Remove vocabulary';
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];

exports.script = function(cmd, msg){
	let phrase = parser.getFreestyle(msg.content, 0);
	let index = 0;

	fileIO.update("vocabulary.json", function(obj){
		for(var value of obj.list){
			if(value == phrase){
				obj.list.splice(index, 1);
				msg.channel.send("Removed: " + phrase);
				return;
			}
			index++;
		}
		msg.channel.send("Couldn't remove: " + phrase);
	});
}