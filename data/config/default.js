const fs = require('fs');

const path = require('path');
const appDir = path.dirname(require.main.filename);
const config = require(appDir + "/config.json");

var dConfig = {
	createGuild: function(id) {
		let file = fs.readFileSync("data/config/server/serverDB.json");
		let info = JSON.parse(file);
		info[id] = {
			prefix: config.prefix,
			security: {
				noMassmention: false,
				noYT: false,
				noInvite: false
		 	}
		}

		let data = JSON.stringify(info, null, 2);
		fs.existsSync(`data/config/server/serverDB.json`)
		fs.writeFileSync(`data/config/server/serverDB.json`, data);
	},

	createUserData: function(id) {
		let file = fs.readFileSync("data/config/user/userDB.json");
		let info = JSON.parse(file);
		info[id] = {
			gameData: {
				XP: 0,
				Coins: 0,
				Rank: "Rookie"
			}
		}

		let data = JSON.stringify(info, null, 2);
		fs.existsSync(`data/config/user/userDB.json`)
		fs.writeFileSync(`data/config/user/userDB.json`, data);
	}
};

module.exports = dConfig;
