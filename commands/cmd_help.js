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

	for(var command of loader.commandStore.onMessage){
		if(command.noHelp || (command.masterOnly && !showAll)) continue;
		var cmdStr = "";

		cmdStr += "`" + bozoid.cmdPref + command.command;

		if(command.parameters){
			cmdStr += " ";
			for(var p of command.parameters){
				if(p.input){
					//cmdStr += "\"" + p.description + "\" ";
					cmdStr += p.description + ' ';
				} else{
					cmdStr += p.keyword + " ";
				}
			}
		}

		cmdStr += "` " + command.description;

		if(command.masterOnly) cmdStr += "*";

		cmdStr += '\n';
		oStr += cmdStr;
	}

	if(showAll) oStr += "* Master Only\n";
	oStr += "https://github.com/Montiey/BozoidJS\n";

	if(oStr.length > 0){
		msg.channel.send(oStr);
	}
}
