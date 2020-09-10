const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Add a user to the command blacklist';
exports.masterOnly = true;
exports.command = 'blacklist';
exports.parameters = [
	{
		input: true,
		description: '@mention'
	},
	{
		input: true,
		description: 'reason',
	}
];

exports.script = function(cmd, msg){
	let reason = parser.getFreestyle(msg.content, 1);
	let byUser = msg.author;
	msg.client.fetchUser(/[0-9]+/.exec(parser.getArg(msg.content, 0))[0]).then(function(listedUser){
		if(listedUser.id == msg.author.id){
			msg.channel.send("You can't blacklist yourself, dummy");
			return;
		}

		var exists = false;

		fileIO.update("blacklist.json", function(json){
			for(var alreadyListed of json.list){
				if(alreadyListed.id == listedUser.id){
					exists = true;
					continue;
				}
			}
			if(!exists) json.list.push({
				referenceName: listedUser.username + "#" + listedUser.discriminator,	
				id: listedUser.id,
				reason: reason,
				by: byUser.id
			});
		});

		if(!exists){
			msg.channel.send("`" + byUser.username + "#" + byUser.discriminator +
			"` blacklisted `" + listedUser.username + "#" + listedUser.discriminator +
			"` for `" + reason + "`");
		} else{
			msg.channel.send("`" + listedUser.username + "#" +
			listedUser.discriminator + "` is already blacklisted.");
		}
	});
};
