const fs = require('fs');
const request = require("request");

var update = {
	updateCarbon: function(auth, count, shard, shard_count) {
		let url = `https://www.carbonitex.net/discord/data/botdata.php`

		request.post(url, {
			form: {
				"key": auth,
            	"servercount": count,
            	"shard_id": shard,
            	"shard_count": shard_count
			}
		},function(error, response, body) {
			if(!error) {
				console.log(`Carbon: ${body}`)
			} else {
				console.log(`Carbon: ${error}`)
			}
		});
	},

	updateAbal: function(id, auth, count, shard, shard_count) {
		let url = `https://bots.discord.pw/api/bots/${id}/stats`

		request.post(url, {
			form: {
				"shard": shard,
				"shard_count": shard_count,
				"server_count": count
			},
			headers: {
				"Authorization": auth
			}
		}, function(error, response, body) {
			if(!error) {
				console.log(`Abal: ${body}`)
			} else {
				console.log(`Abal: ${error}`)
			}
		});
	}
};

module.exports = update;
