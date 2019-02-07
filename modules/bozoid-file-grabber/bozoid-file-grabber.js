//This module serves files to other modules

const fs = require("fs");

exports.update = function(path, callback){
	path = __basedir + "/config/" + path;	//We want to look in config/files, not wherever this module is required from.
	var content;

	if(fs.existsSync(path)){
		content = JSON.parse(fs.readFileSync(path));
	} else{
		console.log("Update: File doesn't exist");
		return;
	}

	callback(content);
	fs.writeFileSync(path, JSON.stringify(content, null, 4));
}

exports.read = function(path){
	path = __basedir + "/config/" + path;
	
	if(fs.existsSync(path)){
		return JSON.parse(fs.readFileSync(path));
	} else{
		console.log("Read: File doesn't exist");
		return;
	}
}
