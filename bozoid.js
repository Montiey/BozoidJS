console.log('======== bozoid.js | BEGIN ========')

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
		isGuild = msg.guild ? true : false
		//console.log("Processing message for " + msg.author.username)
		//console.log("Is guild " + isGuild)

		oStr = new Date().toISOString() + " (" +

		(isGuild ? msg.guild.name : "<DM>") +

		")[" +

		(isGuild ? msg.channel.name : msg.channel.recipient.username + "#" + msg.channel.recipient.discriminator) +

		"]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content

		console.log(oStr)

		if(msg.embeds.length){	//TODO: a way to put embeds in the logs?
			//console.log('Message has embeds')
			//msg.embeds.forEach(e => console.log(e))
		}

		if(msg.attachments.size){
			//console.log('Message has attachments')
			msg.attachments.each(a => console.log('[^ Attachment URL] ' + a.url))
		}

	} catch(e){
		console.log(new Date().toISOString() + " Something happened:");
		console.log(e)
	}

	(function(){
		iterator: for(var cmdModule of loader.commandStore.onMessage){	//TODO: labels reeee
			//console.log("Testing " + cmdModule.description);

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
					msg.delete({timeout:10000});
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
					msg.channel.send("Incorrect parameters").then(m => {
						m.delete({timeout:10000});
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

client.on('voiceStateUpdate', function(oldState, newState){
	try{
		//console.log(new Date().toISOString() + " (" + newState.id + ")<" + newState.member.user.username + "#" + newState.member.user.discriminator + "> Voice Update");	
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:");
		console.log(e)
	}

	for(var cmdModule of loader.commandStore.onVoiceStatusUpdate){
		cmdModule.script(cmdModule, oldState, newState);
	}
});




////////

let presenceGuildStore = {};

client.on('presenceUpdate', function(oldPresence, newPresence){
	try{
		//console.log(new Date().toISOString() + " (" + newPresence.user.id + ")<" + newPresence.user.username + "#" + newPresence.user.discriminator + "> Presence Update");
	} catch(e){
		console.log(new Date().toISOString() + " Something happened:");
		console.log(e)
	
	}

	if(newPresence.status == presenceGuildStore[newPresence.user.id]) return;	//TODO: This invalidates all use cases that depend on a guild in context to a presence update, in favor of emulating a single presence update without a practical guild relation.

	presenceGuildStore[newPresence.user.id] = newPresence.status;

	for(let cmdModule of loader.commandStore.onPresenceUpdate){
		cmdModule.script(cmdModule, oldPresence, newPresence);
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



///
loader.loadFrom('./commands');
///





client.login(bozoid.token).then(function(){
	let now = (new Date()).getTime()

	for(let schedModule of loader.commandStore.onSchedule){
		let interval = schedModule.interval

		if(!interval || interval < 100){	//Don't be stupid, stupid
			console.log("Bad schedule interval: " + interval + "?")
			continue
		}

		console.log("Scheduled interval " + interval + "ms for " + schedModule.name)

		schedModule.timer = setInterval(function(){
			schedModule.script(client)
		}, interval);
	}

	let readJSON = fileIO.read('restartInfo.json')
	let triggerChannelID = readJSON.triggerChannelID
	let restartSuccessTag = readJSON.restartSuccessTag

	//console.log("Checking for status silence tag: " + restartSuccessTag + " @ " + triggerChannelID)

	if(!restartSuccessTag && triggerChannelID)
	client.channels.fetch(triggerChannelID).then(channel => {
		
		fileIO.update('restartInfo.json', function(json){
			channel.send('Restarted, loaded `' + loader.numLoadedModules + '` modules')

			if(loader.numErroredModules){
				channel.send("**Couldn't load `" + loader.numErroredModules + '` module(s):**')

				let oStr = '```'
				for(let erroredModuleName of loader.erroredModules){
					oStr += erroredModuleName + "\n"
				}

				oStr += '```'

				channel.send(oStr)
			}

			//At this point nothing went wrong, tag the info file with success, don't send anything else
			json.restartSuccessTag = true
			json.triggerChannelID = null	//TODO: shouldn't need, but eliminates chances of spam due to boot loop
		})
		
	})
})



//EOF
