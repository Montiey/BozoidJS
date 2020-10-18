const fileIO = require('bozoid-file-grabber')

exports.eventGroup = "onSchedule";

exports.interval = 1000*60*60*10
//exports.interval = 1000*5
exports.timer = null

exports.script = function(client){
	users = []
	for(let g of client.guilds.array()){
		for(let m of g.members.array()){
			if(m.user.bot || m.user.id == client.user.id){
				//console.log('Ineligible ' + m.user.username)
				continue
			}

			let exists = false
			for(let userEntry of users){
				if(userEntry.id == m.user.id){
					exists = true
					//console.log('Duplicate for ' + m.user.username)
				}
			}
			if(exists) continue
			
			//

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

	chosen.send(oStr)

	fileIO.update('whisperlog.json', function(json){
		json.list.push((new Date()).toISOString() + " " + chosen.id + " " + chosen.username + "#" + chosen.discriminator + " " + oStr)
	})
}
