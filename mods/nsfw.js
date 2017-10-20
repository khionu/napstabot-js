const fs = require('fs');
const config = require("../config.json");
const request = require("request");

const NOT_NSFW = ":no_entry: This channel is not a NSFW Text channel. :no_entry:\n\nThis command may only be used in NSFW Text channels.\n\n"

exports.func = (bot) => {
	commands.e621 = {
		"help": "get your images from e621!",
		"helpcat": "NSFW",
		"aliases": ["e6"],
		"run": (message, args) => {
			if(!message.channel.nsfw) {
				message.reply(NOT_NSFW);
				return;
			}

			if(!args[0]) {
				message.reply("No tags specified.");
			}

			var options = {
				url: `https:\/\/e621.net/post/index.json?limit=250&tags=${args.join(" ")}`,
				headers: {
					'User-Agent': 'Napstabot/2.0 (+napstabot.club)'
				}
			};

			message.channel.startTyping();

			request(options, function(error, response, body) {
				if (!error && response.statusCode === 200) {
					var response = JSON.parse(body);

					if(!response[0]) {
						message.channel.send("No results found.")
						return;
					}

					response.sort( function() { return 0.5 - Math.random() } );
					count = response.length > 4 ? 4 : response.length;

					str = ""
					for(i=0; i<count; i++) {
						str += `\n${response[i].file_url}`
					}

					message.channel.send(`Here is ${count} random images tagged \`${args.join(" ")}\`:${str}`)
				}

				message.channel.stopTyping();
			});
		}
	}

	commands.rule34 = {
		"help": "get your images from Rule34!",
		"helpcat": "NSFW",
		"aliases": ["r34"],
		"run": (message, args) => {
			if(!message.channel.nsfw) {
				message.reply(NOT_NSFW);
				return;
			}

			if(!args[0]) {
				message.reply("No tags specified.");
			}

			var options = {
				url: `http:\/\/rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=250&tags=${args.join(" ")}`,
				headers: {
					'User-Agent': 'Napstabot/2.0 (+napstabot.club)'
				}
			};

			message.channel.startTyping();

			request(options, function(error, response, body) {
				if (!error && response.statusCode === 200) {
					var response = JSON.parse(body);

					if(!response[0]) {
						message.channel.send("No results found.")
						return;
					}

					response.sort( function() { return 0.5 - Math.random() } );
					count = response.length > 4 ? 4 : response.length;

					str = ""
					for(i=0; i<count; i++) {
						str += `\nhttp:\/\/img.rule34.xxx/images/${response[i].directory}/${response[i].image}`
					}

					message.channel.send(`Here is ${count} random images tagged \`${args.join(" ")}\`:${str}`)
				}

				message.channel.stopTyping();
			});
		}
	}
}
