const fileIO = require('bozoid-file-grabber');
const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = "Remove users from the command blacklist";
exports.masterOnly = true;
exports.command = 'unblacklist';
exports.parameters = [
	{
		input: true,
		description: '@mention'
	}
];

exports.script = function(cmd, msg){
	let id = /[0-9]+/.exec(parser.getArg(msg.content, 0))[0]
	console.log("Query: " + id)


	msg.guild.members.fetch(id).then(member => {
		fileIO.update("blacklist.json", function(json){
			for(let i=0; i<json.list.length; i++){
				if(json.list[i].id == member.id){
					exists = true
					json.list.splice(i, 1)
				}
			}
		})

		if(exists){
			msg.channel.send("Removed `" + member.user.username + "#" + member.user.discriminator + "` from the blacklist file")
		} else{
			msg.channel.send("`" + member.user.username + "#" + member.user.discriminator + "` isn't in the blacklist file")
		}
	}).catch(e => {
		msg.channel.send("Invalid user")
	})

	/*msg.client.fetchUser(/[0-9]+/.exec(parser.getArg(msg.content, 0))[0]).then(function(listedUser){
		let exists = false;

		fileIO.update("blacklist.json", function(json){
			for(let i = 0; i < json.list.length; i++){
				if(json.list[i].id == listedUser.id){
					exists = true;
					json.list.splice(i, 1);
				}
			}
		});

		if(exists){
			msg.channel.send("Removed `" + listedUser.username + "#" +
			listedUser.discriminator + "` from the blacklist file");
		} else{
			msg.channel.send("`" + listedUser.username + "#" +
			listedUser.discriminator + "` isn't in the blacklist file");
		}
	});*/
}
