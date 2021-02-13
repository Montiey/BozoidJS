const fileIO = require('bozoid-file-grabber')

exports.eventGroup = 'onMessage'
exports.command = 'haiku'
exports.description = 'Write a nice poem'


function getValidPhrase(list){
	let valid = ''
	do{
		valid = list[Math.floor(Math.random()*list.length)]
	} while(valid.length > 30 || valid.indexOf('\n') > 0)
	return valid
}

exports.script = function(cmd, msg){
	let vocabList = fileIO.read('vocabulary.json').list

	let first = getValidPhrase(vocabList)

	let second = ''
	let third = ''

	do{
		second = getValidPhrase(vocabList)
	} while(second == first)

	do{
		third = getValidPhrase(vocabList)
	} while(third == second || third == first)

	console.log("Got phrases " + first + ',' + second + ',' + third)

	msg.channel.send(first + '\n' + second + '\n' + third)
	
}
