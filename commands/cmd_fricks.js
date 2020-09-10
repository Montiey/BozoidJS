const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Display your fricks';
exports.command = 'jar';
exports.script = function(cmd, msg){
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
};
