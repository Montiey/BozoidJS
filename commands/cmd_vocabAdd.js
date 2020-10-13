const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.masterOnly = 'true';
exports.commands = ['addvocab', 'av']
exports.description = 'Add vocabulary';
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];

exports.script = function(cmd, msg){
	let phrase = parser.getFreestyle(msg.content, 0);

	fileIO.update("vocabulary.json", function(obj){
		if(obj.list.indexOf(phrase) == -1){
			obj.list.push(phrase);
			//msg.channel.send("Added to vocabulary: " + phrase);
			msg.react("👌");
		} else{
			//msg.channel.send("Already added");
			msg.react("👎");
		}
	});
}
