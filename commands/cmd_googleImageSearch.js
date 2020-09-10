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
		description: 'search query'
	}
];

exports.script = function(cmd, msg){
	console.log("Image search...");
	msg.channel.startTyping();
	imgClient.search(parser.getFreestyle(msg.content, 0)).then(images => {
		for(let test of images){
			if(/(\.(git|jpg|jpeg|tiff|png)$)/.test(test.url)){
				msg.channel.send({
					file: test.url
				});
				break;
			}
		}
		msg.channel.stopTyping();
	});
};
