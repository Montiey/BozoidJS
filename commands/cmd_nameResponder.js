const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Name responder';
exports.noHelp = true;
exports.script = function(cmd, msg){
	let vocab = fileIO.read('vocabulary.json').list;
	for(let aka of fileIO.read('bozoid.json').names){
		if(msg.cleanContent.toLowerCase().includes(aka.toLowerCase())){
			phrase = vocab[Math.floor(Math.random() * vocab.length)]
			msg.channel.send(phrase);
			break;
		}
	}
};
