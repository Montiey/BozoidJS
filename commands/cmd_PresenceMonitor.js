const moment = require('moment');
const mysql = require('mysql');
const fileIO = require('bozoid-file-grabber');
const bozoid = fileIO.read('bozoid.json');

let sqlConnection = mysql.createConnection({	//TODO: Where to put this?
	host: 'localhost',
	user: 'root',
	password: bozoid.databasePassword,
	database: bozoid.databaseName,
	acquireTimout: 5*60*1000
});

exports.eventGroup = 'onPresenceUpdate';
exports.script = function(cmd, oldMember, newMember){
	function convStatus(old){
		switch(old){
			case 'online': return 'onl'; break;
			case 'idle': return 'idl'; break;
			case 'dnd': return 'dnd'; break;
			case 'offline': return 'ofl'; break;
		}
	}

	let oldStatus = convStatus(oldMember.presence.status);
	let newStatus = convStatus(newMember.presence.status);
	
	if(oldStatus != newStatus){
		let thisID = newMember.id;
		let thisName = newMember.user.username + "#" + newMember.user.discriminator;	//TODO: Fix #1234#1234
		thisName = thisName.replace(/[^\x00-\x7F]/g, "?");

		
		let now = (new Date).getTime();
		let arr = [thisID, newStatus, oldStatus, (new moment(now)).format('YYYY-MM-DD HH:mm:ss')]

		sqlConnection.query("INSERT INTO Presence(id, newStatus, oldStatus, time) VALUES(?, ?, ?, ?)", arr, function(e, r, f){
			if(e) throw e;
		});


		sqlConnection.query("SELECT * FROM Names WHERE id=?", [thisID], function(e, r, f){
			if(e) throw e;
			
			let exists = false;
			for(let entry of r){
				if(entry.name == thisName){
					exists = true;
					break;
				}
			}

			if(exists) return;

			console.log("Logging new name for " +thisID + " " + thisName);
		
			sqlConnection.query("INSERT INTO Names(id, name) VALUES(?, ?)", [thisID, thisName], function(e, r, f){
				if(e) throw e;
			});
		});	

		console.log(thisID + ' ' + oldStatus + ' > ' + newStatus + " aka " + thisName);
	} else{
		//console.log("Other presence status change");
	}
};
