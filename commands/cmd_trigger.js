const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

const bozoid = fileIO.read('bozoid.json');

exports.eventGroup = 'onMessage';
exports.description = 'Add on-the-fly phrase response';
exports.masterOnly = true;
exports.command = 'trigger';
exports.parameters = [
	{
		input: true,
		description: 'on'
	},
	{
		input: true,
		description: 'then'
	}
];

exports.script = function(cmd, msg){
	console.log("Running responder add");

	fileIO.update("responder.json", function(json){
		var proceed = true;
		var newTrigger = parser.getArg(msg.content, 0).toLowerCase();
		var newResponse = parser.getFreestyle(msg.content, 1);

		for(var obj of json.list){
			if(newTrigger == obj.trigger){
				proceed = false;
				break;
			}
		}

		if(msg.author.id != bozoid.master.id){
			proceed = false;
		}

		if(proceed){
			msg.channel.send("Added.");
			json.list.push({
				trigger: newTrigger,
				response: newResponse
			});
		}
	});
};
