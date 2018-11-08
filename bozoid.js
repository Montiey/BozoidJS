const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const zalgo = require("to-zalgo");
const numberConverter = require("number-to-words");

const bozoid = JSON.parse(fs.readFileSync("bozoid.json"));
const token = JSON.parse(fs.readFileSync("private/token.json")).token;
const cseKeys = JSON.parse(fs.readFileSync("private/googleCSE.json"))
const googleImages = require("google-images");
var commands = require("./commands.js");	//Commands go here
const imgClient = new googleImages(cseKeys.id, cseKeys.key);

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
	for(var command of commands.commands.onMessage){
		console.log(command.parameters[0].text);
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

function isBlacklisted(user){
	for(var listed of blacklist.users){
		if(listed.id == user.id){
			console.log("blacklisted");
			return true;
		}
	}
	return false;
}

function writeJSON(obj, path){	//Careful! Keep production .jsons safe from untested write operations!
	var text = JSON.stringify(obj, null, 4);
	if(text != null){
		fs.writeFileSync(path, text);
	}
}

function setStatus(game, status){
	client.user.setPresence({
		game: {
			name: game
		},
		status: status
	});
}

function isCmd(str, index, cmd){	//Checks if a string contains a prefixed command
	return getArg(str, index) == (bozoid.cmdPref + cmd);
}

function getArg(str, index){	//Returns the string of an argument at an index
	var tmpStr = str;
	for(var i = 0; i < index; i++){
		while(!tmpStr.startsWith(" ")){
			tmpStr = tmpStr.substring(1);

			if(tmpStr.length <= 1){
				return null;
			}
		}
		tmpStr = tmpStr.substring(1);
	}
	var EOA = tmpStr.indexOf(" ");	//End of argument index
	if(EOA >= 0){
		var oStr = tmpStr.substring(0, EOA);	//Excludes next space if index is -1
		if(oStr.length > 0) return oStr;
		return null;
	} else{	//if there are no spaces in the string
		var oStr = tmpStr.substring(0, tmpStr.length);
		if(oStr.length > 0) return oStr;
		return null;
	}

}

function getArgs(str, index){	//Returns the rest of a string after an argument index
	var tmpIndex = index;
	var oStr = "";
	var gotArg = getArg(str, tmpIndex);
	while(gotArg != null){
		oStr += " " + gotArg;
		tmpIndex++;
		gotArg = getArg(str, tmpIndex);
	}
	oStr = oStr.substring(1);	//Because I added a lazy space
	if(oStr.length > 0) return oStr;
	return null
}

String.prototype.toHHMMSS = function () {	//SO blackmagic
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

function isMaster(msg){
	if((msg.author.username == bozoid.master.username && msg.author.discriminator == bozoid.master.discriminator) || msg.author.id == bozoid.master.id){
		return true;
	}
	return false;
}
