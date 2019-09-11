const events = require('events')
const net = require('net')
// const channel = new events.EventEmitter()

// class 模式

class Chat {
	constructor(port) {
		this.signalTower = {}
		this.channel = new events.EventEmitter()
		this.channel.clients = {}
		this.channel.subscriptions = {}
		this.channel.on('join', this.channelJoin.bind(this))
		this.channel.on('leave', this.channelLeave.bind(this))
		this.channel.on('shutdown', this.channelShutdown.bind(this))
		this.channel.on('error', this.channelError.bind(this))
		this.maxListeners = 100
		this.server = {}
		this.port = port
		this.init()
	}

	static getChannel() {
		return this.channel
	}

	async init() {
		const self = this

		this.server = await net.createServer(res => {
			self.createSocket(res)
		})
		this.server.listen(this.port)
	}

	set maxListeners(value) {
		this.channel.setMaxListeners(value)
	}

	channelJoin(id, client) {
		const self = this

		this.channel.clients[id] = client
		this.channel.subscriptions[id] = (senderId, message) => {
			if (id != senderId) {
				self.channel.clients[id].write(message + '\n')
			}
		}

		this.channel.on('broadcast', this.channel.subscriptions[id])
		this.joinBroadcast(id)
	}

	joinBroadcast(id) {
		const date = this.getCurrentTime()
		const welcome = `
						${date}
						欢迎${id} 加入聊天室，
						聊天室内现有${this.channel.listeners('broadcast').length}人`

		for (let key in this.channel.clients) {
			if (key != id) {
				this.channel.clients[key].write(`${welcome}\n`)
			}
		}
		this.channel.clients[id].write(`${date} 你加入了聊天室\n`)
	}

	channelLeave(id) {
		// 离开时要清除房间id，不然会冲突
		delete this.channel.clients[id]
		this.channel.removeListener(
			'broadcast', this.channel.subscriptions[id]
		)

		this.channel.emit('broadcast', id, `${id} 离开了聊天室\n`)
	}

	channelShutdown(id) {
		this.channel.emit('broadcast', '', '有人要你们闭嘴')
		this.channel.removeAllListeners('broadcast')
	}

	channelError(err) {
		console.log(`ERROR: ${err.message}`)
	}

	createSocket(client) {
		let id = `${client.remoteAddress}:${client.remotePort}`

		this.channel.emit('join', id, client)
		this.eventSignalTower(client, id)
	}

	// publisher
	eventSignalTower(client, id) {
		const self = this

		client.on('close', () => {
			self.channel.emit('leave', id)
		})

		client.on('data', data => {
			let d = data.toString()

			if (d === 'shutdown\r\n') {
				self.channel.emit('shutdown')
			}
			self.channel.emit('broadcast', id, d)
		})
	}

	toZero(num) {
		return num < 10 ? '0' + num : num
	}

	getCurrentTime() {
		const date = new Date()
		return this.toZero(date.getHours()) + ':' + this.toZero(date.getMinutes())
	}
}

const socket = new Chat(8070)


// 在创建class类模式时，我们遇到了一些问题

// 1.我们时刻会用到this，所以我们经常会遇到的问题是this指向，
//   典型问题是constructor里取的this.channel.on('join', this.channelJoin.bind(this))，这里的事件方法如果不绑定this，就会指向到this.channel
//   net.createServer(res => { self.createSocket(res) }) 这里的回调函数如果单纯使用this.createSocket, 
//   就会被调用环境指向到Net里的作用域中
// 2.关于静态方法的使用，static关键字声明的方法只能以Chat.xxx类名形式调用，而不能用this



// channel.clients = {}
// channel.joinTime = {}
// channel.subscriptions = {}

// channel.on('join', function(id, client) {      
// 	// 如果用箭头函数这里的this就固定为了定义时所在的对象作用域，也就是当前函数作用域，打印为{}，而不是channel对象
// 	const date = new Date()

// 	// 缓存加入人的socket对象
// 	this.clients[id] = client
// 	this.joinTime[id] = toZero(date.getHours()) + ':' + toZero(date.getMinutes())
// 	this.subscriptions[id] = (senderId, message) => {
// 		// 忽略发出人的id
// 		if (id != senderId) {
// 			this.clients[id].write(message  + '\n')
// 		}
// 	}
// 	// 当前用户的broadcast事件监听器
// 	this.on('broadcast', this.subscriptions[id])

// 	// 有人加入时广播消息
// 	joinBroadcast(id)
// })

// channel.on('leave', function(id) {
// 	channel.removeListener(
// 		'broadcast', this.subscriptions[id]
// 	)
// 	channel.emit('broadcast', id , `${id}离开了聊天室\n`)
// })

// function createSocket(client) {
// 	const id = `${client.remoteAddress}:${client.remotePort}`

// 	// 当有用户连到服务器上时，发出一个join事件，指明用户的Id和client对象
// 	channel.emit('join', id, client)

// 	client.on('data', data => {
// 		data = data.toString()
// 		// 当有用户发送数据时，发出broadcast事件，指明用户id和消息
// 		channel.emit('broadcast', id, data)
// 	})

// 	client.on('close', () => {
// 		channel.emit('leave', id)
// 	})
// }


// function joinBroadcast(id) {
// 	for (let key in channel.clients) {
// 		if (key != id) {
// 			channel.clients[key].write(channel.joinTime[id] + ' ' + id + '加入了聊天室' + '\n')
// 		}
// 	}
// }

// function toZero(num) {
// 	return num < 10 ? '0' + num : num 
// }


// const server = net.createServer(createSocket)
// server.listen(8887)

// function (encoding, start, end) {
//   if (arguments.length === 0) {
//     return this.utf8Slice(0, this.length);
//   }

//   const len = this.length;
//   if (len === 0)
//     return '';

//   if (!start || start < 0)
//     start = 0;
//   else if (start >= len)
//     return '';

//   if (end === undefined || end > len)
//     end = len;
//   else if (end <= 0)
//     return '';

//   start |= 0;
//   end |= 0;

//   if (end <= start)
//     return '';
//   return stringSlice(this, encoding, start, end);
// }