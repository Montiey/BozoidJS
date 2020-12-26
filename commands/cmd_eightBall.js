exports.eventGroup = 'onMessage'
exports.description = 'Magic 8-ball'
exports.command = '8ball'
exports.parameters = [
	{
		input:true,
		description:'question'
	}
]
exports.allowBot = false

const phrases = [
	'It is certain.',
	'It is decidedly so.',
	'Without a doubt.',
	'Yes - definitely.',
	'You may rely on it.',

	'As I see it, yes.',
	'Most likely.',
	'Outlook good.',
	'Yes.',
	'Signs point to yes.',

	'Reply hazy, try again.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',

	'Don\'t count on it.',
	'My reply is no.',
	'My sources say no.',
	'Outlook not so good.',
	'Very doubtful.'
]

exports.script = function(cmd, msg){
	oStr = phrases[Math.floor(Math.random() * phrases.length)]
	msg.channel.send(':8ball: *' + oStr + '*')
}
