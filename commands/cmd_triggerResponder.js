const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Respond to trigger phrases';
exports.noHelp = true;
exports.script = function(cmd, msg){
	let json = fileIO.read('responder.json');
	
	if(json.list) for(let set of json.list){
		if(msg.cleanContent.toLowerCase().includes(set.trigger)){
			msg.channel.send(set.response);
			break;
		}
	}
};
