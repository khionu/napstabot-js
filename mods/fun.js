const fs = require("fs");
const config = require("../config.json");
const request = require("request");
const stringArgv = require("string-argv");
const jimp = require("jimp");
const figlet = require("figlet");


// Going to make a func file so all these random functions dont have to be here.

function randint(low, high) {
	 return Math.floor(Math.random() * (high - low) + low);
}


// from Jimp https://github.com/oliver-moran/jimp/blob/4a7b21994e8a209cac6d89c7fcb8f3f820d9919d/index.js#L2714
function measureText(font, text) {
	 var x = 0;
	 for (var i = 0; i < text.length; i++) {
		  if (font.chars[text[i]]) {
				x += font.chars[text[i]].xoffset +
					 (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0) +
					 (font.chars[text[i]].xadvance || 0);
		  }
	 }
	 return x;
};

function align(start, end, text, font) {
	 var dist = end - start
	 var width = measureText(font, text)
	 var start_pos = start + ((dist - width) / 2)
	 return parseInt(start_pos)
}

function strshuffle(str) {
	 var newStr = ''
	 var rand
	 var i = str.length
	 while (i) {
		  rand = Math.floor(Math.random() * i)
		  newStr += str.charAt(rand)
		  str = str.substring(0, rand) + str.substr(rand + 1)
		  i--
	 }
	 return newStr
}

