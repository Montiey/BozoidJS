const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onVoiceStatusUpdate';
exports.script = function(cmd, oldState, newState){	//Voice channel activity tracker and notifier
	let now = (new Date).getTime();

	let minPeople = 2;
	let timeInterval = 45*60*1000;
	//let timeInterval = 0
	let deleteDelay = 30*60*1000;

	let numPeople = 0

	if(oldState.channel){
		//console.log('User was already in a channel')
		return
	} else if(!newState.channel){
		//console.log('User is no longer in a channel')
		return
	} else if((numPeople = newState.channel.members.size) < minPeople){
		//console.log('Not enough people')
		return
	}

	//console.log('Activity from ' + newState.member.user.username)

	fileIO.update("voicemonitor.json", function(json){
		for(let receivingMember of json.list){	//Every member that may receive a DM
			if(!receivingMember.notificationsEnabled) continue	//Isn't set to be notified
			if(now - receivingMember.lastCheckTime <= timeInterval) continue	//Was notified too recently

			let guildMember = newState.guild.member(receivingMember.id);
			if(!guildMember) continue;	//The user in the entry list is not in this guild, Abort.

			let memberNotInChannel = true	//TODO: scope?

			newState.channel.members.each(joinedMember => {
				if(joinedMember.id == receivingMember.id){
					//console.log('Found ' + receivingMember.id + ' already in channel')
					memberNotInChannel = false
				}
			}).tap(() => {
				if(!memberNotInChannel) return	//The member was found to be in the voice channel, do not send
				let oStr = numPeople + " user(s) in " + newState.member.voice.channel.guild.name + " - " + newState.member.voice.channel.name + "!"
				//console.log('Reached SEND for ' + guildMember.user.username)
				//console.log(oStr)
				guildMember.user.send(oStr).then(m => m.delete({timeout:deleteDelay}))

				receivingMember.lastCheckTime = now;
			})
		}
	});
}






//EOF
