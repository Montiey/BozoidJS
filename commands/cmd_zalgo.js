const parser = require('freestyle-parser');
const zalgo = require('to-zalgo');

exports.eventGroup = 'onMessage';
//exports.description = 'Zalgo generator'
exports.description = 'b̾ͯ̅e̽̂̇h̍͗ͮȍ͞ͅlͩ̇̕d̈́͋͂,̀̒̒ ͨ̏̄y̿ͤ͌ó́̒ǔ̐ͩrͥ̽͟ ̅ͩ́dͭ͑ͬoͭ͑̈́o̔ͦ̓m͊ͩ́.̌ͦ͘'
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
