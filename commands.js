exports.list = {
	"onMessage": [
		{
			"parameters": [	//Ordered list (e.g. ""$parameter0 parameter1 parameter2")
				{
					"type": "command",
					"text": "ping",
					"caseSensitive": false
				}
			],
			"script": function(command, parameters, message){	//The command (as written here) gets passed to the function (also written here) once it's parsed
				message.channel.send("Pong!");
			}
		},
		{
			"context": "message",
			"parameters": [
				{
					"type": "command",
					"text": "say",
					"caseSensitive": false
				},
				{
					"type": "input"
				}
			],
			"script": function(command, parameters, message){
				message.channel.send("Someone said " + command.parameter);
				message.channel.send("Now i'll say the second parameter: " + parameters[1]);
				message.channel.send("Now i'll delete the message");
				message.delete(0);
			}
		}
	],
	"onNothing": {
		"Other stuff": "nothing"
	}
};
