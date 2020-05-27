const fs = require('fs');

const fileIO = require("bozoid-file-grabber");
const bozoid = fileIO.read("bozoid.json");

const googleImages = require("google-images");						////// Comment out if not using the search engine
const imgClient = new googleImages(bozoid.CSEID, bozoid.CSEKey);			////// Comment out if not using the search engine

const commands = require("bozoid-commands");
const parser = require("discord-command-parser");
const zalgo = require("to-zalgo");
const numberConverter = require("number-to-words");

const curl = require("curlrequest");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

exports.list = {
	onMessage: [
		// {	//A command object, represents one action by the user
		// 	description: "Sample",	//Human-readable name
		// 	command: "sample",	//command name (i.e. '$sample' to trigger)
		//	allowBot: false,	//Whether or not to allow bots to trigger this
		//	allowBlacklisted: false,	//Whether or not to allow blacklisted users to trigger this
		//	masterOnly: false,	//If true, only the master defined in 'bozoid.json' may trigger this
		//	noHelp: false,	//If true, no entry in the 'help' command will appear.
		// 	arguments: [	//List of arguments following the command to check
		// 		{
		// 			input: true,	//A parameter which's contents can be anything
		// 			description: "user input here"	//Human readable
		// 		},
		// 		{
		// 			keyword: "potato",	//A parameter which's contents MUST be matched for the script to run!
		// 			description: "user flag here"
		// 		}
		// 	],
		// 	script: function(cmd, msg){	//The script to run. 'cmd', its own command object, and 'msg', the Discord message that triggered it.
		// 		var parsed = parser.parse(msg, bozoid.cmdPref);	//Parse the message (with our prefix)
		//
		// 		msg.channel.send("You said " + parsed.arguments[0]
		//+ ", and the 2nd argument must have been potato if you're reading this.");	//Do stuff
		// 	}
		// },
		{	//The root of a command object
			description: "Ping",	//Common display name
			allowBot: false,	//Whether to respond on messages from bots (including self)
			allowBlacklisted: false,	//Whether to let blacklisted users use this command (default)
			command: "ping",
			script: function(commandObject, userMessage){	//This command object is sent to its own script property as a parameter
				userMessage.channel.send("Pong!");
			}
		},
		{
			description: "Say",
			command: "say",
			parameters: [
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				msg.delete(0);
				var parsed = parser.parse(msg, bozoid.cmdPref);
				msg.channel.send(parsed.arguments[0]);
			}
		},
		{
			description: "Spammer",
			command: "spam",
			parameters: [
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

				var maxSpams = 5;

				var parsed = parser.parse(msg, bozoid.cmdPref);

				var num = Math.min(parseInt(parsed.arguments[0]), maxSpams);

				for(var i = 0; i < num; i++){
					msg.channel.send(parsed.arguments[1]);
				}
			}
		},
		{
			description: "Zalgo Generator",
			allowBot: true,
			command: "zalgo",
			parameters: [
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				msg.delete(0);
				var parsed = parser.parse(msg, bozoid.cmdPref);
				msg.channel.send(zalgo(parsed.arguments[0]));
			}
		},
		{
			description: "Big Letters",
			allowBot: true,
			command: "emote",
			parameters: [
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				msg.delete(0);
				var parsed = parser.parse(msg, bozoid.cmdPref);
				var str = parsed.arguments[0].toLowerCase().match(/[a-z0-9]/g).join("");

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
			description: "Add Vocabulary",
			masterOnly: true,
			command: "addvocab",
			parameters: [
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				var parsed = parser.parse(msg, bozoid.cmdPref);
				var phrase = parsed.arguments[0];

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
			description: "Remove Vocabulary",
			masterOnly: true,
			command: "delvocab",
			parameters: [
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				var parsed = parser.parse(msg, bozoid.cmdPref);
				var phrase = parsed.arguments[0];
				var index = 0;

				fileIO.update("vocabulary.json", function(obj){
					for(var value of obj.list){
						if(value == phrase){
							obj.list.splice(index, 1);
							msg.channel.send("Removed: " + phrase);
							return;
						}
						index++;
					}
					msg.channel.send("Couldn't remove: " + phrase);
				});
			}
		},
		{
			description: "Image search",
			command: "img",
			parameters: [
				{
					input: true,
					description: "search query"
				}
			],
			script: function(cmd, msg){
				console.log("Image search");
				msg.channel.startTyping();
				var parsed = parser.parse(msg, bozoid.cmdPref);
				imgClient.search(parsed.arguments[0]).then(images => {
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
			description: "Restart",
			masterOnly: true,
			command: "restart",
			script: function(cmd, msg){
				msg.client.user.setStatus("invisible").then(console.log).catch(console.error);
				msg.channel.send("Restarting...").then(function(){
					process.exit(0);
				});
			}
		},
		{
			description: "Help",
			command: "help",
			script: function(cmd, msg){
				//var oStr = "Built with Discord.js\nhttps://github.com/Montiey/BozoidJS\n";
				let oStr = "";
				for(var command of commands.list.onMessage){
					if(command.noHelp || command.masterOnly) continue;
					var cmdStr = "";

					cmdStr += "`" + bozoid.cmdPref + command.command;

					if(command.parameters){
						cmdStr += " ";
						for(var p of command.parameters){
							if(p.input){
								cmdStr += "\"" + p.description + "\" ";
							} else{
								cmdStr += p.keyword + " ";
							}
						}
					}

					cmdStr += "` " + command.description + "\n";
					oStr += cmdStr;
				}
				oStr += "https://github.com/Montiey/BozoidJS\n";

				if(oStr.length > 0){
					msg.channel.send(oStr);
				}
			}
		},
		{	//No parameters, script runs reguardless of message content
			description: "Name responder",
			noHelp: true,	//Don't show in the help command
			script: function(cmd, msg){
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
			description: "Add a user to blacklist",
			masterOnly: true,
			command: "blacklist",
			parameters: [
				{
					input: true,
					description: "@mention"
				},
				{
					input: true,
					description: "reason"
				}
			],
			script: function(cmd, msg){
				var parsed = parser.parse(msg, bozoid.cmdPref);
				var reason = parsed.arguments[1];
				var byUser = msg.author;
				var parsed = parser.parse(msg, bozoid.cmdPref);
				msg.client.fetchUser(/[0-9]+/.exec(parsed.arguments[0])[0]).then(function(listedUser){
					if(listedUser.id == msg.author.id){
						msg.channel.send("You can't blacklist yourself, dummy");
						return;
					}

					var exists = false;

					fileIO.update("blacklist.json", function(json){
						for(var alreadyListed of json.list){
							if(alreadyListed.id == listedUser.id){
								exists = true;
								continue;
							}
						}
						if(!exists) json.list.push({
							referenceName: listedUser.username + "#" + listedUser.discriminator,	//Purpose unknown
							id: listedUser.id,
							reason: reason,
							by: byUser.id
						});
					});
					if(!exists){
						msg.channel.send("`" + byUser.username + "#" + byUser.discriminator + "` blacklisted `"
						+ listedUser.username + "#" + listedUser.discriminator + "` for `" + reason + "`");
					} else{
						msg.channel.send("`" + listedUser.username + "#" + listedUser.discriminator + "` is already blacklisted.");
					}
				});
			}
		},
		{
			description: "Remove users from the blacklist",
			masterOnly: true,
			command: "unblacklist",
			parameters: [
				{
					input: true,
					description: "@mention"
				}
			],
			script: function(cmd, msg){
				var parsed = parser.parse(msg, bozoid.cmdPref);
				msg.client.fetchUser(/[0-9]+/.exec(parsed.arguments[0])[0]).then(function(listedUser){
					var exists = false;

					fileIO.update("blacklist.json", function(json){
						for(var i = 0; i < json.list.length; i++){
							if(json.list[i].id == listedUser.id){
								exists = true;
								json.list.splice(i, 1);
							}
						}
					});

					if(exists){
						msg.channel.send("Removed `" + listedUser.username + "#" + listedUser.discriminator + "` from the blacklist file");
					} else{
						msg.channel.send("`" + listedUser.username + "#" + listedUser.discriminator + "` isn't in the blacklist file");
					}
				});
			}
		},
		{
			description: "List people on the blacklist",
			masterOnly: true,
			command: "listblacklist",
			script: function(cmd, msg){
				var oStr = "";
				var anyInGuild = false;
				var list = fileIO.read("blacklist.json").list;

				msg.channel.send("Blacklisted users: ");
				for(var listed of list){
					var targetMember = msg.guild.member(listed.id);

					if(targetMember == null) continue;
					anyInGuild = true;	//Else
					var tempNew = "`" + targetMember.user.username + "#" + targetMember.user.discriminator + "` for `" + listed.reason + "`\n";

					if((oStr + tempNew).length > 2000){	//Fire off a message if we're exceeding 2000 characters
						msg.channel.send(oStr);
						oStr = tempNew;
					} else{
						oStr += tempNew;
					}
				}

				if(oStr.length > 0 && anyInGuild){
					msg.channel.send(oStr);
				}
				else msg.channel.send("No users on this guild have been blacklisted");
			}
		},
		{
			description: "Add on-the-fly response",
			masterOnly: true,
			command: "trigger",
			parameters: [
				{
					input: true,
					description: "on"
				},
				{
					input: true,
					description: "then"
				}
			],
			script: function(cmd, msg){
				console.log("Running responder add");
				var parsed = parser.parse(msg, bozoid.cmdPref);

				fileIO.update("responder.json", function(json){
					var proceed = true;
					var newTrigger = parsed.arguments[0].toLowerCase();;
					var newResponse = parsed.arguments[1];

					for(var obj of json.list){
						if(newTrigger == obj.trigger){
							proceed = false;
							break;
						}
					}

					if(msg.author.id != bozoid.master.id){
						proceed = false;
					}

					if(proceed){
						msg.channel.send("Added.");
						json.list.push({
							trigger: newTrigger,
							response: newResponse
						});
					}
				});
			}
		},
		{
			description: "Respond to the above",
			noHelp: true,
			script: function(cmd, msg){
				var json = fileIO.read("responder.json");

				if(json.list)
				for(var set of json.list){
					if(msg.content.toLowerCase().includes(set.trigger)){	//Trigger is lowercase already
						msg.channel.send(set.response);

						break;
					}
				}
			}
		},
		{
			description: "Remove a response set",
			masterOnly: true,
			command: "untrigger",
			arguments: [
				{
					input: true,
					description: "trigger to remove"
				}
			],
			script: function(cmd, msg){
				fileIO.update("responder.json", function(json){
					var parsed = parser.parse(msg, bozoid.cmdPref);

					if(json.list)
					for(var set of json.list){
						if(set.trigger == parsed.arguments[0]){
							json.list.splice(json.list.indexOf(set), 1);

							msg.channel.send("Removed.");
							break;
						}
					}
				});
			}
		},
		{
			description: "Be notified of voice channel activity",
			masterOnly: false,
			command: "voicemon",
			parameters: [
			],
			script: function(cmd, msg){

				fileIO.update("voicemonitor.json", function(obj){
					var exists = false;
					var entry = null;
					for(var listed of obj.list){
						if(listed.id == msg.author.id){
							exists = true;
							entry = listed;
							break;
						}
					}

					if(!exists){
						entry = {
							referenceName: msg.author.username + "#" + msg.author.discriminator,
							id: msg.author.id,
							notificationsEnabled: true,
							lastCheckTime: 0
						}
						obj.list.push(entry);
						console.log("Created new entry for " + msg.author.id);
					} else{
						lastState = entry.notificationsEnabled;
						newState = !lastState;
						entry.notificationsEnabled = newState;

						console.log("Changed notification state for " + msg.author.id + " " + lastState + " -> " + newState);
					}

					msg.channel.send("Voicechat activity notifications " + (entry.notificationsEnabled ? "`enabled`" : "`disabled`") + " for `" + entry.referenceName + "`");
				});
			}
		},
		{
			description: "frick jar",
			allowBot: false,
			allowBlacklisted: true,
			noHelp: true,
			script: function(cmd, msg){
				fricks = fileIO.read("fricks.json")["list"];
				let justAdded = null;
				for(let frick of fricks){
					if(msg.content.toLowerCase().includes(frick)){
						console.log("Frick!");	
						fileIO.update("frickjar.json", function(json){
							for(var listedUser of json.list){
								if(listedUser.id == msg.author.id){
									console.log("User already listed");
									justAdded = listedUser;
									listedUser.total = (listedUser.total != undefined ? listedUser.total : 0) + 1;	//Add 1 to existing value or initialize it
									return;
								}
							}
							console.log("User not already listed");
							justAdded = {
								"id":msg.author.id,
								"referenceName":msg.author.username + "#" + msg.author.discriminator,
								"total":1
							}
							json.list.push(justAdded)
						});
						if(justAdded.total % 5 == 0) msg.channel.send("You said: `" + frick + "`!\nFrick Jar™ total for `" + justAdded.referenceName + "`: `$" + justAdded.total + "`");
						break;
					}
				}
			}
		},
		{
			description: "add phrase to frick jar",
			allowBot: false,
			command: "addswear",
			masterOnly: true,
			parameters:[
				{
					input: true,
					description: "phrase"
				}
			],
			script: function(cmd, msg){
				let parsed = parser.parse(msg, bozoid.cmdPref);
				console.log("Received frick phrase " + parsed.arguments[0]);
				fileIO.update("fricks.json", function(json){
					json.list.push(parsed.arguments[0]);
					msg.channel.send("Added to list: `" + parsed.arguments[0] + "`");
				});
			}
		},
		{
			description: "Display your fricks",
			allowBot: false,
			command: "jar",
			script: function(cmd, msg){
				let json = fileIO.read("frickjar.json");
				let thisEntry;
				for(let entry of json.list){
					if(entry.id == msg.author.id){
						thisEntry = entry;
						break;
					}
				}
				let numFricks = (thisEntry != undefined ? thisEntry.total : 0);
				msg.channel.send("Frick Jar™ total for `" + msg.author.username + "#" + msg.author.discriminator + "`: `$" + numFricks + "`");
			}
		},
		{
			description: "Log message statistics",
			noHelp: true,
			allowBot: true,
			script: function(cmd, msg){
				let now = (new Date()).getTime();
				let userID = msg.author.id;
				let userCommonName = msg.author.username = "#" + msg.author.discriminator;
				fileIO.update("messagemonitor.json", function(obj){
					if(obj[userID] == undefined){
						obj[userID] = {
							"list":[]
						}
					}
					
					obj[userID].list.push({
						"time":now,
						"contents":msg.content,
						"guild":msg.guild != undefined ? msg.guild.id : null	//Message may not be in a guild
					});
				});
			}
		}
	],
	onVoiceStateUpdate: [
		{
			script: function(cmd, oldMember, newMember){	//Voice channel activity tracker and notifier
				let minPeople = 2;
				let timeInterval = 45*60*1000;
				let deleteDelay = 30*60*1000;
				//let timeInterval = 0;
				if(oldMember.voiceChannel != undefined || newMember.voiceChannel == undefined || newMember.voiceChannel.members.size < minPeople){
					//console.log("Voice channel not suitable, or doesn't exist") //Something went wrong
					return;
				}

				let now = (new Date).getTime();

				fileIO.update("voicemonitor.json", function(obj){
					for(let receivingMember of obj.list){
						let guildMember = newMember.voiceChannel.guild.members.get(receivingMember.id);
						if(!guildMember) continue;	//The user in the entry list is not in this guild. Abort.
						

						let valid = true;
						for(let [joinedMemberID, joinedMember] of newMember.voiceChannel.members){
							//console.log("In: " + joinedMemberID);
							if(joinedMemberID == receivingMember.id){
								//console.log("Not sending to: " + receivingMember.id);
								valid = false;
								break;
							}
						}
							

						if(
							valid &&
							receivingMember.notificationsEnabled &&
							now - receivingMember.lastCheckTime >= timeInterval
						){
							//console.log("True? " + valid);
							var numPeople = newMember.voiceChannel.members.size;
							guildMember.user.send(numPeople + " user(s) in " + newMember.voiceChannel.guild.name + " - " + newMember.voiceChannel.name + "!").then(msg => msg.delete(deleteDelay));
							//console.log("Sent ping to: " + guildMember.user.username + "#" + guildMember.user.discriminator);
							receivingMember.lastCheckTime = now;
						} else{
							//console.log("not: " + receivingMember.id);
						}
					}
				});
			}
		}
	],
	onPresenceUpdate: [
		{
			script: function(cmd, oldMember, newMember){	//User status tracker
				let oldStatus = oldMember.presence.status;
				let newStatus = newMember.presence.status;
				
				if(oldStatus != newStatus){
					let thisID = newMember.id;
					let thisName = newMember.user.username + "#" + newMember.user.discriminator;	//TODO: Fix #1234#1234
					//console.log(newMember.user.username + "\n" + oldMember.user.username);
						
					fileIO.update("presencemonitor.json", function(obj){
						//console.log(newMember.user.username + "\n" + oldMember.user.username);
						
						if(obj[thisID] == undefined) obj[thisID] = {};
						let entry = obj[thisID];
						if(entry.list == undefined) entry.list = [];
						if(entry.names == undefined) entry.names = [];


						let now = (new Date).getTime();

						//If not a duplicate from multiple guilds
						if(entry.list.length == 0 || entry.list[entry.list.length-1].newStatus != newStatus){
							console.log(new Date().toISOString() + " (" + thisID + ")<" + thisName + "> " + oldStatus + " -> " + newStatus);
							entry.list.push({
								"time":now,
								"oldStatus":oldStatus,
								"newStatus":newStatus
							});
						} else{
							//console.log("Skipping duplicate");
						}
						
						if(entry.names.length == 0 || entry.names[entry.names.length-1] != thisName){
							entry.names.push(thisName);
						} else{
							//console.log("Skipping duplicate name");
						}

						//if(newMember.user.username == ("#" + newMember.user.discriminator)){
							//console.log("NAME ERROR\n" + newMember.user.username + "\n" +
						//		oldMember.user.username + "\n" + 
						//		newMember.user.discriminator + "\n" + 
						//		oldMember.user.discriminator);
						//}
					});
				} else{
					//console.log("Other presence status change");
				}
			}
		}
	]
};
