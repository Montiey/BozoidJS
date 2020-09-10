const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'say';
exports.command = 'say';
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];

exports.script = function(cmd, msg){
	msg.delete(0);
	msg.channel.send(parser.getFreestyle(msg.content, 0));
}
