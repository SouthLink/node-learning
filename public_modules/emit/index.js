
// 下面的代码清单实现了一个 echo 服务器。当有客户端连接上来时，它就会创建一个 socket。
// socket 是一个事件发射器，可以用 on 方法添加监听器响应 data 事件。只要 socket 上有新数据 过来，就会发出这些 data 事件。
// const net = require('net')
// const server = net.createServer(socket => {
// 	socket.once('data', data => {
// 		socket.write(data)
// 	})
// })

// server.listen(8888)

// 前面的例子用了一个带事件发射器的 Node 内置 API。然而你可以用 Node 内置的事件模块创 建自己的事件发射器。
// 下面的代码定义了一个 channel 事件发射器，带有一个监听器，可以向加入频道的人做出 响应。注意这里用 on(或者用比较长的 addListener)方法给事件发射器添加了监听器:

const EventEmitter = require('events').EventEmitter
const channel = new EventEmitter()

channel.on('join', () => {
	console.log('welcome join!')
})

channel.emit('join')