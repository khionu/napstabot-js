const config = require("../config.json");
const request = require("request");
const stringArgv = require("string-argv");


exports.func = (bot) => {
	commands.listbans = {
		"help": "Lists the current bans on the server.",
		"helpcat": "Server Moderation",
		"aliases": ["listb", "lb"],
		"reqperm": "BAN_MEMBERS",
		"run": (message, args) => {
			var server = message.guild
			var bans = server.fetchBans()

			bans.then((list) => {
				list = list.array()

				data = JSON.stringify(list, null, 2)

				if(data.length == 0) {
					message.channel.send("Here's a json file of all the members banned!", {
						"files": [{"attachment": Buffer.from(data, 'utf8'), "name": `${server.id}_bans_${+new Date()}.json`}]
					});
				} else {
					message.channel.send("No users have been banned!");
				}

			})
		}
	}
	
	commands.kick = {
		"help": "Kicks a mentioned user in a guild.",
		"helpcat": "Server Moderation",
		"aliases": ["kick", "boot"],
		"reqperm": "KICK_MEMBERS",
		"run": (message, args) => {
			var server = message.guild

			var member = message.mentions.members.first();


			// snippet of https://github.com/IanMurray/AnnuBot/blob/master/commands/banid.js#L12

			var person = args[0]
			args.shift()

			if (args.join(" ") == "") {
				reason = "No Reason Stated"
			} else {
				reason = args.join(" ")
			}

			member.kick(reason).then((member) => {
				message.channel.send({
					embed: {
						title: `${member} has been kicked!`,
						color: 0x2D882D,
						description: `For: ${reason}`
					}
				})
			}).catch((error) => {
				message.channel.send("Sorry! I dont have permission to kick that user!")
			})
		}
	}

	commands.ban = {
		"help": "Bans a mentioned user in a guild.",
		"helpcat": "Server Moderation",
		"aliases": ["hammer"],
		"reqperm": "BAN_MEMBERS",
		"run": (message, args) => {
			var server = message.guild

			var member = message.mentions.members.first();

			// snippet of https://github.com/IanMurray/AnnuBot/blob/master/commands/banid.js#L12

			var person = args[0]
			args.shift()

			if (args.join(" ") == "") {
				reason = "No Reason Stated"
			} else {
				reason = args.join(" ")
			}

			member.ban(reason).then((member) => {
				message.channel.send({
					embed: {
						title: `${member} has been banned!`,
						color: 0x2D882D,
						description: `For: ${reason}`
					}
				})
			}).catch((error) => {
				message.channel.send("Sorry! I dont have permission to ban that user!")
			})
		}
	}

	commands.prunekick = {
		"help": "Prune kicks or soft bans a mentioned user in a guild.",
		"helpcat": "Server Moderation",
		"aliases": ["softban"],
		"reqperm": "BAN_MEMBERS",
		"run": (message, args) => {
			var server = message.guild

			var member = message.mentions.members.first();

			var user = message.mentions.users.first();

			var guild = message.guild;

			// snippet of https://github.com/IanMurray/AnnuBot/blob/master/commands/banid.js#L12

			var person = args[0]
			args.shift()

			if (args.join(" ") == "") {
				reason = "No Reason Stated"
			} else {
				reason = args.join(" ")
			}

			member.ban(reason).then((user) => {
				guild.unban(user.id).then((user) => {
					message.channel.send({
						embed: {
							title: `${user} has been Prune kicked!`,
							color: 0x2D882D,
							description: `For: ${reason}`
						}
					})
				})
			}).catch((error) => {
				message.channel.send("Sorry! I dont have permission to prune kick that user!")
			})
		}
	}

	commands.prune = {
		"help": "Deletes x amount of messages in a channel.",
		"helpcat": "Server Moderation",
		"aliases": ["bulkdel", "msgdel", "purge"],
		"reqperm": "MANAGE_MESSAGES",
		"run": (message, args) => {
			var amount = parseInt(args[0]);

			if (!amount)
				return message.reply("Please provide a number! like `50`");

			message.channel.fetchMessages({
				count: amount
			}).then((messages) => {
				message.channel.bulkDelete(messages, {
						FilderOld: true
					})
					.then(messages => {
						message.reply(`I Pruned ${amount}!`)
					}).catch(error => {
						message.reply(`Could not prune messages!\n\n${error}`)
					});
			})
		}
	}

	commands.createinv = {
		"help": "Creates an invite for the guild!",
		"helpcat": "Server Moderation",
		"aliases": ["generateInv", "geninv", "createinvite"],
		"reqperm": "CREATE_INSTANT_INVITE",
		"run": (message, args) => {
			message.channel.createInvite()
			.then(invite => {
				message.reply(`Here is an Invite for the current server!\n\n${invite}`)
			})
			.catch(error => `Could not make an invite, here is the error/\n\n${error}`)
		}
	}

	commands.delinv = {
		"help": "Deletes an invite for the guild!",
		"helpcat": "Server Moderation",
		"aliases": ["deleteinvite"],
		"reqperm": "MANAGE_GUILD",
		"run": (message, args) => {
			var inv = args[0]

			if(!bot.fetchInvite(inv)) {
				return message.reply("Not a valid invite")
			}

			bot.fetchInvite(inv).then((invite) => {
			invite.delete()
			.then(invite => {
				message.reply(`I deleted ${invite}`)
			})
			.catch(error => `Could not delete ${invite}\n\n${error}`)
			})
		}
	}

	commands.createrole = {
		"help": "Creates a role for a server",
		"helpcat": "Server Moderation",
		"aliases": ["rolecreate", "newrole"],
		"reqperm": "MANAGE_ROLES",
		"run": (message, args) => {
			var role = args[0]

			var server = message.guild

			server.createRole({
				name: `${role}`
			})
			.then((role) => {
				message.channel.send(`I created **${role}**`)
			})
		}
	}

	commands.deleterole = {
		"help": "Removes a role from the server",
		"helpcat": "Server Moderation",
		"aliases": ["roledelete", "delrole"],
		"reqperm": "MANAGE_ROLES",
		"run": (message, args) => {
			var role = args[0]

			var server = message.guild

			if(message.guild.roles.find('name', role)) {
				server.deleteRole(role)
				.then(role => message.reply(`I deleted ${role}`))
				.catch(error => message.reply(`Could not delete ${role}! Here is the error... /n/n${error}`))
			} else {
				message.reply(`Make sure the role exists (cap sensitive)`)
			}
		}
	}
	commands.changenick = {
		"help": "Changes a users nickname",
		"helpcat": "Server Moderation",
		"aliases": ["nick", "changen"],
		"reqperm": "MANAGE_NICKNAMES",
		"run": (message, args) => {

			args.shift();
			var nick = args.join(" ")

			var user = message.mentions.users.first();

			if(!user || !nick) {
				message.reply("No user or nickname specifed. Specify the user as a mention then the desired nickname.")
			}

			var member = message.guild.members.get(user.id)

			member.setNickname(nick)
			.then(member => message.reply(`The nickname of ${user.tag} is now \`${nick}\``))
			.catch(error => message.reply(`Unable to change the nickname of ${user.tag}. Here is the error...\n\n${error}`))
		}
	}
	commands.listinv = {
		"help": "List invites",
		"helpcat": "Server Moderation",
		"aliases": ["listinv"],
		"reqperm": "MANAGE_GUILD",
		"run": (message, args) => {
			ib = []
			message.guild.fetchInvites().then((invs) => {
				invs.reduce((c, obj) => {
					 ib.push(`http:\/\/discord.gg/${obj.code}`)
				}, []);

				message.channel.send(`The currently active invites for this server are: ${ib.join(", ")}`).catch(error => console.error)
			}).catch(error => console.error)
		}
	}
}