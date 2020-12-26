const fs = require('fs');

exports.commandStore = {
	"onMessage":[],
	"onPresenceUpdate":[],
	"onVoiceStatusUpdate":[],
	"onSchedule":[]
};

exports.numLoadedModules = 0
exports.numErroredModules = 0

exports.erroredModules = []

exports.loadFrom = function(loadDir){
	let realDir = __basedir + '/' + loadDir;

	fs.readdirSync(realDir).filter(file => /^cmd_.*\.js$/.test(file)).forEach(function(file){
		try{
			let cmdModule = require(realDir + '/' + file);
			exports.commandStore[cmdModule.eventGroup].push(cmdModule);
			exports.numLoadedModules++
			//console.log("Loaded [" + cmdModule.eventGroup + "] " + file)
		} catch(e){
			console.log("!! Couldn't load " + file + "!!")
			console.log(e)
			exports.numErroredModules++
			exports.erroredModules.push(file)
		}
	});
}
