# BozoidJS

[INVITE LINK](https://discordapp.com/oauth2/authorize?client_id=406249641139634178&scope=bot&permissions=8)

Montiey's personal Discord slave

Notice: These are mostly just notes for when I forget about this project for a few months and then need to fix something. 

* Deployment on Ubuntu 16.04.5 LTS:
	* `$ sudo su`	Best to do everything as root (Except launching the bot, which should be done as a "safe", unpriveledged user)
	* `$ apt-get update`	Good idea to update package indexes before installing anything
	* `$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`	Run the script, adding the proper PPA repository to the index.	(10.x wasn't working... 8.x works just fine)
	* `$ apt-get install -y nodejs`	Install nodejs from the alternate repository; includes npm
	* `$ npm install -g pm2`	Install PM2, globally
	* `$ git clone https://www.github.com/Montiey/BozoidJS.git`	Get the bot
	* `$ cd BozoidJS`
	* `$ npm install`	Install everything listed in Bozoid's `package.json`
* JSON Setup
	* A few files in `./config` must exist in order for the bot to work. Copy the sample files, and remove `.sample` from the file name.
	* `bozoid.json`
		* `token`: The token of the bot user that Bozoid will log in as.
		* `CSEID` & `CSEKey`: The ID and key of the [Google Custom Search Engine](https://www.google.com/cse/) to use. Comment out the appropriate lines in `bozoid-commands.js` if left blank
		* `master`: The ID of the user to be respected as the owner of the bot- in charge of blacklisting, etc.
		* `names`: Aliases the bot should be recognized as
		* `game`: The status game
		* `cmdPref`: The prefix for all commands
* Launching
	* You *could* launch bozoid with `$ node bozoid.js`, but if the shell closes or the process crashes, the bot dies. So, instead daemonize it with that manager you installed: `$ pm2 start bozoid.js`.
	* See [PM2 Docs](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) for more commands, such as:
	* `$ pm2 list` to show all processes running under the current user, and get its ID
	* `$ pm2 logs <id> --lines <# of lines>` to show the live log feed.

* Utilities
	* `backupconfig.sh` copies the configuration folder to `BozoidJS_Backup/` with a timestamp. Recommended to add to crontab as root.
