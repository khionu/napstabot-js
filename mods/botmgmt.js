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
	commands.changeprefix = {
		"aliases": ["prefix", "cp"],
		"helpcat": "Core",
		"reqperm": "ADMINISTRATOR",
		"run": (message, args) => {
			var serverConfig = require(`../data/config/server/${message.guild.id}.json`);
			serverConfig.prefix = args.join(" ");
			var data = JSON.stringify(serverConfig, null, 2);
			fs.writeFileSync(`data/config/server/${message.guild.id}.json`, data);

			message.reply(`I set my prefix to \`${serverConfig.prefix}\` for this guild!`)
		}
	}
}