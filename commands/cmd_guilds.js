const moment = require('moment')


exports.eventGroup = 'onMessage'
exports.command = 'guilds'
exports.description = 'Show joined guilds'
exports.masterOnly = true
exports.allowBot = false

exports.script = function(cmd, msg){
	oStr = 'Current guilds (' + msg.client.guilds.cache.size + '):\n```'

	msg.client.guilds.cache.each(guild => {
		let owner = guild.member(guild.ownerID).user
		let joinDate = (new moment(guild.joinedAt)).format('YYYY-MM-DD')

		//oStr += 'x' + guild.memberCount + ' ' + guild.id + ' ' + guild.name + ' - ' + owner.username + '#' + owner.discriminator + ' at ' + joinDate + '\n'
		oStr += joinDate + ' x' + guild.memberCount + ' ' + guild.name + ' - ' + owner.username + '#' + owner.discriminator + '\n'
	}).tap(() => {
		oStr += '```'
		msg.channel.send(oStr)
	})
}
