const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'List people in this guild on the blacklist';
exports.masterOnly = true;
exports.command = 'listblacklist';
exports.script = function(cmd, msg){
	let oStr = '';
	let anyInGuild = false;
	let list = fileIO.read('blacklist.json').list;
	
	msg.channel.send('Blacklisted users: ');
	for(let listed of list){
		let targetMember = msg.guild.member(listed.id);
	
		if(targetMember == null) continue;

		anyInGuild = true;

		let tempNew = '`' + targetMember.user.username + '#' + 
		targetMember.user.discriminator + '` for `' + listed.reason + '`\n';

		if((oStr + tempNew).length > 2000){	//Fire off a message if this is big
			msg.channel.send(oStr);
			oStr = tempNew;
		} else{
			oStr += tempNew;
		}
	}

	if(oStr.length > 0 && anyInGuild){
		msg.channel.send(oStr);
	}

	else msg.channel.send("No blacklisted users here.");
};
