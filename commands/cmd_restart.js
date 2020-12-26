const fileIO = require('bozoid-file-grabber')
const loader = require('bozoid-command-loader')

exports.eventGroup = 'onMessage';
exports.description = 'Restart Bozoid';
exports.masterOnly = true;
exports.command = 'restart';

exports.script = function(cmd, msg){
	let now = (new Date()).getTime()

	msg.react('👌').then(() =>
		msg.client.user.setStatus('invisible')
	).then(() => {
		//console.log('Setting restart IDs...')
		fileIO.update('restartInfo.json', function(json){	//Prepare info on where to send boot info on restart
			json.triggerChannelID = msg.channel.id
			json.ManualRestartTime = now
			json.erroredModules = loader.erroredModules.length
			json.restartSuccessTag = false	//Allow the next boot to post data to the channel specified above
		})
	}).then(() => {
		process.exit(0)
	})
};
