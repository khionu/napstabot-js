const fs = require('fs');
const config = require("../config.json");
const util = require('util')

exports.func = (bot) => {
	commands.eval = {
		"aliases": ["exec", "debug"],
		"reqperm": "BOTDEV",
		"run": (message, args) => {
			try {
				const code = args.join(' ');
				result = eval(code);
				if (typeof result !== 'string') result = util.inspect(result);

				message.reply(result, {code:'xl', split: true, disableEveryone: true})
			} catch(e) {
				message.reply(e, {code:'xl', split: true, disableEveryone: true})
			}
		}
	}
}