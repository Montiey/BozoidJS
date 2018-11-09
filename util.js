const fs = require('fs');

exports.writeJSON = function(obj, path){	//Careful! Keep production .jsons safe from untested write operations!
	var text = JSON.stringify(obj, null, 4);
	if(text != null){
		fs.writeFileSync(path, text);
	}
}

exports.readJSON = function(path){
	return JSON.parse(fs.readFileSync(path));
}
