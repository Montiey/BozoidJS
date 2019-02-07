global.__basedir = __dirname;	//Set __basedir to this directory (project root)

const Discord = require('discord.js');
const client = new Discord.Client();

const fileIO = require("bozoid-file-grabber");
const commands = require("bozoid-commands");
const bozoid = fileIO.read("bozoid.json");
const parser = require("discord-command-parser");

client.on('message', msg => {
	console.log((process.uptime() + "").toHHMMSS() + " (" + msg.member.guild + ")["
	+ msg.channel.name + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content);

	for(var command of commands.list.onMessage){
		// console.log("Testing " + command.description);

		var parsed = parser.parse(msg, bozoid.cmdPref);
		var pass = true;

		//Cascading checking section

		if(pass && command.command && command.command != parsed.command){
			// console.log("Wrong command");
			pass = false;
		}

		if(pass && !command.allowBot && msg.author.bot){
			// console.log("Human restricted");
			pass = false;
		}

		if(pass && command.masterOnly && bozoid.master.id != msg.author.id){
			// console.log("Master restricted")
			pass = false;
		}

		if(pass)
		for(var listedUser of fileIO.read("blacklist.json").list){
			if(listedUser.id == msg.author.id && !command.allowBlacklisted){
				// console.log("User is blacklisted");
				pass = false;
				break;
			}
		}

		if(pass && command.parameters)
		for(var i = 0; i < command.parameters.length; i++){	//check each parameter (last check)
			var parameter = command.parameters[i];

			if(parameter.input){
				if(!parsed.arguments[i]){
					// console.log("Missing input parameter");
					pass = false;
					break;
				}
			} else{
				if(parameter.keyword != parsed.arguments[i]){
					// console.log("Keyword not met: " + parameter.keyword);
					pass = false;
					break;
				}
			}
		}

		//End checking section

		if(pass){	//Finally, if the command really should be run, do stuff
			// console.log("Passed.");
			command.script(command, msg);
		}
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
