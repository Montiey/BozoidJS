global.__basedir = __dirname;	//Set __basedir to this directory (project root)

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const fileIO = require("bozoid-file-grabber");
const bozoid = fileIO.read("bozoid.json");
const parser = require("freestyle-parser");
const loader = require('bozoid-command-loader');




////////
client.on('message', function(msg){
	try{
		console.log(new Date().toISOString() + " (" +
		(msg.member ? msg.member.guild : "<DM>") + ")[" +
		(msg.member ? msg.channel.name : msg.channel.recipient.username + "#" +
		msg.channel.recipient.discriminator) + "]<" +
		msg.author.username + "#" + msg.author.discriminator + "> " +
		msg.content);
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}

	(function(){
		iterator: for(var cmdModule of loader.commandStore.onMessage){	//TODO: labels reeee
			//console.log("Testing " + command.description);

			//Cascading checking section

			
			if(cmdModule.commands && cmdModule.commands.indexOf(parser.getCommand(msg.content)) < 0){
				//console.log("Wrong command: " + cmdModule.commands + " != " + parser.getCommand(msg.content))
				continue iterator
			}	

			if(cmdModule.command && cmdModule.command != parser.getCommand(msg.content)){
				//console.log("Wrong command: " + cmdModule.command + " != " + parser.getCommand(msg.content));
				continue iterator;
			}

			if(!cmdModule.allowBot && msg.author.bot){
				//console.log("Human restricted");
				continue iterator;
			}

			if(cmdModule.masterOnly && bozoid.master.id != msg.author.id){
				//console.log("Master restricted")
				continue iterator;
			}

			for(var listedUser of fileIO.read("blacklist.json").list){
				if(listedUser.id == msg.author.id && !cmdModule.allowBlacklisted){
					//console.log("User is blacklisted");
					continue iterator;
				}
			}

			if(cmdModule.parameters){
				let incorrect = false;
				if(cmdModule.parameters.length > parser.getArgs(msg.content).length) {
					msg.delete(10000);
					incorrect = true;
				}

				//check each parameter (last check)
				for(var i = 0; i < cmdModule.parameters.length; i++){
					var parameter = cmdModule.parameters[i];

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
			cmdModule.script(cmdModule, msg);
		}
	})();
});






////////

client.on('voiceStateUpdate', function(oldMember, newMember){
	try{
		//console.log(new Date().toISOString() + " (" + newMember.id + ")<" + newMember.user.username + "#" + newMember.user.discriminator + "> Voice Update");	
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}

	for(var cmdModule of loader.commandStore.onVoiceStatusUpdate){
		cmdModule.script(cmdModule, oldMember, newMember);
	}
});




////////

let presenceGuildStore = {};

client.on('presenceUpdate', function(oldMember, newMember){
	try{
		//console.log(new Date().toISOString() + " (" + newMember.id + ")<" + newMember.user.username + "#" + newMember.user.discriminator + "> Presence Update");
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:\n" + JSON.stringify(e));
	}


	if(newMember.presence.status == presenceGuildStore[newMember.id]) return;	//TODO: This invalidates all use cases that depend on a guild in context to a presence update, in favor of emulating a single presence update without a practical guild relation.

	presenceGuildStore[newMember.id] = newMember.presence.status;

	for(let cmdModule of loader.commandStore.onPresenceUpdate){
		cmdModule.script(cmdModule, oldMember, newMember);
	}
});















////////////


client.on('error', e => {
	console.log("Client error: ");
	console.log(e);
});







//////




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


loader.loadFrom('./commands');






client.login(bozoid.token).then(function(){
	for(let schedModule of loader.commandStore.onSchedule){
		let interval = schedModule.interval
		if(!interval || interval < 100){
			console.log("Bad schedule interval: " + interval + "?")
			continue
		}
		console.log("Scheduled interval " + interval + "ms")
		schedModule.timer = setInterval(function(){
			schedModule.script(client)
		}, interval);
	}
})



//EOF