exports.func = (bot) => {
	 commands.scramble = {
		  "help": "scramble a 5 letter word!",
		  "helpcat": "Fun",
		  "aliases": ["scr"],
		  "run": (message, args) => {
				var lines = fs.readFileSync("./data/words.txt", 'utf8').split("\n");
				var line = lines[Math.floor(Math.random() * lines.length)].replace("\r", "");
				message.channel.send(`The word scramble is: ${strshuffle(line)}`)

				const collector = message.channel.createMessageCollector(m => m.content.includes(line) && m.author.id != bot.user.id, {
					 time: 15000
				})
				collector.on('collect', (m) => {
					 message.reply("Nice job! You solved the scramble!")
					 collector.stop()
				});
				collector.on('end', (c, r) => {
					 if (r == "time") message.channel.send(`Sorry! Times up! The word was ${line}.`)
				});
		  }
	 }

	 commands.ball = {
		  "help": "Magic 8 ball!",
		  "helpcat": "Fun",
		  "aliases": ["8"],
		  "run": (message, args) => {
				let response = require("../data/response.json");
				message.reply(`you asked \`${args.join(" ")}\`: ${response.eight_ball_replies[randint(0, 20)]}`);
		  }
	 }

	 commands.rr = {
		  "help": "Russian Roulette!",
		  "helpcat": "Fun",
		  "aliases": ["russian", "roulette"],
		  "run": (message, args) => {
				let rr_bullet = randint(1, 6)
				let rr_count = 1
				message.channel.send("You spin the cylinder of the revolver with 1 bullet in it...");
				setTimeout(function() {
					 message.channel.send("...you place the muzzle against your head and pull the trigger...");
				}, 1000);
				setTimeout(function() {
					 if (rr_bullet == rr_count) {
						  message.channel.send("...your brain gets splattered all over the wall.");
					 } else {
						  message.channel.send("...you live to see another day.");
					 }
				}, 3000);
		  }
	 }

	 commands.shoot = {
		  "help": "Shoot a friend, or yourself!",
		  "helpcat": "Fun",
		  "aliases": ["s", "kill"],
		  "run": (message, args) => {
				let image_dodge = `./data/images/dodge/${randint(1, 11)}.gif`;
				let image_shot = `./data/images/shot/${randint(1, 9)}.gif`;
				let image_kms = `./data/images/suicide/${randint(1, 5)}.gif`;
				let user = message.mentions.users.first() || message.author.id;

				if (bot.user.id == user.id) {
					 message.channel.send(`You attempted to shoot me, ${message.author}, but I dodged it!`, {
						  files: [image_dodge]
					 });
				} else if (message.author.id == user.id) {
					 message.channel.send(`${message.author} commited suicide!`, {
						  files: [image_kms]
					 });
				} else {
					 message.channel.send(`${user} was shot dead by ${message.author}!`, {
						  files: [image_shot]
					 });
				}
		  }
	 }

	 commands.roti = {
		  "help": "Rules of the internet!",
		  "helpcat": "Fun",
		  "aliases": ["rules"],
		  "run": (message, args) => {
				let roti = fs.readFileSync("./data/roti.txt", 'utf8').split("\n");
				let responseRandom = roti[randint(1, 102)]
				let response = roti[parseInt(args.join(" ")) - 1]

				if (args.join(" ") == "") {
					 message.reply(responseRandom);
				} else {
					 message.reply(response);
				}
		  }
	 }

	 commands.say = {
		  "help": "make the bot say something!",
		  "helpcat": "Fun",
		  "aliases": ["speak", "roulette"],
		  "run": (message, args) => {
				if (args.join(" ") == "") {
					 message.channel.send("You'll need to add a message, like `&say hey guys!`");
				} else {
					 message.delete();
					 message.channel.send(`${args.join(" ")} - ${message.author.username}`);
				}
		  }
	 }

	 commands.woop = {
		  "help": "Sends someone wooping!",
		  "helpcat": "Fun",
		  "aliases": ["w", "woo"],
		  "run": (message, args) => {
				let i = randint(1, 10);
				let woop = fs.readFileSync("./data/woop.txt", 'utf8').split("\n");
				message.channel.send(woop[i - 1]);
		  }
	 }

	 commands.cat = {
		  "help": "Sends a random cat ^v^",
		  "helpcat": "Fun",
		  "aliases": ["c"],
		  "run": (message, args) => {
				let url = "http://random.cat/meow";

				request(url, function(error, response, body) {
					 if (!error && response.statusCode === 200) {
						  var response = JSON.parse(body);

						  message.channel.send({
								embed: {
									 image: {
										  url: response.file
									 },
									 footer: {
										  text: `Requested by ${message.author.username}`,
										  icon_url: message.author.avatarURL
									 }
								}
						  });
					 }
				});
		  }
	 }


	 commands.xkcd = {
		  "help": "Sends a random comic from xkcd",
		  "helpcat": "Fun",
		  "aliases": ["x"],
		  "run": (message, args) => {
				let number = args.join(" ")
				console.log(number)
				if (number == "") {
					 let latest = "https://xkcd.com/info.0.json";

					 request(latest, function(error, response, body) {
						  if (!error && response.statusCode === 200) {
								var response = JSON.parse(body);
								var last = response.num;
								var random = randint(1, last);
								var url = `https://xkcd.com/${random}/info.0.json`;

								console.log("i defined")

								request(url, function(error, response, body) {
									 if (!error && response.statusCode === 200) {
										  console.log("i got data uwu")
										  var response = JSON.parse(body);
										  message.channel.send({
												embed: {
													 image: {
														  url: response.img
													 },
													 footer: {
														  text: `Requested by ${message.author.username}`,
														  icon_url: message.author.avatarURL
													 }
												}
										  });

									 }
								});

						  }
					 });
				} else {
					 let num = parseInt(number);
					 let url = `https://xkcd.com/${num}/info.0.json`;

					 request(url, function(error, response, body) {
						  if (!error && response.statusCode === 200) {
								var response = JSON.parse(body);

								message.channel.send({
									 embed: {
										  image: {
												url: response.img
										  },
										  footer: {
												text: `Requested by ${message.author.username}`,
												icon_url: message.author.avatarURL
										  }
									 }
								});

						  }
					 })

				}
		  }
	 }


	 commands.meme = {
		  "help": "Meme generator",
		  "helpcat": "Fun",
		  "aliases": ["m"],
		  "run": (message, args) => {

				if (!args[0]) {
					 message.reply(`**Bad Syntax**\n\n Use the commands like: \`${config.prefix}meme fry wait what\` or \`${config.prefix}meme \"sad obama\" foo \"bar baz\"\``)
					 return
				}

				if (args[0].toLowerCase() == "templates") {
					 message.reply("Memes can be found here: <http:\/\/memegen.link/templates/>\n\nIf you want to use a meme with multiple words, look at the end of the url.\n\nSo, \"Dating Site Murderer\" would be `dsm`")
				}

				let stringargs = stringArgv(args.join(" "))

				let meme = (stringargs[0] || "sad-obama").replace(/ /g, "-")
				let line1 = stringargs[1] || "_"
				let line2 = stringargs[2] || "_"


				let first = meme.replace(/ /g, "_")
					 .replace(/\?/g, "~q")
					 .replace(/%/g, "~p")
					 .replace(/\\/g, "''")


				let middle = line1.replace(/ /g, "_")
					 .replace(/\?/g, "~q")
					 .replace(/%/g, "~p")
					 .replace(/\\/g, "''")


				let last = line2.replace(/ /g, "_")
					 .replace(/\?/g, "~q")
					 .replace(/%/g, "~p")
					 .replace(/\\/g, "''")


				let collect = `http://memegen.link/api/templates/${first}/${middle}/${last}`

				request({
					 url: collect,
					 json: true
				}, function(error, response, body) {

					 if (!error && response.statusCode === 200) {
						  api = body["direct"]["masked"]
						  message.channel.send({
								embed: {
									 image: {
										  url: api
									 },
									 footer: {
										  text: `Requested by ${message.author.username}`,
										  icon_url: message.author.avatarURL
									 }

								}
						  });
					 }
				})
		  }
	 }

	 commands.rekt = {
		  "help": "Get rekt",
		  "helpcat": "Fun",
		  "run": (message, args) => {
				var img = "./data/images/source/rekt.gif"
				message.channel.send({
					 "files": [img]
				});
		  }
	 }

	 commands.removed = {
		  "help": "Lists commands that are currently in the works of being rewriten",
		  "helpcat": "Core",
		  "aliases": ["hug", "rly", "lewd", "pie", "dance", "robin", "repeat"],
		  "run": (message, args) => {
				message.reply("The folling commands are currently in the works of being rewriten to be better!\n\nhug, rly, lewd, pie, dance, robin, repeat");
		  }
	 }

	 commands.bigtext = {
		  "help": "Sends your message in big text!",
		  "helpcat": "Fun",
		  "aliases": ["bt"],
		  "run": (message, args) => {
				figlet(`${args.join(" ")}`, (err, sentance) => {
					 if (err) {
						  message.channel.send("Couldnt send message. Maybe too long?");
						  return;
					 }
					 message.channel.send("```fix\n" + sentance + "\n```");
				})
		  }
	 }

	 commands.socute = {
		  "help": "You are a friend are \"so cute!\"",
		  "helpcat": "Fun",
		  "aliases": ["sc"],
		  "run": (message, args) => {
				var user = message.mentions.users.first() || message.author

				message.channel.startTyping();

				jimp.read("./data/images/source/kawaii.jpg").then((image) => {
					 jimp.loadFont("./data/fonts/manga.fnt").then((font) => {
						  location = align(510, 278, user.username, font)
						  image.print(font, location, 255, user.username, 5)
						  image.getBuffer(jimp.AUTO, (err, img) => {
								if (err) throw err;
								message.channel.send({
									 "files": [img]
								});
						  });
					 }).catch((e) => console.error(e));
				}).catch((e) => console.error(e));

				message.channel.stopTyping();
		  }
	 }
	 commands.outage = {
		  "help": "you or a friend is having an outage!",
		  "helpcat": "Fun",
		  "aliases": ["out"],
		  "run": (message, args) => {
				var user = message.mentions.users.first() || message.author
				var avatarImg = user.avatarURL.replace(".gif", ".png")

				message.channel.startTyping();

				jimp.read(avatarImg).then((avatar) => {
					 outage = jimp.read("./data/images/source/outage.png").then((outage) => {
						  avatar.resize(outage.bitmap.width, outage.bitmap.height)
						  avatar.composite(outage, 0, 0);
						  avatar.getBuffer(jimp.AUTO, (err, img) => {
								if (err) throw err;
								message.channel.send({
									 "files": [img]
								});
						  });
					 }).catch((e) => console.error(e));
				}).catch((e) => console.error(e));

				message.channel.stopTyping();
		  }
	 }

	 commands.wolv = {
		  "help": "Wolverine misses you :c",
		  "helpcat": "Fun",
		  "aliases": ["frame"],
		  "run": (message, args) => {
				var user = message.mentions.users.first() || message.author
				var avatarImg = user.avatarURL.replace(".gif", ".png")

				message.channel.startTyping();

				jimp.read("./data/images/source/wolv.png").then((base) => {
					 var layout = new jimp(base.bitmap.width, base.bitmap.height, function(err, image) {});
					 avatar = jimp.read(user.avatarURL).then((avatar) => {
						  avatar.resize(380, 380);
						  avatar.rotate(-5);
						  layout.composite(avatar, 135, 452);
						  layout.composite(base, 0, 0);
						  layout.getBuffer(jimp.AUTO, (err, img) => {
								if (err) throw err;
								message.channel.send({
									 "files": [img]
								});
						  });
					 }).catch((e) => console.error(e));
				}).catch((e) => console.error(e));

				message.channel.stopTyping();
		  }
	 }

	 commands.computer = {
		  "help": "Are you doing the internet right?",
		  "helpcat": "Fun",
		  "aliases": ["cpu"],
		  "run": (message, args) => {
				var user = message.mentions.users.first() || message.author
				var avatarImg = user.avatarURL.replace(".gif", ".png")

				message.channel.startTyping();

				jimp.read("./data/images/source/computer.png").then((base) => {
					 var layout = new jimp(base.bitmap.width, base.bitmap.height, function(err, image) {});
					 avatar = jimp.read(user.avatarURL).then((avatar) => {
						  avatar.resize(195, 132);
						  layout.composite(avatar, 232, 152);
						  layout.composite(base, 0, 0);
						  layout.getBuffer(jimp.AUTO, (err, img) => {
								if (err) throw err;
								message.channel.send({
									 "files": [img]
								});
						  });
					 }).catch((e) => console.error(e));
				}).catch((e) => console.error(e));

				message.channel.stopTyping();
		  }
	 }

	 commands.preggo = {
		  "help": "you or a friend is.. preggo?",
		  "helpcat": "Fun",
		  "aliases": ["pre"],
		  "run": (message, args) => {
				var user = message.mentions.users.first() || message.author
				var avatarImg = user.avatarURL.replace(".gif", ".png")

				message.channel.startTyping();

				jimp.read("./data/images/source/preggo.png").then((base) => {
					 var layout = new jimp(base.bitmap.width, base.bitmap.height, function(err, image) {});
					 avatar = jimp.read(user.avatarURL).then((avatar) => {
						  avatar.resize(502, 447);
						  layout.composite(avatar, 0, 0);
						  layout.composite(base, 0, 0);
						  layout.getBuffer(jimp.AUTO, (err, img) => {
								if (err) throw err;
								message.channel.send({
									 "files": [img]
								});
						  });
					 }).catch((e) => console.error(e));
				}).catch((e) => console.error(e));

				message.channel.stopTyping();
		  }
	 }
	 commands.reasons = {
	     "run": (message, args) => {
	         var user = message.mentions.users.first() || message.author
	      var avatarImg =user.avatarURL.replace(".gif", ".png")

	      message.channel.startTyping();

	      jimp.read("./data/images/source/reason.png").then((base) => {
	          var layout = new jimp(base.bitmap.width, base.bitmap.height, function (err, image) {});
	          avatar = jimp.read(user.avatarURL).then((avatar) => {
	              avatar.resize(171, 214);
	              avatar.rotate(-10);
	              layout.composite(avatar, 36, 450);
	              layout.composite(base, 0, 0);
	              layout.getBuffer(jimp.AUTO, (err, img) => {
	                      if(err) throw err;
	                      message.channel.send({"files": [img]});
	                  });
	          }).catch((e) => console.error(e));
	      }).catch((e) => console.error(e));

	      message.channel.stopTyping();
	     } 
	 }

}