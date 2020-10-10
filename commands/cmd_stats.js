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


	let numGuilds = msg.client.guilds.size
	let numChannels = msg.client.channels.size

	bozAge = (new Date().getTime()) - (new Date('2018-01-25')).getTime()

	oStr = ''

	oStr += 'Age: ' + '`' + Math.floor(bozAge / (1000*60*60*24)) + '` days\n'
	oStr += 'Servers currently joined: `' + numGuilds + '`\n'
	oStr += 'Channels currently monitored: `' + numChannels + '`\n'
	oStr += 'Total users blacklisted: `' + stat_blacklist + '`\n'
	oStr += 'Total users caught swearing: `' + stat_frickjar + '`\n'
	oStr += 'Known swears: `' + stat_fricks + '`\n'
	oStr += 'Known vocabulary: `' + stat_vocabulary + '`\n'
	oStr += 'Snappy responses: `' + stat_responder + '`\n'
	oStr += 'Total users receiving VC notifications: `' + stat_voicemonitor + '`\n'

	msg.channel.send(oStr)
}
