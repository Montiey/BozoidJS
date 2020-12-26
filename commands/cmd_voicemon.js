const fileIO = require('bozoid-file-grabber');
const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'Be notified of voice channel activity';
exports.masterOnly = false;
exports.command = "voicemon";
exports.parameters = [];

exports.script = function(cmd, msg){
	fileIO.update("voicemonitor.json", function(obj){
		let exists = false;
		let entry = null;
		for(let listed of obj.list){
			if(listed.id == msg.author.id){
				exists = true;
				entry = listed;
				break;
			}
		}

		if(!exists){
			entry = {
				referenceName: msg.author.username + "#" + msg.author.discriminator,
				id: msg.author.id,
				notificationsEnabled: true,
				lastCheckTime: 0
			}
			obj.list.push(entry);
			console.log("Created new entry for " + msg.author.id);
		} else{
			lastState = entry.notificationsEnabled;
			newState = !lastState;
			entry.notificationsEnabled = newState;

			//console.log("Changed notification state for " + msg.author.id + " " + lastState + " -> " + newState);
		}

		msg.channel.send("Voicechat activity notifications " +
		(entry.notificationsEnabled ? "`enabled`" : "`disabled`") +
		" for `" + entry.referenceName + "`");
	});
};
