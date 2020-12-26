const loader = require('bozoid-command-loader');
const parser = require('freestyle-parser');

const fileIO = require('bozoid-file-grabber');

const bozoid = fileIO.read('bozoid.json');

exports.eventGroup = 'onMessage';
exports.description = 'Show help';
exports.command = 'help';
exports.script = function(cmd, msg){
	let showAll = parser.getArg(msg.content, 0) === "all" ? true : false;
	let oStr = "";


	//msg.channel.send("**Important:** *BozoidJS is currently broken as of October 28th, 2020 due to an API update. Fix will be implemented slowly, or maybe never.*")

	for(var command of loader.commandStore.onMessage){
		if(command.noHelp || (command.masterOnly && !showAll)) continue;
		var cmdStr = "";

		cmdStr += "**`" + bozoid.cmdPref

		if(command.command){
			cmdStr += command.command
		} else{
			cmdStr += command.commands[0]
		}

		if(command.parameters){
			for(var p of command.parameters){
				if(p.input){
					cmdStr += ' ' + p.description;
				} else{
					cmdStr += ' ' + p.keyword;
				}
			}
		}

		cmdStr += "`** " + command.description;

		if(command.masterOnly) cmdStr += "*";

		cmdStr += '\n';
		oStr += cmdStr;
	}

	if(showAll) oStr += "* Master Only\n";
	//oStr += "https://github.com/Montiey/BozoidJS\n";

	if(oStr.length > 0){
		msg.channel.send(oStr);
	}
}
