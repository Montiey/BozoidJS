const fileIO = require('bozoid-file-grabber')

exports.eventGroup = "onSchedule";
exports.name = "Whisper"

//exports.interval = 1000*60*60*9
exports.interval = 1000*60*60*24
//exports.interval = 1000*60*1
//exports.interval = 1000*10
exports.timer = null

exports.script = function(client){
	console.log('Whispering...')

	users = []

	for(let g of client.guilds.cache.array()){
		for(let m of g.members.cache.array()){
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

	//console.log("Magic hat contains " + users.length + " users")

	index = Math.floor(Math.random() * users.length)

	//console.log("Pulling from " + index)
	
	////////
	chosen = users[index]

	//chosen = client.guilds.cache.find(g => g.name === "Testing123").members.cache.find(m => m.user.username === "Montiey").user	//Do everything normal, but always choose Yours Truly
	////////

	//console.log("Pulled " + chosen.id + " aka " + chosen.username + "#" + chosen.discriminator + " from the hat")

	vocabList = fileIO.read('vocabulary.json').list
	oStr = vocabList[Math.floor(Math.random() * vocabList.length)]

	/////
	fileIO.update('whisperlog.json', function(json){
		chosen.send(oStr)
		json.list.push((new Date()).toISOString() + " " + chosen.id + " " + chosen.username + "#" + chosen.discriminator + " " + oStr)
	})
	/////
}




//EOF
