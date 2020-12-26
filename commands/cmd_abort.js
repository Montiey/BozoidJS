const parser = require('freestyle-parser')

exports.eventGroup = "onMessage";
exports.description = "Delete Boz's messages";
exports.allowBot = false;
exports.allowBlacklisted = false;
exports.masterOnly = true
exports.command = "abort";

exports.parameters = [
	/*{
		input:true,
		description:'num'
	}*/	//TODO: optional argument for optional parameters?
]

exports.script = function(cmd, msg){
	let numToDelete = parseInt(parser.getArgs(msg.content)[0])
	
	if(!numToDelete) numToDelete = 1

	console.log('Aborting ' + numToDelete + ' Messages...')

	msg.channel.messages.fetch({
		limit: 100
	}).then(
		messages => messages.filter(msg => msg.author.id === msg.client.user.id).tap(candidateMessages => {
			console.log(candidateMessages.array().length + " candidate messages")
			for(msgToDelete of candidateMessages.first(numToDelete)){
				console.log("Deleting " + msgToDelete.id)
				msgToDelete.delete()
				msg.react("👌");
			}
		})
	)
}
