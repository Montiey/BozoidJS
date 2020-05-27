global.__basedir = __dirname;	//Set __basedir to this directory (project root)

const Discord = require('discord.js');
const client = new Discord.Client();

const fileIO = require("bozoid-file-grabber");
const commands = require("bozoid-commands");
const bozoid = fileIO.read("bozoid.json");
const parser = require("discord-command-parser");
const bParser = require("bozoid-command-parser");

client.on('message', function(msg){
	try{
		console.log(new Date().toISOString() + " (" + (msg.member ? msg.member.guild : "<DM>") + ")[" + (msg.member ? msg.channel.name : msg.channel.recipient.username + "#" + msg.channel.recipient.discriminator) + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content);
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}

	(function(){	//TODO: Why is this wrapped? Return?
		iterator: for(var command of commands.list.onMessage){	//TODO: Labels reee

			// console.log("Testing " + command.description);

			var parsed = parser.parse(msg, bozoid.cmdPref);
			

			//Cascading checking section

			if(command.command && command.command != parsed.command){
				// console.log("Wrong command");
				continue iterator;
			}

			if(!command.allowBot && msg.author.bot){
				// console.log("Human restricted");
				continue iterator;
			}

			if(command.masterOnly && bozoid.master.id != msg.author.id){
				// console.log("Master restricted")
				continue iterator;
			}

			for(var listedUser of fileIO.read("blacklist.json").list){
				if(listedUser.id == msg.author.id && !command.allowBlacklisted){
					// console.log("User is blacklisted");
					continue iterator;
				}
			}

			if(command.parameters){
				if(command.parameters.length != parsed.arguments.length) {
					msg.delete(10000);
					msg.channel.send("Incorrect parameters").then(msg => {
						msg.delete(10000);
					});
					continue iterator;
				}
				for(var i = 0; i < command.parameters.length; i++){	//check each parameter (last check)
					var parameter = command.parameters[i];

					if(parameter.input){
						if(!parsed.arguments[i]){
							// console.log("Missing input parameter");
							continue iterator;
						}
					} else{
						if(parameter.keyword != parsed.arguments[i]){
							// console.log("Keyword not met: " + parameter.keyword);
							continue iterator;
						}
					}
				}
			}


			//If the command should be run, do stuff
			command.script(command, msg);
		}
	})();
});

client.on('voiceStateUpdate', function(oldMember, newMember){
	try{
		//console.log(new Date().toISOString() + " (" + newMember.id + ")<" + newMember.user.username + "#" + newMember.user.discriminator + "> Voice Update");	
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}

	for(var command of commands.list.onVoiceStateUpdate){
		command.script(command, oldMember, newMember);
	}

});

client.on('presenceUpdate', function(oldMember, newMember){
	try{
		//console.log(new Date().toISOString() + " (" + newMember.id + ")<" + newMember.user.username + "#" + newMember.user.discriminator + "> Presence Update");
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}

	for(var command of commands.list.onPresenceUpdate){
		command.script(command, oldMember, newMember);
	}
});

client.on('error', e => {
	console.log("Client error: ");
	console.log(e);
});

client.on('ready', () => {
	client.user.setPresence({
		game: {
			name: bozoid.game,
			type: 0
		},
		status: "online"
	});
	console.log("Ready: " + client.user.tag);
});

client.login(bozoid.token);

////////////////

/*String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}*/
