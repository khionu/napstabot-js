const fs = require("fs");
const config = require("../config.json");
const request = require("request");
const stringArgv = require("string-argv");

var weaDisabled = false
if(config.skyKey) {
        const DarkSky = require('dark-sky')
        const darksky = new DarkSky(config.skyKey)
} else weaDisabled = true

if(config.google) {
        const NodeGeocoder = require('node-geocoder');
        const geocoder = NodeGeocoder({
                provider: 'google',
                httpAdapter: 'https',
                apiKey: config.google,
        });
} else weaDisabled = true

exports.func = (bot) => {


	commands.ping = {
		"help": "Pings the bot",
		"helpcat": "Information",
		"aliases": ["pong"],
		"run": (message, args) => {
			message.channel.send({
				embed: {
					description: "Pinging...",
					color: 0xAA3939
				}
			}).then(m => {
				m.edit({
					embed: {
						description: "Pong!",
						color: 0x2D882D,
						fields: [{
								name: "Roundtrip",
								value: `${m.createdTimestamp - message.createdTimestamp}ms`,
								inline: true
							},
							{
								name: "Websocket",
								value: `${Math.round(bot.ping)}ms`,
								inline: true
							}
						]
					}
				})
			});
		}
	}

	commands.userdata = {
		"help": "Gets the user's profile data",
		"helpcat": "Information",
		"aliases": ["user", "userinfo"],
		"run": (message, args) => {
			var user = message.mentions.users.first() || message.author
			var member = message.guild.members.get(user.id)
			var vcchannel = member.voiceChannel ? member.voiceChannel.name : "No Voice Channel"

			var shared = 0; // TODO: Do this on all shards
			bot.guilds.reduce((snowflake, guild) => {
				if (guild.members.has(user.id)) shared++
			}, []);

			var roles = []
			member.roles.reduce((snowflake, role) => {
				if (role.id == role.guild.id) return; // filters out @everyone
				roles.push(role.name);
			}, []);


			message.channel.send({
				embed: {
					title: ":information_source: Your User Information: :information_source:",
					color: 0xff5555,
					thumbnail: {
						url: user.displayAvatarURL
					},
					fields: [{
							name: "User",
							value: user.tag,
							inline: true
						},
						{
							name: "ID",
							value: user.id,
							inline: true
						},
						{
							name: "Status",
							value: user.presence.status,
							inline: true
						},
						{
							name: "Playing",
							value: user.presence.game || "No Game",
							inline: true
						},
						{
							name: "Voice Channel",
							value: vcchannel,
							inline: true
						},
						{
							name: "Account Created",
							value: user.createdAt,
							inline: true
						},
						{
							name: "Shared Servers on Shard",
							value: `${shared} servers`,
							inline: true
						},
						{
							name: "Roles",
							value: `${roles.length} roles`,
							inline: true
						},
						{
							name: "Joined Server",
							value: member.joinedAt,
							inline: true
						}
					]
				}
			})
		}

	}
	commands.serverdata = {
		"help": "Gets the server's data",
		"helpcat": "Information",
		"aliases": ["server", "serverinfo"],
		"run": (message, args) => {

			var server = message.guild

			var roles = []
			server.roles.reduce((snowflake, role) => {
				if (role.id == role.guild.id) return; // filters out @everyone
				roles.push(role.name);
			}, []);

			var channels = []
			server.channels.reduce((snowflake, channel) => {
				channels.push(channel.name);
			}, []);

			message.channel.send({
				embed: {
					title: ":information_source: Servers Information: :information_source:",
					color: 0xff5555,
					thumbnail: {
						url: server.iconURL
					},
					fields: [{
							name: "Server Name",
							value: `${server.name}`,
							inline: true
						},
						{
							name: "Members",
							value: `${server.memberCount}`,
							inline: true
						},
						{
							name: "Owner",
							value: `${server.owner}`,
							inline: true
						},
						{
							name: "Roles",
							value: `${roles.length}`,
							inline: true
						},
						{
							name: "Region",
							value: `${server.region}`,
							inline: true
						},
						{
							name: "Channels",
							value: `${channels.length}`,
							inline: true
						},
						{
							name: "Defult Channel",
							value: `${server.defaultChannel}`,
							inline: true
						},
						{
							name: "ID",
							value: `${server.id}`,
							inline: true
						},
						{
							name: "​",
							value: "​",
							inline: true
						}
					]
				}
			})
		}

	}
	commands.stats = {
		"help": "Gets the Napstas stats",
		"helpcat": "Information",
		"aliases": ["botinfo", "info"],
		"run": (message, args) => {

			var privServers = 0
			bot.guilds.reduce((l, g) => {
    			if(!g.large) privServers++
			});

			message.channel.send({
				embed: {
					title: ":information_source: Napstabot's Information: :information_source:",
					color: 0xff5555,
					description: "Napstabot was coded by Pierce#7555 and Lyrus#5251!",
					thumbnail: {
						url: bot.user.displayAvatarURL
					},
					fields: [{
							name: "Start Time",
							value: bot.readyAt,
							inline: true
						},
						{
							name: "Private Servers",
							value: privServers,
							inline: true
						},
						{
							name: "Total Servers on Shard",
							value: bot.guilds.size,
							inline: true
						},
						{
							name: "Shard Info",
							value: `${bot.shard.id + 1}/${bot.shard.count}`,
							inline: true
						}
					]
				}
			})
		}
	}
	commands.avatar = {
		"help": "Gets your avatar or another memebers",
		"helpcat": "Information",
		"aliases": ["ava", "av"],
		"run": (message, args) => {
			var user = message.mentions.users.first() || message.author

			message.channel.send({
				embed: {
					color: 0xff5555,
					image: {
						url: user.avatarURL
					}
				}
			})

		}
	}
	commands.weather = {
		"help": "Gets the current weather of an area!",
		"helpcat": "Information",
		"aliases": ["weth"],
		"run": (message, args) => {
			if(weaDisabled) {
				message.reply(":warning: This command is disabled due to required API tokens being unspecified.")
				return;
			}

			var place = args.join(" ")
			if (place == "") {
				message.reply("You need to specify a place!");
				return;
			}

			geocoder.geocode(place).then((res) => {
				if(!res[0]) {
					message.reply("Invaild location or error occurred.")
					return;
				}

				var info = darksky
					.latitude(res[0].latitude)
					.longitude(res[0].longitude)
					.language('en')
					.exclude('minutely,daily')
					.get().then((result) => {
					var title = res[0].formattedAddress
					var json = result.currently
					var icon = json.icon

					emotes = {
						"clear-day":			":sunny:",
						"clear-night":			":full_moon:",
						"rain":					":cloud_rain:",
						"snow":					":snowflake:",
						"sleet":				":cloud_rain:",
						"wind":					":dash:",
						"fog":					":foggy:",
						"cloudy":				":cloud:",
						"partly-cloudy-day":	":partly_sunny:",
						"partly-cloudy-night":	":crescent_moon:"
					}

					var emote = emotes[icon] || "";

					message.channel.send({
						embed: {
							title: `${emote} Weather for ${title} ${emote}`,
							color: 0xff5555,
							fields: [{
									name: "Summary",
									value: json.summary || "Unknown",
									inline: true
								},
								{
									name: "Nearest Storm Distance Speed",
									value: `${json.nearestStormDistance} mph` || "None",
									inline: true
								},
								{
									name: "Nearest Storm Bearing",
									value: json.nearestStormBearing || "None",
									inline: true
								},
								{
									name: "Temperature",
									value: `${json.temperature} °F` || "Unknown",
									inline: true
								},
								{
									name: "Apparent Temperature",
									value: parseInt(json.apparentTemperature) || "Unknown",
									inline: true
								},
								{
									name: "Dewwing Point",
									value: parseInt(json.dewPoint) || "Unknown",
									inline: true
								},
								{
									name: "Humidity",
									value: parseInt(json.humidity) || "Unknown",
									inline: true
								},
								{
									name: "Wind Speed",
									value: parseInt(json.windSpeed) || "None",
									inline: true
								}
							]
						}
					}).catch(console.log)

				})

			}).catch(console.log)
		}
	}
	commands.support = {
		"help": "Sends the bots support guild",
		"helpcat": "Information",
		"aliases": ["supp", "sup"],
		"run": (message, args) => {
			message.channel.send({
				embed: {
					title: `Here is the Official Napstabot Server.`,
					color: 0xff5555,
					description: `Join here for updates, support, and just to hangout!\n\nYou can join directly with https://discord.gg/YzSpj7q`
				}
			});
		}
	}
	commands.join = {
		"help": "Sends the bots invite link!",
		"helpcat": "Information",
		"aliases": ["inv", "invite"],
		"run": (message, args) => {
			message.channel.send({
				embed: {
					title: `Invite Link`,
					color: 0xff5555,
					description: `You can invite me to your server using: https://napstabot.club/`
				}
			});
		}
	}
}
