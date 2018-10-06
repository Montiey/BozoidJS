const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const zalgo = require("to-zalgo");
const configPath = "bozoid.json";
const tokenPath = "private/token.json";
const vocabularyPath = "private/vocabulary.json";

var bozoid = JSON.parse(fs.readFileSync(configPath));
var token = JSON.parse(fs.readFileSync(tokenPath)).token;

var vocabulary;

try{
	vocabulary = JSON.parse(fs.readFileSync(vocabularyPath));
} catch(e){
	vocabulary = {
		"list": [
			"wow"
		]
	}
}

client.on('ready', () => {
	setStatus(bozoid.game, "online");
	console.log("Ready: " + client.user.tag);
});

client.on('message', msg => {
	console.log("(" + msg.member.guild + ")[" + msg.channel.name + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content); //First thing we do is output the message.
	
	//

	if(isCmd(msg.content, 0, "ping")){
		msg.channel.send("Pong! Uptime: `" + (process.uptime() + "").toHHMMSS() + "`");
	}

	//

	if(isCmd(msg.content, 0, "help")){
		msg.channel.send("https://www.github.com/Montiey/BozoidJS\nI'm BozoidJS, Bozoid.java's younger, slightly stuipider cousin.");
	}	
	
	//
	
	if(isCmd(msg.content, 0, "spam") && getArg(msg.content, 1) != null && !msg.author.bot){
		var limit = getArg(msg.content, 1);
		limit = Math.min(limit, bozoid.spamLimit);
		
		
		for(var i = 0; i < limit; i++){
			msg.channel.send(getArg(msg.content, 2));
		}
	}
	
	//
	
	if(isCmd(msg.content, 0, "say") && getArg(msg.content, 1) != null  &&  !msg.author.bot){
		msg.delete(0);
		msg.channel.send(getArgs(msg.content, 1));
	}
	
	if(isCmd(msg.content, 0, "zalgo") && getArg(msg.content, 1) != null  &&  !msg.author.bot){
		msg.delete(0);
		msg.channel.send(zalgo(getArgs(msg.content, 1)));
	}
	
	//
	
	if(!msg.author.bot){
		for(var aka of bozoid.names){
			if(msg.content.toLowerCase().includes(aka.toLowerCase())){
				msg.channel.send(vocabulary.list[Math.floor(Math.random() * vocabulary.list.length)]);
				break;
			}
		}
	}
	
	//
	
	if(isCmd(msg.content, 0, "add") && !msg.author.bot && getArgs(msg.content, 1) != null){
		var word = getArgs(msg.content, 1);

		if(vocabulary.list.indexOf(word) == -1){
			vocabulary.list.push(word);
			fs.writeFileSync(vocabularyPath, JSON.stringify(vocabulary, null, 4));
			msg.channel.send("Added to vocabulary: " + word);
		} else{
			console.log("Phrase already exists");
		}
	}
	if(isCmd(msg.content, 0, "remove") && !msg.author.but && getArgs(msg.content, 1) != null){
		var word = getArgs(msg.content, 1);
		var index = 0;
		for(var value of vocabulary.list){
			if(value == word){
				vocabulary.list.splice(index);
				msg.channel.send("Removed: " + word);
				break;
			}
			index++;
		};
	}

	//

	if((msg.content.includes("nou") || msg.content.includes("no u")) && !msg.author.bot){
		msg.channel.send("no u");
	}
	
	if(isCmd(msg.content, 0, "restart") || isCmd(msg.content, 0, "reboot")){
		setStatus(bozoid.game, "offline");
		msg.channel.send("Restarting...");
		process.exit(0);
	}
	
	if(isCmd(msg.content, 0, "shutdown")){
		setStatus(bozoid.game, "offline");
		msg.channel.send("Shutting Down...");
		process.exit(1);
	}
	
});

client.on('error', e => {
	console.log("discord.js client error:");
	console.log(e);
});

client.login(token);

////////////////

function setStatus(var game, var status){
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
		return tmpStr.substring(0, EOA);	//Excludes next space if index is -1
	} else{	//if there are no spaces in the string
		return tmpStr.substring(0, tmpStr.length);
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
	return oStr.substring(1);
}

//	TODO: getArgs(str, startIndex, stopIndex)	//Returns the string of the arguments between two argument indexes

function doStuff(){
	console.log("Stuff has been done");
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
