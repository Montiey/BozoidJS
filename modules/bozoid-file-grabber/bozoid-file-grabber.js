//This module serves files to other modules

const fs = require("fs");
const maxTime = 500;

exports.update = function(path, callback){
	path = __basedir + "/config/" + path;	//We want to look in config/files, not wherever this module is required from.
	var content;

	let now = (new Date()).getTime();

	if(fs.existsSync(path)){
		content = JSON.parse(fs.readFileSync(path));
	} else{
		console.log("Update: File doesn't exist: " + path);
		return;
	}

	callback(content);
	fs.writeFileSync(path, JSON.stringify(content, null, 4));
	let time = ((new Date()).getTime() - now);
	if(time > maxTime) console.log("[grabber] written " + path + " in " + time);
}

exports.read = function(path){
	path = __basedir + "/config/" + path;

	let now = (new Date()).getTime();
	
	if(fs.existsSync(path)){
		let ret = JSON.parse(fs.readFileSync(path));
		let time = ((new Date()).getTime() - now);
		if(time > maxTime) console.log("[grabber] read " + path + " in " + time);
		return ret;
	} else{
		console.log("Read: File doesn't exist: " + path);
		return;
	}
}
