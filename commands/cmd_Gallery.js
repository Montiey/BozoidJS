const fileIO = require('bozoid-file-grabber')
const bozoid = fileIO.read('bozoid.json')
const http = require('http')
const https = require('https')
const fs = require('fs')

exports.eventGroup = 'onMessage';
exports.description = 'Attachment gallery';
exports.allowBot = true;
exports.noHelp = true;


const path = __basedir + '/' + bozoid.galleryPath
const maxSize = 256*1000*1000	//Maximum size of gallery directory in bytes


function pruneGallery(){
	let galleryIsPruned = false

	fs.readdir(path, function(err, files){	//Remove files taking up space, oldest first
		let oldestPath = null
		let oldestTime = null

		let totalSize = 0
		let totalCount = 0

		files.forEach(file => {
			let thisPath = path + '/' + file
			let stats = fs.statSync(thisPath)
			if(!oldestTime || stats.birthtimeMs < oldestTime){
				oldestPath = thisPath
				oldestTime = stats.birthtimeMs
			}
			totalSize += stats.size
			totalCount ++
		})

		console.log('Pruning...')
		console.log('Total files:        ' + totalCount)
		console.log('Total size (bytes): ' + totalSize)
		
		if(totalSize > maxSize){
			console.log('Delete: ' + oldestPath)
			try{
				fs.unlinkSync(oldestPath)
			} catch(e){
				console.log("Couldn't delete: " + e)
			}
			pruneGallery()
		} else{
			//
		}
	})
}

exports.script = function(cmd, msg){
	if(!msg.attachments.size){
		//console.log("Attachment is null.")
		return
	}


	pruneGallery()

	msg.attachments.forEach(attachment => {
		let dateStamp = (new Date()).toISOString()
		
		let extension = attachment.url.split('.')
		extension = extension[extension.length-1]

		let friendlyName = (msg.author.username + '#' + msg.author.discriminator).replace(/[^\x00-\x7F]/g, "?")	
		let guildName = msg.guild.name
		let channelName = msg.channel.name

		let filePath = path + '/' + dateStamp + '(' + guildName + ')[' + channelName + ']&lt;' + friendlyName + '&gt;.' + extension

		let attachmentFile = fs.createWriteStream(filePath)
		let req = https.get(attachment.url, function(res){
			console.log('Writing ' + attachment.url)
			res.pipe(attachmentFile)
		})
	})
};
