const fileIO = require('bozoid-file-grabber');

exports.eventGroup = 'onMessage';
exports.description = 'Frick leaderboards';
exports.allowBot = false;
exports.command = 'jartop';

exports.script = function(cmd, msg){
	let json = fileIO.read("frickjar.json");

	let outArr = []
	let numTop = 10;

	outArr = [...json.list]

	for(let i=0; i<outArr.length; i++){	//Check who is in the guild
		let entry = outArr[i]
		let mem = msg.guild.member(entry.id)

		if(!mem){
			//console.log("Not in guild: " + entry.referenceName)
			//console.log(mem)
			outArr.splice(i, 1)
			//console.log(outArr.length)
			i--
		} else{
			//console.log("In guild: " + mem.user.username)
			entry.realName = mem.user.username + "#" + mem.user.discriminator
		}
	}

	outArr.sort((a, b) => a.total < b.total ? 1 : -1)
	outArr = outArr.slice(0, numTop)
	
	let text = "Frick Jar™ top balances:```";

	for(let entry of outArr){
		text += "$" + entry.total + " - " + entry.realName + "\n";
	}

	text += "```";

	msg.channel.send(text);

	/*let numWaiting = 0
	for(let entry of outArr){
		numWaiting++
		console.log("Waiting + " + numWaiting)

		msg.guild.members.fetch(entry.id).then(m => {
			numWaiting--
			console.log("Waiting - " + numWaiting)

			entry.realName = m.user.username + "#" + m.user.discriminator
			
		}).catch(e => {
			numWaiting--
			console.log("Waiting !- " + numWaiting)
			console.log("Couldn't find " + entry.id)
		}).finally(m => {
			if(numWaiting == 0){
				for(let outEntry of outArr){
					console.log(outEntry)
					text += "$" + outEntry.total + " - " + outEntry.realName + " aka " + outEntry.referenceName + "\n";
				}
	
				text += "```";

				msg.channel.send(text);


			}
		})
	}
	*/
};
