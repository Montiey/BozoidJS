const fileIO = require('bozoid-file-grabber');
const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'Be notified of voice channel activity';
exports.masterOnly = false;
exports.command = "voicemon";
exports.parameters = [];

exports.script = function(cmd, msg){
	fileIO.update("voicemonitor.json", function(obj){
		let entry = null;
		for(let listed of obj.list){
			if(listed.id == msg.author.id){
				entry = listed;
				break;
			}
		}


		if(!entry){
			entry = {
				referenceName: msg.author.username + "#" + msg.author.discriminator,
				id: msg.author.id,
				guildPreferences: {
					[msg.guild.id]: true
				},
				lastCheckTime: 0
			}
			obj.list.push(entry);

			//console.log("Created new entry for " + msg.author.id);
		} else{
			entry.guildPreferences[msg.guild.id] = entry.guildPreferences[msg.guild.id] ? false : true
		}

		let state = entry.guildPreferences[msg.guild.id]
		let name = msg.author.username + '#' + msg.author.discriminator
		msg.channel.send('Voice channel DMs ' + (state ? '`enabled`' : '`disabled`') + ' for `' + name + '` in `' + msg.guild.name + '`')
	});
};
