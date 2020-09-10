const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onVoiceStatusUpdate';
exports.script = function(cmd, oldMember, newMember){	//Voice channel activity tracker and notifier
	let minPeople = 2;
	let timeInterval = 45*60*1000;
	let deleteDelay = 30*60*1000;
	//let timeInterval = 0;
	if(oldMember.voiceChannel != undefined || newMember.voiceChannel == undefined || newMember.voiceChannel.members.size < minPeople){
		//console.log("Voice channel not suitable, or doesn't exist") //Something went wrong
		return;
	}

	let now = (new Date).getTime();

	fileIO.update("voicemonitor.json", function(obj){
		//console.log('Joined: ' + newMember.user.username);
		for(let receivingMember of obj.list){
			let guildMember = newMember.voiceChannel.guild.members.get(receivingMember.id);
			if(!guildMember) continue;	//The user in the entry list is not in this guild, Abort.

			let valid = true;
			for(let [joinedMemberID, joinedMember] of newMember.voiceChannel.members){
				//console.log("In: " + joinedMemberID);
				if(joinedMemberID == receivingMember.id){
					//console.log("Not sending to: " + receivingMember.id);
					valid = false;
					break;
				}
			}

			if(
				valid &&
				receivingMember.notificationsEnabled &&
				now - receivingMember.lastCheckTime >= timeInterval
			){
				//console.log("True? " + valid);
				var numPeople = newMember.voiceChannel.members.size;

				guildMember.user.send(numPeople + " user(s) in " + newMember.voiceChannel.guild.name + " - " + newMember.voiceChannel.name + "!").then(msg => msg.delete(deleteDelay));

				receivingMember.lastCheckTime = now;
			} else{
				//console.log("not: " + receivingMember.id);
			}
		}
	});
}
