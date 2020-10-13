const fileIO = require('bozoid-file-grabber')

exports.eventGroup = "onSchedule";

exports.interval = 1000*60*60*4
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

	console.log("Pulling from " + index)
	
	////////
	chosen = users[index]

	//chosen = client.guilds.find(g => g.name === "Testing123").members.find(m => m.user.username === "Montiey").user
	////////

	console.log("Pulled " + chosen.id + " aka " + chosen.username + "#" + chosen.discriminator + " from the hat")

	vocabList = fileIO.read('vocabulary.json').list
	oStr = vocabList[Math.floor(Math.random() * vocabList.length)]

	console.log("[Whisper] Sending random message!")
	chosen.send(oStr)

	fileIO.update('whisperlog.json', function(json){
		json.list.push((new Date()).toISOString() + " " + chosen.username + "#" + chosen.discriminator + " " + oStr)
	})
}
