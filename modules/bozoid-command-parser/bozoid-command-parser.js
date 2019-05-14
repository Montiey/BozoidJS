const parser = require("bozoid-command-parser");
const fileIO = require("bozoid-file-grabber");
const bozoid = fileIO.read("bozoid.json");

function startsWithAny(str, chars){
	for(var i of chars){
		if(str.startsWith(i)){
			return true;
		}
	}
	return false;
}

function indexOfAny(str, chars){
	for(var i of chars){
		var index = str.indexOf(i);
		if(index){
			return index;
		}
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
	var separators = [	//Quotes, iOS quotes, 
		"\"",
		"“",
		"”"
	];

	for(var i = 0; i < index; i++){
		while(!startsWithAny(tmpStr, separators)){
			tmpStr = tmpStr.substring(1);

			if(tmpStr.length <= 1){
				console.log("No argument");
				return null;
			}
		}
		tmpStr = tmpStr.substring(1);
	}
	var EOA = indexOfAny(tmpStr, separators);	//End of argument index
	if(EOA >= 0){
		var oStr = tmpStr.substring(0, EOA);	//Excludes next space if index is -1
		if(oStr.length > 0){
			console.log("Got1: " + oStr);
			return oStr;
		}
		console.log("No argument 1");
		return null;
	} else{	//if there are no spaces in the string
		var oStr = tmpStr.substring(0, tmpStr.length);
		if(oStr.length > 0){
			console.log("Got2: " + oStr);
			return oStr;
		}
		console.log("No argument 2");
		return null;
	}
}

exports.getRest = function(str, index){	//Returns the rest of a string at an argument index getRest("a b c d e f", 2) -> "c d e f"
	var tmpIndex = index;
	var oStr = "";
	var gotArg = parser.getArg(str, tmpIndex);
	while(gotArg != null){
		oStr += gotArg;
		tmpIndex++;
		gotArg = parser.getArg(str, tmpIndex);
	}
	oStr = oStr.substring(1);	//Because I added a lazy space
	if(oStr.length > 0){
		console.log("Rest of: " + oStr);
		return oStr;
	}
	console.log("No rest of");
	return null;
}
