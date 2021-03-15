const loader = require('bozoid-command-loader')

exports.eventGroup = 'onMessage'
exports.command = 'listmodules'
exports.description = 'List all modules & status'

function makeString(inStr, text){
	let addStr = '`' + text + '` '

	/*let split = inStr.split('\n')

	console.log(split[split.length-1].length)

	if(addStr.length + split[split.length-1].length > 60){
		inStr += '\n'
	}*/

	inStr += addStr
	return inStr
}

exports.script = function(cmd, msg){
	let erroredStr = ''
	let disabledStr = ''
	let enabledStr = ''

	let numErrored = 0
	let numDisabled = 0
	let numEnabled = 0

	for(let erroredModulePath of loader.erroredModules){
		//console.log('Errored: ' + erroredModulePath)
		erroredStr = makeString(erroredStr, erroredModulePath)
		numErrored++
	}

	for(let disabledModule of loader.disabledModuleStore){
		//console.log('Disabled: ' + disabledModule.path)
		disabledStr = makeString(disabledStr, disabledModule.path)
		numDisabled++
	}

	for(let moduleChapter of Object.keys(loader.moduleStore)){
		for(let enabledModule of loader.moduleStore[moduleChapter]){
			//console.log('Enabled: ' + enabledModule.path)
			enabledStr = makeString(enabledStr, enabledModule.path)
			numEnabled++
		}
	}
	
	let oStr = ''

	if(erroredStr){
		oStr += ':red_circle: ERRORED (' + numErrored +')\n' + erroredStr + '\n'
	}

	if(disabledStr){
		oStr += ':orange_circle: DISABLED (' + numDisabled +')\n' + disabledStr + '\n'
	}

	if(enabledStr){
		oStr += ':green_circle: ENABLED (' + numEnabled +')\n' + enabledStr
	}

	msg.channel.send(oStr)
}


//EOF
