const parser = require('freestyle-parser')


exports.eventGroup = "onMessage";
exports.description = "Delete Boz's messages";
exports.allowBot = false;
exports.allowBlacklisted = false;
exports.masterOnly = true
exports.command = "abort";

exports.parameters = [
	{
		input:true,
		description:'num'
	}
]

exports.script = function(cmd, msg){
	let numToDelete = parser.getArgs(msg.content)[0]
	if(!numToDelete) numToDelete = 1

	console.log('Deleting ' + numToDelete + ' Messages')

	let numDeleted = 0

	msg.channel.fetchMessages({
		limit: 100
	}).then(messages => {
		for(sentMsg of messages.array()){
			if(sentMsg.author.id === msg.client.user.id){	//Caution
				//console.log("Match for " + sentMsg.author.id)
				
				sentMsg.delete()	//Danger
				numDeleted++
			}

			if(numDeleted >= numToDelete){
				break
			}
		}

		msg.channel.send('Deleted `' + numToDelete + '` messages')
		msg.delete()
		console.log('Done')
	})
}
