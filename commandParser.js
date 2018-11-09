const parser = require("./commandParser.js");

exports.isMaster = function(msg){
	if((msg.author.username == bozoid.master.username && msg.author.discriminator == bozoid.master.discriminator) || msg.author.id == bozoid.master.id){
		return true;
	}
	return false;
}

exports.isBlacklisted = function(user){
	for(var listed of blacklist.users){
		if(listed.id == user.id){
			console.log("blacklisted");
			return true;
		}
	}
	return false;
}

exports.getArg = function(str, index){	//Returns the string of an argument at an index
	var tmpStr = str;
	for(var i = 0; i < index; i++){
		while(!tmpStr.startsWith(" ")){
			tmpStr = tmpStr.substring(1);

			if(tmpStr.length <= 1){
				return null;
			}
		}
		tmpStr = tmpStr.substring(1);
	}
	var EOA = tmpStr.indexOf(" ");	//End of argument index
	if(EOA >= 0){
		var oStr = tmpStr.substring(0, EOA);	//Excludes next space if index is -1
		if(oStr.length > 0) return oStr;
		return null;
	} else{	//if there are no spaces in the string
		var oStr = tmpStr.substring(0, tmpStr.length);
		if(oStr.length > 0) return oStr;
		return null;
	}
}

exports.getRest = function(str, index){	//Returns the rest of a string after an argument index
	var tmpIndex = index;
	var oStr = "";
	var gotArg = parser.getArg(str, tmpIndex);
	while(gotArg != null){
		oStr += " " + gotArg;
		tmpIndex++;
		gotArg = parser.getArg(str, tmpIndex);
	}
	oStr = oStr.substring(1);	//Because I added a lazy space
	if(oStr.length > 0) return oStr;
	return null
}

exports.getArgList = function(str){
	var list = [];
	var i;
	var toAdd;
	while(toAdd != null){
		toAdd = parser.getArg(str, i);
		if(toAdd != null){
			list.push(toAdd);
			i++;
		}
	}
	return list;
}
