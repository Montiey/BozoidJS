const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'Rifleman\'s Creed';
exports.command = 'rifle';
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];

let creed = "*This is my rifle. There are many like it, but this one is mine.\nMy rifle is my best friend. It is my life. I must master it as I must master my life.\nWithout me, my rifle is useless. Without my rifle, I am useless. I must fire my rifle true. I must shoot straighter than my enemy who is trying to kill me. I must shoot him before he shoots me. I will...\nMy rifle and I know that what counts in war is not the rounds we fire, the noise of our burst, nor the smoke we make. We know that it is the hits that count. We will hit...\nMy rifle is human, even as I, because it is my life. Thus, I will learn it as a brother. I will learn its weaknesses, its strength, its parts, its accessories, its sights and its barrel. I will keep my rifle clean and ready, even as I am clean and ready. We will become part of each other. We will...\nBefore God, I swear this creed. My rifle and I are the defenders of my country. We are the masters of our enemy. We are the saviors of my life.\nSo be it, until victory is America's and there is no enemy, but peace!*"

exports.script = function(cmd, msg){
	let newCreed = creed.replace(/rifle/gi, parser.getFreestyle(msg.content, 0));
	msg.channel.send(newCreed);
}
