const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const zalgo = require("to-zalgo");
const numberConverter = require("number-to-words");
const configPath = "bozoid.json";
const tokenPath = "private/token.json";
const vocabularyPath = "private/vocabulary.json";
const blacklistPath = "private/blacklist.json";

var bozoid = JSON.parse(fs.readFileSync(configPath));
var token = JSON.parse(fs.readFileSync(tokenPath)).token;

var vocabulary;	//lists are held in runtime and written to disk as they're updated
try{
	vocabulary = JSON.parse(fs.readFileSync(vocabularyPath));
} catch(e){
	vocabulary = {
		list: [
			"oof"
		]
	};
}

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

client.on('ready', () => {
	setStatus(bozoid.game, "online");
	console.log("Ready: " + client.user.tag);
});

client.on('message', msg => {
	console.log((process.uptime() + "").toHHMMSS() + " (" + msg.member.guild + ")[" + msg.channel.name + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content); //First thing we do is output the message.
	
	//

	if(isCmd(msg.content, 0, "help")){
		msg.channel.send("https://www.github.com/Montiey/BozoidJS\nI'm BozoidJS, Bozoid.java's younger, slightly stuipider cousin.");
	}
	if((msg.content.toLowerCase().includes("nou") || msg.content.toLowerCase().includes("no u")) && !msg.author.bot){
		msg.channel.send("no u");
	}

	if(msg.content.toLowerCase().includes("gay") && !msg.author.bot){
		msg.channel.send("you have the big gay");
	}
	
	if(!msg.author.bot){
			for(var aka of bozoid.names){
				if(msg.content.toLowerCase().includes(aka.toLowerCase())){
					msg.channel.send(vocabulary.list[Math.floor(Math.random() * vocabulary.list.length)]);
					break;
				}
			}
		}
	
	////////

	if(!isBlacklisted(msg.author)){	//Commands here vvv
		
	   if(isCmd(msg.content, 0, "ping")){
			msg.channel.send("Pong! Uptime: `" + (process.uptime() + "").toHHMMSS() + "`");
	   }

		//

		if(isCmd(msg.content, 0, "spam") && getArg(msg.content, 1) != null && !msg.author.bot){
			msg.delete(0);
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

		if(isCmd(msg.content, 0, "emote") && getArg(msg.content, 1) != null && !msg.author.bot){
			msg.delete(0);
			var str = getArgs(msg.content, 1).toLowerCase().match(/[a-z0-9]/g).join("");

			var oStr = "";
			var tempNew = "";
			for(var i = 0; i < str.length; i++){
				if(tempNew.length <= 2000) oStr = tempNew;

				var char = str.charAt(i);

				if(char == "b"){
					tempNew = oStr + ":b:";
					continue;
				}
				if(!isNaN(char)){
					tempNew = oStr + ":" + numberConverter.toWords(parseInt(char)) + ":";
					continue;
				}
				if(isNaN(char)){
					tempNew = oStr + ":regional_indicator_" + char + ":";
					continue;
				}
			}
			if(tempNew.length <= 2000) oStr = tempNew;

			if(oStr != ""){
				msg.channel.send(oStr);
			}
		}

		//

		if(isCmd(msg.content, 0, "add") && !msg.author.bot && getArgs(msg.content, 1) != null && isMaster(msg)){
			var word = getArgs(msg.content, 1);

			if(vocabulary.list.indexOf(word) == -1){
				vocabulary.list.push(word);
				writeJSON(vocabulary, vocabularyPath);
				msg.channel.send("Added to vocabulary: " + word);
			} else{
				console.log("Phrase already exists");
			}
		}

		if(isCmd(msg.content, 0, "remove") && !msg.author.but && getArgs(msg.content, 1) != null && isMaster(msg)){
			var word = getArgs(msg.content, 1);
			var index = 0;
			for(var value of vocabulary.list){
				if(value == word){
					vocabulary.list.splice(index, 1);
					writeJSON(vocabulary, vocabularyPath);
					msg.channel.send("Removed: " + word);
					break;
				}
				index++;
			};
		}

		//
		if(msg.content.startsWith(".r")) msg.delete(0);
		if(msg.content.includes("`No results found on`") || msg.content.startsWith("`Scor")) msg.delete(30000);

		//

		if(isCmd(msg.content, 0, "restart") || isCmd(msg.content, 0, "reboot")){
			setStatus(bozoid.game, "offline");
			msg.channel.send("Restarting...");
			process.exit(0);
		}

		if(isCmd(msg.content, 0, "shutdown")){
			setStatus(bozoid.game, "offline");
			msg.channel.send("Shutting Down...");
			process.exit(6969420);
		}

		//

		if(isCmd(msg.content, 0, "blacklist") && getArgs(msg.content, 1) == null){
			var oStr = "";
			var anyInGuild = false;
			for(var listed of blacklist.users){
				var targetMember = msg.guild.member(listed.id);

				if(targetMember == null) continue;
				anyInGuild = true;
				var tempNew = "`" + targetMember.user.username + "#" + targetMember.user.discriminator + " (" + targetMember.user.id + ")`\n";

				if((oStr + tempNew).length > 2000){
					msg.channel.send(oStr);
					oStr = tempNew;
				} else{
					oStr += tempNew;
				}
			}

			if(oStr.length > 0 && anyInGuild){
				msg.channel.send("Blacklisted users: ");
				msg.channel.send(oStr);
			}
			else msg.channel.send("No users on this guild have been blacklisted");
		}

		if(isCmd(msg.content, 0, "blacklist") && getArgs(msg.content, 1) != null && isMaster(msg)){
			var targetMember = msg.guild.member(getArg(msg.content, 1).substr(2, 18));	//Discord snowflakes are 18 characters long

			console.log("id: " + targetMember.id + " of " + targetMember.user.username);

			if(targetMember != null){
				var id = targetMember.id;
				var by = msg.author.id;
				var reason = getArgs(msg.content, 2);

				var exists = false;
				for(var listed of blacklist.users){
					if(listed.id == id){
						exists = true;
					}
				}

				if(!exists){
					blacklist.users.push({
						id: id,
						by: by,
						reason: reason
					});

					writeJSON(blacklist, blacklistPath);

					msg.channel.send("`" + targetMember.user.username + "#" + targetMember.user.discriminator + "` may no longer use `" + bozoid.cmdPref + "` commands.\nReason: `" + reason + "`");
				} else{
					msg.channel.send("`" + targetMember.user.username + "` has already been blacklisted.");
				}
			}
		}

		if(isCmd(msg.content, 0, "unblacklist") && isMaster(msg)){
			var targetMember = msg.guild.member(getArg(msg.content, 1).substr(2, 18));	//Discord snowflakes are 18 characters long

			console.log("id: " + targetMember.id + " of " + targetMember.user.username);

			if(targetMember != null){
				var id = targetMember.id;

				for(var listed of blacklist.users){
					if(listed.id === id){
						blacklist.users.splice(blacklist.users.indexOf(listed), 1);
						msg.channel.send("`" + targetMember.user.username + "#" + targetMember.user.discriminator + "` was removed from the blacklist.");
					}
				}

				writeJSON(blacklist, blacklistPath);
			}
		}
	}
	
});

client.on('error', e => {
	console.log("discord.js client error:");
	console.log(e);
});

client.login(token);

////////////////

function isBlacklisted(user){
	for(var listed of blacklist.users){
		if(listed.id == user.id) return true;
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

//	TODO: getArgs(str, startIndex, stopIndex)	//Returns the string of the arguments between two argument indexes

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

function isMaster(msg){
	if((msg.author.username == bozoid.master.username && msg.author.discriminator == bozoid.master.discriminator) || msg.author.id == bozoid.master.id){
		return true;
	}
	return false;
}
