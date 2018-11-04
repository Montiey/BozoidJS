# BozoidJS

[INVITE LINK](https://discordapp.com/oauth2/authorize?client_id=406249641139634178&scope=bot&permissions=8)

Montiey's personal Discord slave

---

Deploying Bozoid - The general idea:
* bozoid.js is a Node.js app, so we can do `$ node bozoid.js`
* If it crashes or you close the shell, the bot stops. So, we use a process manager to daemonize it: `$ pm2 start bozoid.js`
* See [PM2 Docs](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) for more commands, such as:
* `$ PM2 list` to show all processes running (under the current user).
* `$ PM2 logs <id>` to show the live log feed.

---

For you to do:
* create the `private` directory
* add `private/token.json`

```
{
	"token": "xxxxxxxxxxxxxxxxxx"
}
```

* add `private/googleCSE.json` (optional, but image search won't work if you don't)

```
{
	"id": "<id of the CSE image search engine to use>",
	"key": "<your CSE client key, to identify this bot/user>"
}
