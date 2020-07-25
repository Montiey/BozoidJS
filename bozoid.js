global.__basedir = __dirname;	//Set __basedir to this directory (project root)

const Discord = require('discord.js');
const client = new Discord.Client();

const fileIO = require("bozoid-file-grabber");
const commands = require("bozoid-commands");
const bozoid = fileIO.read("bozoid.json");
const parser = require("freestyle-parser");

client.on('message', function(msg){
	try{
		console.log(new Date().toISOString() + " (" + (msg.member ? msg.member.guild : "<DM>") + ")[" + (msg.member ? msg.channel.name : msg.channel.recipient.username + "#" + msg.channel.recipient.discriminator) + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content);
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}

	(function(){	//TODO: Why is this wrapped? Return?
		iterator: for(var command of commands.list.onMessage){	//TODO: Labels reee

			// console.log("Testing " + command.description);

			//Cascading checking section

			if(command.command && command.command != parser.getCommand(msg.content)){
				//console.log("Wrong command: " + command.command + " != " + parser.getCommand(msg.content));
				continue iterator;
			}

			if(!command.allowBot && msg.author.bot){
				//console.log("Human restricted");
				continue iterator;
			}

			if(command.masterOnly && bozoid.master.id != msg.author.id){
				//console.log("Master restricted")
				continue iterator;
			}

			for(var listedUser of fileIO.read("blacklist.json").list){
				if(listedUser.id == msg.author.id && !command.allowBlacklisted){
					//console.log("User is blacklisted");
					continue iterator;
				}
			}

			if(command.parameters){
				let incorrect = false;
				if(command.parameters.length > parser.getArgs(msg.content).length) {
					msg.delete(10000);
					incorrect = true;
				}
				for(var i = 0; i < command.parameters.length; i++){	//check each parameter (last check)
					var parameter = command.parameters[i];

					if(parameter.input){
						if(!parser.getArg(msg.content, i)){
							//console.log("Missing input parameter");
							incorrect = true;
						}
					} else{
						if(parameter.keyword != parser.getArg(msg.content, i)){
							//console.log("Keyword not met: " + parameter.keyword);
							incorrect = true;
						}
					}
				}
				if(incorrect){
					msg.channel.send("Incorrect parameters").then(msg => {
						msg.delete(10000);
					});
					continue iterator;
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




let presenceGuildStore = {};

client.on('presenceUpdate', function(oldMember, newMember){
	try{
		//console.log(new Date().toISOString() + " (" + newMember.id + ")<" + newMember.user.username + "#" + newMember.user.discriminator + "> Presence Update");
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}


	if(newMember.presence.status == presenceGuildStore[newMember.id]) return;	//TODO: This invalidates all use cases that depend on a guild in context to a presence update, in favor of emulating a single presence update without a practical guild relation.

	presenceGuildStore[newMember.id] = newMember.presence.status;

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
	console.log("Ready: " + client.user.tag + " @ " + (new Date()).toISOString());
});

client.login(bozoid.token);




//EOF
