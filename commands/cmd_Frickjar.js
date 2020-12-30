const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Frick Jar';
exports.allowBot = false;
exports.noHelp = true;

exports.script = function(cmd, msg){
	fricks = fileIO.read("fricks.json")["list"];
	let justAdded = null;
	for(let frick of fricks){
		if(msg.content.toLowerCase().includes(frick)){
			//console.log("Frick!");	
			fileIO.update("frickjar.json", function(json){
				for(var listedUser of json.list){
					if(listedUser.id == msg.author.id){
						//console.log("User already listed");
						justAdded = listedUser;
						listedUser.total = (listedUser.total != undefined ? listedUser.total : 0) + 1;	//Add 1 to existing value or initialize it
						listedUser.referenceName = msg.author.username + "#" + msg.author.discriminator	//Re-initialize this every time because apparently the #0000#0000 bug is still a thing (2020-12-20)
						return;
					}
				}
				//console.log("User not already listed");
				justAdded = {
					"id":msg.author.id,
					"referenceName":msg.author.username + "#" +
						msg.author.discriminator,
					"total":1
				}
				json.list.push(justAdded)
			});

			if(justAdded.total % 10 == 0) msg.channel.send("You said: `" + frick +
				"`!\nFrick Jar™ total for `" + justAdded.referenceName + "` is `$" +
				justAdded.total + "`");

			break;
		}
	}
};
