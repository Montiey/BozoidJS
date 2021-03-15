const parser = require('freestyle-parser')
const fileIO = require('bozoid-file-grabber')

exports.eventGroup = 'onMessage'
exports.description = 'Recommend a movie'
exports.command = 'movie'

exports.script = function(cmd, msg){
	json = fileIO.update('movies.json', function(json){
		list = json.list
	
		text = list[Math.floor(Math.random() * list.length)]
		msg.channel.send('Random movie: `' + text + '`')
	})
}
