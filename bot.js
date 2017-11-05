const Discord = require('discord.js');
const carbon = require('./data/config/carbon.js');
const fs = require('fs');
const rightPad = require('right-pad');
const dConfig = require('./data/config/default.js');

const bot = new Discord.Client();

if(!bot.shard) {
	console.log("Please run this bot using the sharding manager! Exiting...")
	process.exit();
}

var config = require("./config.json");

bot.on('ready', () => {
	console.log(`Shard #${bot.shard.id + 1} (ID: ${bot.shard.id}) logged in with ${bot.guilds.size} servers.`);
	if(config.carbon) carbon.updateCarbon(config.carbon, bot.guilds.size, bot.shard.id, bot.shard.count);
	if(config.abal) carbon.updateAbal(bot.user.id, config.abal, bot.guilds.size, bot.shard.id, bot.shard.count);
	bot.user.setGame(`Shard ${bot.shard.id + 1}/${bot.shard.count}`)

	commands = {};
	fs.readdir("./mods/", (err, files) => {
		var indexed = [];
		files.forEach(file => {
			indexed.push(file.slice(0, -3));
		});
		indexed.forEach(mod => {
			require(`./mods/${mod}`).func(bot);
		});
	});

	// Help must be defined in the core bot file.
	commands.help = {
		"help": "Messages you a command list.",
		"helpcat": "Core",
		"run": (message, args) => {
			catbuilder = {}
			Object.keys(commands).sort().forEach(cmd => {
				helpcat = commands[cmd].helpcat || "No Category"
				if (!catbuilder[helpcat]) {
					catbuilder[helpcat] = []
				}
				catbuilder[helpcat].push(cmd)
			})

			textbuilder = []
			Object.keys(catbuilder).sort().forEach(cat => {
				textbuilder.push(`[${cat}]`)
				catbuilder[cat].sort().forEach(cmd => {
					if(commands[cmd].help) {
						textbuilder.push(`${rightPad(cmd, 8, " ")} = ${commands[cmd].help}`)
					}
				})
			})

			message.author.send(textbuilder.join("\n"), {
				code: "ini",
				split: true
			}).then(() => {
				message.reply(":mailbox_with_mail: A command list has been sent to you in DMs!")
			}).catch(() => {
				message.reply(":x: Unable to send you a message, please check your privacy settings and try again.")
			})
		}
	}
});

bot.on('guildCreate', (message) => {
    dConfig.createGuild(message.guild.id);
});

bot.on('message', (message) => {
	if (!fs.existsSync(`./data/config/server/${message.guild.id}.json`)) {
	    dConfig.createGuild(message.guild.id);
	}
	var guildConfig = require(`./data/config/server/${message.guild.id}.json`);
	var prefix = guildConfig.prefix || config.prefix

	if (message.author.id == bot.user.id) return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.split(" ");
	const cmd = args.shift().slice(prefix.length);

	try {
		cmdobj = null;

		if(commands[cmd]) {
			cmdobj = commands[cmd]
		} else {
			Object.keys(commands).sort().forEach(co => {
				if(commands[co].aliases) {
					if (commands[co].aliases.includes(cmd)) {
						cmdobj = commands[co]
					}
				}
			});
			if(!cmdobj) return;
		}

		hasperms = false;
		if(!cmdobj.reqperm) {
			hasperms = true
		} else if(cmdobj.reqperm.toUpperCase() == "BOTDEV") {
			if(config.botdevs) {
				if(config.botdevs.includes(message.author.id)) hasperms = true;
			}
		} else {
			if(message.member.hasPermission(cmdobj.reqperm)) hasperms = true;
		}

		if(hasperms) {
			cmdobj.run(message, args)
		} else {
			message.reply(`:no_entry: Access denied.\n\nYou do not have the \`${cmdobj.reqperm}\` permission.`)
		}

	} catch (e) {
		console.warn(e)
	}
});

bot.login(config.token);
