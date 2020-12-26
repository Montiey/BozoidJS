const moment = require('moment')
const mysql = require('mysql')
const fileIO = require('bozoid-file-grabber')
const bozoid = fileIO.read('bozoid.json')

let sqlConnection = mysql.createConnection({	//TODO: Where to put this?
	host: 'localhost',
	user: 'root',
	password: bozoid.databasePassword,
	database: bozoid.databaseName,
	acquireTimout: 5*60*1000
})

exports.eventGroup = 'onPresenceUpdate'
exports.script = function(cmd, oldPresence, newPresence){
	function convStatus(old){
		switch(old){
			case 'online': return 'onl'; break
			case 'idle': return 'idl'; break
			case 'dnd': return 'dnd'; break
			case 'offline': return 'ofl'; break
		}
	}

	let oldStatus = convStatus(oldPresence ? oldPresence.status : 'offline')	//TODO: Why is oldPresence null sometimes? Just assume comming from offline if so.
	let newStatus = convStatus(newPresence.status)
	
	if(oldStatus != newStatus){
		let thisID = newPresence.user.id
		let thisName = newPresence.user.username + "#" + newPresence.user.discriminator	//TODO: Fix #1234#1234
		thisName = thisName.replace(/[^\x00-\x7F]/g, "?")
		
		let now = (new Date).getTime()
		let arr = [thisID, newStatus, oldStatus, (new moment(now)).format('YYYY-MM-DD HH:mm:ss')]

		sqlConnection.query("INSERT INTO Presence(id, newStatus, oldStatus, time) VALUES(?, ?, ?, ?)", arr, function(e, r, f){
			if(e) throw e
		})

		sqlConnection.query("SELECT * FROM Names WHERE id=?", [thisID], function(e, r, f){
			if(e) throw e
			
			for(let entry of r){
				if(entry.name == thisName) return
			}

			console.log("Logging new name for " + thisID + " aka " + thisName)
		
			sqlConnection.query("INSERT INTO Names(id, name) VALUES(?, ?)", [thisID, thisName], function(e, r, f){	//Log every unique name for each ID.
				if(e) throw e
			})
		})

		//console.log(thisID + ' ' + oldStatus + ' > ' + newStatus + " aka " + thisName)
	} else{
		//console.log("Other presence status change")
	}
}
