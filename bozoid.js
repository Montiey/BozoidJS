const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');

const files = require("./files.js");	//We at least need a static path for this one
const bozoid = JSON.parse(fs.readFileSync(files.paths.config));
const token = JSON.parse(fs.readFileSync(files.paths.token)).token;
const commands = require(files.paths.commands);	//Commands go here
const parser = require(files.paths.parser);
const util = require(files.paths.util);

client.on('message', msg => {
	console.log((process.uptime() + "").toHHMMSS() + " (" + msg.member.guild + ")[" + msg.channel.name + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content);

	for(var command of commands.list.onMessage){
		var pass = true;

		if(!command.allowBot && msg.author.bot){
			// console.log("Bot. Not allowing.")
			pass = false;
		}

		if(command.masterOnly && bozoid.master.id != msg.author.id) pass = false;

		if(pass == true && command.parameters)
		for(var i = 0; i < command.parameters.length; i++){
			var parameter = command.parameters[i];

			if(parameter.input){
				// console.log("Input parameter, skipping...");
				continue;	//If it's input, we don't need to check anything at all.
			}

			if(parameter.prefixed && bozoid.cmdPref + parameter.keyword != parser.getArg(msg.content, i)){
				// console.log("Prefixed keyword not met: " + parameter.keyword + ", skipping...");
				pass = false;
				break;
			}
			if(!parameter.prefixed && parameter.keyword != parser.getArg(msg.content, i)){
				// console.log("Keyword not met: " + parameter.keyword + ", skipping...");
				pass = false;
				break;
			}
		}

		if(pass){	//Finally, if the command really should be run, do stuff
			// console.log("Passed! Running...");
			command.script(command, msg);
		}
	}
});

client.on('error', e => {
	console.log("discord.js client error:");
	console.log(e);
});

client.on('ready', () => {
	util.setStatus(client, bozoid.game, "online");
	console.log("Ready: " + client.user.tag);
});

client.login(token);

////////////////

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
