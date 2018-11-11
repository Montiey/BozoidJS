# BozoidJS

[INVITE LINK](https://discordapp.com/oauth2/authorize?client_id=406249641139634178&scope=bot&permissions=8)

Montiey's personal Discord slave

* Deployment:
	* `$ sudo su`	Best to do everything as root
	* `$ apt-get update`	Good idea to update before installing anything
	* `$ apt install nodejs`
	* `$ apt install npm`
	* `$ npm install -g pm2`	Install PM2 globally
	* `$ git clone https://www.github.com/Montiey/BozoidJS.git`
	* `$ cd BozoidJS`
	* `$ npm install`
	* add `private/bozoid.json`
	```
	{
        "master": {
                "id": "xxxxxxxxxxxxxxxxxx"
        },
        "names": [
                "boz",
                "bozoid",
                "bozo",
                "daddy boz"
        ],
        "game": "thanoscar",
        "cmdPref": "$"
	}
	```
	* add `private/token.json`
	```
	{
		"token": "xxxxxxxxxxxxxxxxxx"
	}
	```
	* add `private/googleCSE.json`

	```
	{
		"id": "<id of the CSE image search engine to use>",
		"key": "<your CSE client key, to identify this bot/user>"
	}
	```
	* You *could* launch bozoid with `$ node bozoid.js`, but if the shell closes or the process crashes, the bot dies. So, daemonize it with a process manager: `$ pm2 start bozoid.js`.
	* See [PM2 Docs](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) for more commands, such as:
	* `$ pm2 list` to show all processes running (under the current user).
	* `$ pm2 logs <id>` to show the live log feed.
