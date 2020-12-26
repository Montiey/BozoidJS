const fileIO = require('bozoid-file-grabber');
const bozoid = fileIO.read('bozoid.json');
const googleImages = require("google-images");
const imgClient = new googleImages(bozoid.CSEID, bozoid.CSEKey);
const parser = require('freestyle-parser');


exports.eventGroup = 'onMessage';
exports.description = 'Google Images search';
exports.command = 'img';
exports.parameters = [
	{
		input: true,
		description: 'query'
	}
];

exports.script = function(cmd, msg){
	console.log("Image search...");

	msg.channel.startTyping();

	imgClient.search(parser.getFreestyle(msg.content, 0)).then(images => {
		let succ = false
		for(let test of images){
			if(/(\.(gif|jpg|jpeg|tiff|png)$)/.test(test.url)){
				msg.channel.send({
					files: [test.url]
				}).catch(e => console.log(e))
				succ = true
				break;
			}
		}
		if(!succ){
			msg.react("👎");
		}
		msg.channel.stopTyping();
		console.log("Image Search finished.")
	}).catch(err => {
		console.log("Image Search Error: " + err)

		msg.channel.send("Slow down");

		msg.channel.stopTyping();
	});
};
