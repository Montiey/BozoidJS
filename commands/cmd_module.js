const parser = require('freestyle-parser')
const loader = require('bozoid-command-loader')

exports.eventGroup = 'onMessage'
exports.command = 'module'
exports.masterOnly = true
exports.parameters = [
	{
		input:true,
		description:'up / down'
	}
]

exports.script = function(cmd, msg){
	let action = parser.getArg(msg.content, 0).toLowerCase()

	if(action == 'enable'){
		action = true
	} else if(action == 'disable'){
		action = false
	} else{
		msg.channel.send('Invalid action')	//TODO: ever going to implement keyword parameters properly?
		return
	}

	let targetPath = parser.getFreestyle(msg.content, 1)

	//console.log('Servicing ' + targetPath + '...')

	let mod = loader.setState(targetPath, action)

	if(mod){
		//msg.channel.send('Successfully `' + (action ? 'enabled' : 'disabled') + '` `' + mod.path + '`')
		msg.channel.send('`' + mod.path + '` is now `' + (action ? 'enabled' : 'disabled') + '`')
	} else{
		msg.channel.send('Error servicing the module')
	}
}
