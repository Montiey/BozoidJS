exports.eventGroup = 'onMessage';
exports.description = 'Restart Bozoid';
exports.masterOnly = true;
exports.command = 'restart';

exports.script = function(cmd, msg){
	msg.client.user.setStatus("invisible").then(function(){
		//msg.channel.send("Restarting...").then(function(){
		msg.react("👌").then(function(){
			process.exit(0);
		});
	});
};
