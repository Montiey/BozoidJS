const fileIO = require('bozoid-file-grabber')

exports.eventGroup = "onSchedule";

exports.interval = 1000*60*60*24
exports.timer = null

exports.script = function(client){
	users = []
	for(let g of client.guilds.array()){
		for(let m of g.members.array()){
			users.push(m.user)
		}
	}

	console.log("Magic hat contains " + users.length + " users")

	index = Math.floor(Math.random() * users.length)
	//index = 97

	console.log("Pulling from " + index)
	
	chosen = users[index]

	console.log("Pulled " + chosen.username + "#" + chosen.discriminator + " from the hat")

	//if(chosen.username === "Montiey"){	//Testing safeguard
		vocabList = fileIO.read('vocabulary.json').list
		oStr = vocabList[Math.floor(Math.random() * vocabList.length)]

		console.log("[Whisper] Sending random message!")
		chosen.send(oStr)
	//}
}
