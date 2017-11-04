# Napstabot.js
A rewritten napstabot that is more stable then the original code

## Installing

1. Use `npm install` to install the required dependencies.
2. open `config.json` and add in the required information.

## Developer Documentation

If you're going to self host.

### Command Handler
```javascript
commands.example = {
	"help": "Example command.",     // Optional. Text to display in the help command. If not specified, the command will
								    //  be hidden from the help command.
	"helpcat": "Example",           // Optional. Category to display in the help command.
	"aliases": ["e", "test"],       // Optional. Command aliases.
	"reqperm": "BOTDEV",            // Optional. Permissions required to run command. Should be "BOTDEV" or a permission flag. http://discord.js.org#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
	"run": (message, args) => {...} // Required. Function to run if the command is executed. Passes the message and
	                                //  command arguments as arguments.
}
```

### API Keys

**Dark Sky**: https://darksky.net/dev/account

**bots.discord.pw**: (abal): https://bots.discord.pw/api

**Carbon**: by request, https://discord.gg/J2evbZB

**Google**: https://developers.google.com/maps/documentation/geocoding/start#get-a-key
