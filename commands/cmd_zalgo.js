const parser = require('freestyle-parser');
const zalgo = require('to-zalgo');

exports.eventGroup = 'onMessage';
exports.description = 'Zalgo Generator';
exports.allowBot = false;
exports.command = 'zalgo';
exports.parameters = [
	{
		input: true,
		description: "phrase"
	}
];

exports.script = function(cmd, msg){
	msg.delete(0);
	msg.channel.send(zalgo(parser.getFreestyle(msg.content, 0)));

}