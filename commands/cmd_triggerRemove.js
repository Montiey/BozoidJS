const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

const bozoid = fileIO.read('bozoid.json');

exports.eventGroup = 'onMessage';
exports.description = 'Remove on-the-fly phrase response';
exports.masterOnly = true;
exports.command = 'untrigger';
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];

exports.script = function(cmd, msg){
	fileIO.update("responder.json", function(json){

		if(json.list)
		for(var set of json.list){
			if(set.trigger == parser.getArg(msg.content, 0)){
				json.list.splice(json.list.indexOf(set), 1);

				msg.channel.send("Removed.");
				break;
			}
		}
	});
}
