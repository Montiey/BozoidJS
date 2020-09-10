exports.eventGroup = "onMessage";
exports.description = "Ping";
exports.allowBot = false;
exports.allowBlacklisted = false;
exports.command = "ping";
exports.script = function(cmd, msg){
	msg.channel.send("Pong!");
}
