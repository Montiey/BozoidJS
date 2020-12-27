const parser = require('freestyle-parser')

exports.eventGroup = 'onMessage'
exports.description = 'Fetch the profile picture of a user'
exports.command = 'pfp'
exports.parameters = [
	{
		input: true,
		description: '@mention or ID'
	}
]

exports.script = function(cmd, msg){
	let parsed = /[0-9]+/.exec(parser.getArg(msg.content, 0))

	if(!parsed){
		msg.channel.send('Not an @mention or user ID')
		return
	}

	let id = parsed[0]

	let member = msg.guild.member(id)

	if(!member){
		msg.channel.send('Couldn\'t find user')
		return
	}

	let url = member.user.displayAvatarURL({format:'png', dynamic:true, size:4096})

	msg.channel.send({
		files:[url]
	})
}
