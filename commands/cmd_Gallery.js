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
const maxSize = 100*1000*1000

console.log("Gallery path is:" + path)

exports.script = function(cmd, msg){
	if(!msg.attachments.size) return


	fs.readdir(path, function(err, files){	//Remove files taking up space, oldest first
		let oldestPath = null
		let oldestTime = null

		let totalSize = 0

		while(1){
			files.forEach(file => {
				let thisPath = path + '/' + file
				let stats = fs.statSync(thisPath)
				if(!oldestTime || stats.birthtimeMs < oldestTime){
					oldestPath = thisPath
					oldestTime = stats.birthtimeMs
				}
				totalSize += stats.size
			})

			console.log('Total: ' + totalSize)
			
			if(totalSize > maxSize){
				console.log('Delete: ' + oldestPath)
				fs.unlinkSync(oldestPath)
			} else{
				break
			}
		}
	})

	msg.attachments.forEach(attachment => {
		let dateStamp = (new Date()).toISOString()
		
		let extension = attachment.url.split('.')
		extension = extension[extension.length-1]

		let filePath = path + '/' + dateStamp + '_' + msg.author.id + '.' + extension

		let attachmentFile = fs.createWriteStream(filePath)
		let req = https.get(attachment.url, function(res){
			res.pipe(attachmentFile)
		})
	})
};
