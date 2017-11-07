# Napstabot.js
A rewritten napstabot that is more stable then the original code

## Developer Documentation
Useful notes and details if you wish to host this bot yourself or contribute to it.

## Quick Setup Guide
```sh
$ git clone https://github.com/NapstaTeam/napstabot-js.git
$ cd napstabot-js
$ npm install
$ cp example_config.json config.json
$ # Edit config.json to your liking
$ node main.js
```

### Command Handler
```javascript
commands.example = {
	// Optional. Text to display in the help command. If not specified, the command will be hidden from the help command
	"help": "Example command.",  

	// Optional. Category to display in the help command.
	"helpcat": "Example",           

	// Optional. Command aliases
	"aliases": ["e", "test"],

	// Optional. Permissions required to run command. Should be "BOTDEV" or a permission flag:
	// http://discord.js.org#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
	"reqperm": "BOTDEV",       

	// Required. Function to run if the command is executed. Passes the message and command arguments as arguments.
	"run": (message, args) => {
		// ...
	}
}
```

### API Keys
*API Keys are not required for any service, but some functions may be disabled if they are unspecified.*

**Dark Sky**: https://darksky.net/dev/account

**Carbon**: By request, https://discord.gg/J2evbZB

**bots.discord.pw** *(abal)*:  https://bots.discord.pw/api

**Google Geocoding**: https://developers.google.com/maps/documentation/geocoding/start#get-a-key
