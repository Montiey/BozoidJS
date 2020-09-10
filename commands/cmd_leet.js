const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'L337 73X7 G3N3R470R';
exports.allowBot = false;
exports.command = 'leet';
exports.parameters = [
	{
		input: true,
		description: "phrase"
	}
];

exports.script = function(cmd, msg){
	msg.delete(0);
	
	table = [
		"a4", "b6", "e3", "g9", "i1", "l1", "o0", "s5", "t7"
	]

	input = parser.getFreestyle(msg.content, 0).toLowerCase();

	for(set of table) input = input.replace(new RegExp(set[0], 'g'), set[1]);

	msg.channel.send(input.toUpperCase());
}
