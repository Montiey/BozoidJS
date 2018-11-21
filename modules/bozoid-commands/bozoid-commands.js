const fs = require('fs');

const fileIO = require("bozoid-config-manager");
const googleImages = require("google-images");
const config = fileIO.read("bozoid.json");
const imgClient = new googleImages(config.CSEID, config.CSEKey);
const commands = require("bozoid-commands");
const parser = require("bozoid-command-parser");
const zalgo = require("to-zalgo");
const numberConverter = require("number-to-words");

exports.list = {
	onMessage: [
		{
			name: "Ping",	//Common name, not important
			allowBot: false,	//Whether to respond on messages from bots (including self)
			parameters: [
				{
					// input: false,	//Make true to check nothing and leave for the script to use
					prefixed: true,	//True if must start with the command prefix
					keyword: "ping"	//The keyword to check
				}
			],
			script: function(commandObject, userMessage){	//This command object is sent to its own script property as a parameter
				userMessage.channel.send("Pong!");
			}
		},
		{
			name: "Say",
			allowBot: false,
			parameters: [
				{
					prefixed: true,
					keyword: "say"
				},
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				msg.delete(0);
				msg.channel.send(parser.getRest(msg.content, 1));
			}
		},
		{
			name: "Spammer",
			allowBot: false,
			parameters: [
				{
					prefixed: true,
					keyword: "spam"
				},
				{
					input: true,
					description: "num"
				},
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				msg.delete(0);

				var maxSpams = 20;

				var num = Math.min(parser.getArg(msg.content, 1), maxSpams);

				for(var i = 0; i < num; i++){
					msg.channel.send(parser.getRest(msg.content, 2));
				}
			}
		},
		{
			name: "Zalgo Generator",
			allowBot: true,
			parameters: [
				{
					prefixed: true,
					keyword: "zalgo"
				},
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				msg.delete(0);
				msg.channel.send(zalgo(parser.getRest(msg.content, 1)));
			}
		},
		{
			name: "Big Letters (Broken on Mobile)",
			allowBot: true,
			parameters: [
				{
					prefixed: true,
					keyword: "emote"
				},
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				msg.delete(0);
				var str = parser.getRest(msg.content, 1).toLowerCase().match(/[a-z0-9]/g).join("");

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
			name: "Add Vocabulary",
			allowBot: false,
			masterOnly: true,
			parameters: [
				{
					prefixed: true,
					keyword: "add"
				},
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				var phrase = parser.getRest(msg.content, 1);

				fileIO.update("vocabulary.json", function(obj){
					if(obj.list.indexOf(phrase) == -1){
						obj.list.push(phrase);
						msg.channel.send("Added to vocabulary: " + phrase);
					} else{
						console.log("Phrase already exists");
					}
				});
			}
		},
		{
			name: "Remove Vocabulary",
			allowBot: false,
			masterOnly: true,
			parameters: [
				{
					prefixed: true,
					keyword: "remove"
				},
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				var phrase = parser.getRest(msg.content, 1);
				var index = 0;

				fileIO.update("vocabulary.json", function(obj){
					for(var value of obj.list){
						if(value == phrase){
							obj.list.splice(index, 1);
							msg.channel.send("Removed: " + phrase);
							break;
						}
						index++;
					}
				});
			}
		},
		{
			name: "Image search",
			allowBot: false,
			parameters: [
				{
					prefixed: true,
					keyword: "img"
				},
				{
					input: true,
					description: "search query"
				}
			],
			script: function(cmd, msg){
				console.log("Image search");
				msg.channel.startTyping();
				imgClient.search(parser.getRest(msg.content, 1)).then(images => {
					for(var test of images){
						if(/(\.(gif|jpg|jpeg|tiff|png)$)/.test(test.url)){
							msg.channel.send({
								file: test.url
							});
							break;
						}
					}
					msg.channel.stopTyping();
				});
			}
		},
		{
			name: "Restart",
			allowBot: false,
			parameters: [
				{
					prefixed: true,
					keyword: "restart"
				}
			],
			script: function(cmd, msg){
				msg.client.setStatus("idle");
				msg.channel.send("Restarting...").then(function(){
					process.exit(0);
				});
			}
		},
		{
			name: "Help",
			allowBot: false,
			parameters: [
				{
					prefixed: true,
					keyword: "help"
				}
			],
			script: function(cmd, msg){
				msg.channel.send("Built with Discord.js\nhttps://github.com/Montiey/BozoidJS");
				var oStr = "";
				for(var command of commands.list.onMessage){
					if(command.noHelp) continue;
					var cmdStr = "";
					cmdStr += command.name + ": `";
					for(var p of command.parameters){
						if(p.input){
							cmdStr += "[" + p.description + "] ";
						} else{
							if(p.prefixed) cmdStr += config.cmdPref;
							cmdStr += p.keyword + " ";
						}
					}

					cmdStr += "`\n";
					oStr += cmdStr;
				}

				if(oStr.length > 0){
					msg.channel.send(oStr);
				}
			}
		},
		{	//No parameters, script runs reguardless of message content
			name: "Go crazy",
			noHelp: true,	//Don't show in the help command
			allowBot: false,
			script: function(cmd, msg){
				if(msg.content.toLowerCase().includes("nou") || msg.content.toLowerCase().includes("no u")){
					msg.channel.send("no u");
				}

				if(msg.content.toLowerCase().includes("gay")){
					msg.channel.send("You have been diagnosed with: `the big gay`");
				}

				var vocab = fileIO.read("vocabulary.json").list;
				for(var aka of fileIO.read("bozoid.json").names){
					if(msg.content.toLowerCase().includes(aka.toLowerCase())){
						msg.channel.send(vocab[Math.floor(Math.random() * vocab.length)]);
						break;
					}
				}
			}
		},
		{
			name: "Housekeeping",
			noHelp: true,
			allowBot: true,
			script: function(cmd, msg){
				if(msg.content.startsWith(".r34")) msg.delete(0);
				if(msg.content.includes("`No results found on`") || msg.content.startsWith("`Score") || msg.content.includes("Cannot use again for another")) msg.delete(15000);
			}
		}
	]
};
