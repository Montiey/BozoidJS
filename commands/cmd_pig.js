const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = 'igpay atinlay';
exports.command = 'pig';



function isVowel(c){
	c = c.toLowerCase()
	for(let v of 'aeiou'){
		if(c == v) return true
	}
	return false
}

exports.script = function(cmd, msg){
	let oStr = ''

	for(word of parser.getArgs(msg.content)){	//Get each word separately, easier
		let vowelIndex = 0

		for(c of word){
			if(isVowel(c)) break
			vowelIndex++
		}

		a = word.substring(0, vowelIndex)
		b = word.substring(vowelIndex)
		
		oStr += b + a + 'ay '
	}

	msg.channel.send(oStr)
	msg.delete()
}
