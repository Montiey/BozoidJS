const parser = require("./commandParser.js");

exports.list = {
	"onMessage": [
		{
			"name": "Ping",	//Common name, not important
			"allowBot": false,	//Whether to respond on messages from bots (including self)
			"parameters": [	//Ordered list of space-delimited parameters from text
				{
					"input": false,
					"prefixed": true,
					"keyword": "ping"
				}
			],
			"script": function(command, parameters, message){	//The command (as written here) gets passed to the function (this one right here) once it's parsed (convenience)
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
			"script": function(command, parameters, message){
				message.channel.send(parser.getRest(message.content, 1));
			}
		}
	]
};
