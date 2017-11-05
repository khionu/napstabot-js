const Discord = require('discord.js');

try {
	var config = require("./config.json");
} catch (e){
	console.log("Config does not exist or is invaild! Exiting...");
	process.exit();
}

const manager = new Discord.ShardingManager("./bot.js", {
	"token": config.token
});

manager.spawn().catch((e) => console.log(e));
manager.on('launch', shard => console.log(`Launching shard #${shard.id + 1} (ID: ${shard.id})...`));
