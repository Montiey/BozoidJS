const fs = require('fs');

exports.commandStore = {
"onMessage":[],
"onPresenceUpdate":[],
"onVoiceStatusUpdate":[]
};

exports.loadFrom = function(loadDir){
	let realDir = __basedir + '/' + loadDir;

	fs.readdirSync(realDir).filter(file => /^cmd_.*\.js$/.test(file)).forEach(function(file){
		//let command = file.substr(file.indexOf('cmd_') + 4, file.indexOf('.js'));
		console.log("Loading " + file + "...");
		let cmdModule = require(realDir + '/' + file);

		exports.commandStore[cmdModule.eventGroup].push(cmdModule);
	});
}
