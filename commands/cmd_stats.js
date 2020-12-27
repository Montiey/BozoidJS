const parser = require('freestyle-parser');
const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.command = 'stats';
exports.description = 'list database and usage stats';

exports.script = function(cmd, msg){
	stat_blacklist = fileIO.read('blacklist.json').list.length
	stat_frickjar = fileIO.read('frickjar.json').list.length
	stat_fricks = fileIO.read('fricks.json').list.length
	stat_responder = fileIO.read('responder.json').list.length
	stat_voicemonitor = fileIO.read('voicemonitor.json').list.length
	stat_vocabulary = fileIO.read('vocabulary.json').list.length


	let numGuilds = 0
	let numChannels = 0
	let numUsers = 0


	msg.client.guilds.cache.each(g => {
		numGuilds++
		numChannels += g.channels.cache.size
		numUsers += g.memberCount
	}).tap(() => {
		bozAge = (new Date().getTime()) - (new Date('2018-01-25')).getTime()

		oStr = ''

		oStr += 'Age: ' + '`' + Math.floor(bozAge / (1000*60*60*24)) + '` days\n'
		oStr += 'Guilds: `' + numGuilds + '`\n'
		oStr += 'Channels: `' + numChannels + '`\n'
		oStr += 'Users: `' + numUsers + '`\n'
		oStr += 'Users blacklisted: `' + stat_blacklist + '`\n'
		oStr += 'Users who swore: `' + stat_frickjar + '`\n'
		oStr += 'Known swears: `' + stat_fricks + '`\n'
		oStr += 'Known vocabulary: `' + stat_vocabulary + '`\n'
		oStr += 'Snappy responses: `' + stat_responder + '`\n'
		oStr += 'Voice channel DM Subscribers: `' + stat_voicemonitor + '`\n'

		msg.channel.send(oStr)
	})
}
