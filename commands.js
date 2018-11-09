const parser = require("./commandParser.js");
const zalgo = require("to-zalgo");
const numberConverter = require("number-to-words");

const fs = require('fs');
const cseKeys = JSON.parse(fs.readFileSync("private/googleCSE.json"));
const googleImages = require("google-images");
const imgClient = new googleImages(cseKeys.id, cseKeys.key);

exports.list = {
	"onMessage": [
		{
			"name": "Ping",	//Common name, not important
			"allowBot": false,	//Whether to respond on messages from bots (including self)
			"parameters": [
				{
					"input": false,	//True to check nothing and leave for the script to use
					"prefixed": true,	//True if must start with the command prefix
					"keyword": "ping"	//The keyword to check
				}
			],
			"script": function(commandObject, userMessage){	//This command object is sent to its own script property as a parameter
				message.channel.send("Pong!");
			}
		},
		{
			"name": "Say",
			"allowBot": false,
			"parameters": [
				{
					"input": false,
					"prefixed": true,
					"keyword": "say"
				}
			],
			"script": function(cmd, msg){
				msg.channel.send(parser.getRest(msg.content, 1));
			}
		},
		{
			"name": "Spammer",
			"allowBot": false,
			"parameters": [
				{
					"input": false,
					"prefixed": true,
					"keyword": "spam"
				}
			],
			"script": function(cmd, msg){
				msg.delete(0);
				var limit = Math.min(parser.getArg(msg.content, 1), bozoid.spamLimit);

				for(var i = 0; i < limit; i++){
					msg.channel.send(getArg(msg.content, 2));
				}
			}
		},
		{
			"name": "Zalgo Generator",
			"allowBot": true,
			"parameters": [
				{
					"input": false,
					"prefixed": true,
					"keyword": "zalgo"
				}
			],
			"script": function(cmd, msg){
				msg.channel.send(zalgo(getRest(msg.content, 1)));
			}
		},
		{
			"name": "Big Letters (Broken on Mobile)",
			"allowBot": true,
			"parameters": [
				{
					"input": false,
					"prefixed": true,
					"keyword": "emote"
				}
			],
			"script": function(cmd, msg){
				msg.delete(0);
				var str = getRest(msg.content, 1).toLowerCase().match(/[a-z0-9]/g).join("");

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
		},
		{
			"name": "Add Vocabulary",	//Common name, not important
			"allowBot": false,	//Whether to respond on messages from bots (including self)
			"parameters": [
				{
					"input": false,	//True to check nothing and leave for the script to use
					"prefixed": true,	//True if must start with the command prefix
					"keyword": "add"	//The keyword to check
				}
			],
			"script": function(commandObject, userMessage){	//This command object is sent to its own script property as a parameter
				var phrase = parser.getArgs(msg.content, 1);

				var vocabulary = util.readJSON(util.vocabularyPath);

				if(vocabulary.list.indexOf(phrase) == -1){
					vocabulary.list.push(phrase);
					writeJSON(vocabulary, vocabularyPath);
					msg.channel.send("Added to vocabulary: " + phrase);
				} else{
					console.log("Phrase already exists");
				}
			}
		}
	]
};
