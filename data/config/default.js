const fs = require('fs');

var dConfig = {
	createGuild: function(id) {
		let info = {
			prefix: "xx+",
			id: id,
			security: {
				noMassmention: false,
				noTY: false,
				noInvite: false

			}

		};

		let data = JSON.stringify(info, null, 2);
		fs.existsSync(`data/config/server/${id}.json`)
		fs.writeFileSync(`data/config/server/${id}.json`, data);
	},

	createUserData: function(id) {
		let info = {
			id: id,
			gameData: {
				XP: 0,
				Coins: 0,
				Rank: "Rookie"
			}
		}

		let data = JSON.stringify(info, null, 2);
		fs.existsSync(`data/config/user/${id}.json`)
		fs.writeFileSync(`data/config/user/${id}.json`, data);
	}
};

module.exports = dConfig;
