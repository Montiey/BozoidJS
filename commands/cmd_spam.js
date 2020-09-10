const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'Spammer';
exports.command = 'spam';
exports.parameters = [
	{
		input: true,
		description: 'num'
	},
	{
		input: true,
		description: 'phrase'
	}
];

exports.script = function(cmd, msg){
	msg.delete(0);
	
	let maxSpams = 10;

	let num = Math.min(parseInt(parser.getArg(msg.content, 0)), maxSpams);


	let content = parser.getFreestyle(msg.content, 1);

	for(let i = 0; i < num; i++) msg.channel.send(content);

}
