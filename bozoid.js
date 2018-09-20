const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
let bozoid = JSON.parse(fs.readFileSync('bozoid.json'));
let token = JSON.parse(fs.readFileSync('token.json')).token;
let vocabulary = JSON.parse(fs.readFileSync('vocabulary.json'));
client.on('ready', () => {
	client.user.setPresence({ game: { name: bozoid.game }, status: 'offline' });
	console.log("Ready: " + client.user.tag);
});

client.on('message', msg => {
	console.log("(" + msg.member.guild + ")[" + msg.channel.name + "]<" + msg.author.username + "#" + msg.author.discriminator + "> " + msg.content);
	
	//
	
	
	if(isCmd(msg.content, 0, "spam") && !msg.author.bot){
		for(var i = 0; i < getArg(msg.content, 1); i++){
			msg.channel.send(getArg(msg.content, 2));
		}
	}
	
	//
	
	if(isCmd(msg.content, 0, "say") && !msg.author.bot){
		msg.channel.send(getArgs(msg.content, 1));
	}
	
	//
	
	if(!msg.author.bot){
		for(var aka of bozoid.names){
			if(msg.content.includes(aka) || msg.content == aka){
				msg.channel.send(vocabulary.list[Math.floor(Math.random() * vocabulary.list.length)]);
				break;
			}
		}
	}
	
	//
	
	if(isCmd(msg.content, 0, "add") && !msg.author.bot && getArgs(msg.content, 1) != null){
		var word = getArgs(msg.content, 1);
		console.log("got: " + word);
		
		if(vocabulary.list.indexOf(word) == -1){
			vocabulary.list.push(word);
			fs.writeFileSync('vocabulary.json', JSON.stringify(vocabulary, null, 4));
			msg.channel.send("Added to vocabulary: " + word);
		} else{
			console.log("already");
		}
	}
	
});

client.login(token);

////////////////

function isCmd(str, index, cmd){
	return getArg(str, index) == (bozoid.cmdPref + cmd);
}

function getArg(str, index){
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

function getArgs(str, index){
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