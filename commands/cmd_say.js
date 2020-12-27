const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'Say';
exports.command = 'say';
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];

exports.script = function(cmd, msg){
	msg.delete({timeout:0});
	msg.channel.send(parser.getFreestyle(msg.content, 0));
}
