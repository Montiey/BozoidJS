const parser = require('freestyle-parser');

exports.eventGroup = 'onMessage';
exports.description = ':b:ig :regional_indicator_l:etters';
exports.allowBot = false;
exports.command = 'big';
exports.parameters = [
	{
		input: true,
		description: 'phrase'
	}
];

exports.script = function(cmd, msg){
	msg.delete(0);
	let str = parser.getFreestyle(msg.content, 0).toLowerCase().match(/[a-z0-9]/g).join("");

	let oStr = "";
	let tempNew = "";

	let words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	for(let i = 0; i < str.length; i++){
		if(tempNew.length <= 2000) oStr = tempNew;

		let char = str.charAt(i);

		if(char == "b"){
			tempNew = oStr + ":b:";
			continue;
		}
		if(!isNaN(char)){
			tempNew = oStr + ":" + words[parseInt(char)] + ":";
			continue;
		}
		if(isNaN(char)){
			tempNew = oStr + ":regional_indicator_" + char + ":";
			continue;
		}
	}
	if(tempNew.length <= 2000) oStr = tempNew;

	if(oStr != ""){
		msg.channel.send(oStr);
	}
}
