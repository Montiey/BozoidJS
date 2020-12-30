const fs = require('fs');

exports.moduleStore = {
	"onMessage":[],
	"onPresenceUpdate":[],
	"onVoiceStateUpdate":[],
	"onSchedule":[]
};

exports.disabledModuleStore = []

exports.numLoadedModules = 0
exports.numErroredModules = 0

exports.erroredModules = []

exports.enable = function(path){
	
}

exports.setState = function(path, state){
	if(state){
		for(let i=0; i<exports.disabledModuleStore.length; i++){
			if(path == exports.disabledModuleStore[i].path){
				let enabledModule = exports.disabledModuleStore.splice(i, 1)[0]
	
				exports.moduleStore[enabledModule.eventGroup].push(enabledModule)

				console.log('Pushed ' + enabledModule.path + ' back into service')
				
				return enabledModule
			}
		}
		
	} else{
		for(let moduleStoreChapter of Object.keys(exports.moduleStore)){
			for(let i=0; i<exports.moduleStore[moduleStoreChapter].length; i++){
				if(path == exports.moduleStore[moduleStoreChapter][i].path){

					let disabledModule = exports.moduleStore[moduleStoreChapter].splice(i, 1)[0]

					exports.disabledModuleStore.push(disabledModule)

					console.log('Removed ' + disabledModule.path + ' from service')

					return disabledModule
				}
			}
		}
	}

	console.log('Couldn\'t find a module to service')

	return null
}

exports.disable = function(path){
	
}

exports.enable = function(path){
	
}


exports.loadFrom = function(loadDir){
	let realDir = __basedir + '/' + loadDir;

	fs.readdirSync(realDir).filter(file => /^cmd_.*\.js$/.test(file)).forEach(function(file){
		try{
			let cmdModule = require(realDir + '/' + file);
			cmdModule.path = file
			exports.moduleStore[cmdModule.eventGroup].push(cmdModule);
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
