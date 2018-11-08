const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const zalgo = require("to-zalgo");
const numberConverter = require("number-to-words");

const bozoid = JSON.parse(fs.readFileSync("bozoid.json"));
const token = JSON.parse(fs.readFileSync("private/token.json")).token;
const cseKeys = JSON.parse(fs.readFileSync("private/googleCSE.json"));
const googleImages = require("google-images");
const commands = require("./commands.js");	//Commands go here
const imgClient = new googleImages(cseKeys.id, cseKeys.key);
const parser = require("./commandParser.js");

//Declare the paths to these files so they can be written to later.
const vocabularyPath = "private/vocabulary.json";
var vocabulary;
try{
	vocabulary = JSON.parse(fs.readFileSync(vocabularyPath));
} catch(e){
	vocabulary = {
		list: [
			"oof"
		]
	};
}
const blacklistPath = "private/blacklist.json";
var blacklist;
try{
	blacklist = JSON.parse(fs.readFileSync(blacklistPath));
} catch(e){
	blacklist = {
		users: [
			{
				id: "420",
				by: "Herobrine",
				reason: "Griefing"
			}
		]
	};
}

client.on('message', msg => {
	console.log((process.uptime() + "").toHHMMSS() + " (" + msg.member.guild + ")[" + msg.channel.name + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content);
	for(var command of commands.list.onMessage){
		var matchesAllParameters = true;
		for(var i = 0; i < command.parameters.length; i++){
			if(parameter[i].type == command){
				if(prameter[i].text == parser.getArg(msg.content, i)){
					console.log("Parameter match: " + paramater[i] + " " + parser.getArg(msg.content, i));
				}
			}
		}
	}
});

client.on('error', e => {
	console.log("discord.js client error:");
	console.log(e);
});

client.on('ready', () => {
	setStatus(bozoid.game, "online");
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

function setStatus(game, status){
	client.user.setPresence({
		game: {
			name: game
		},
		status: status
	});
}
