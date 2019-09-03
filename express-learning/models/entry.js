// redis 消息处理类

const redis = require('redis');
const redisDB = redis.createClient();  // 创建 Redis 客 户端实例

class Entry{
	constructor(obj) {
		for (let x in obj) {
			this[x] = obj[x]
		}
	}

	save(cb) {
		// 将保存的消息转换 成 JSON 字符串
		const entryJSON = JSON.stringify(this);

		// 将JSON字符串保存到 Redis 列表中
		redisDB.lpush(
			'entries',
			entryJSON,
			(err) => {
				if (err) return cb(err);
				cb()
			}
		)
	}

	// 获取部分消息
	static getRange(from, to, cb) {
		// 从entries表中获取信息
		redisDB.lrange('entries', from, to, (err, items) => {
			if (err) return cb(err);
			let entries = [];
			items.forEach(item => {
				entries.push(JSON.parse(item))
			})

			cb(null, entries)
		})
	}

}

module.exports = Entry