const net = require('net');
const redis = require('redis');

// 为每个用户创建订阅客户端
const server = net.createServer(socket => {
	const subscriber = redis.createClient();
	subscriber.subscribe('main');
	// 从频道收到消息后显示给用户看
	subscriber.on('message', (channel, message) => {
		socket.write(`Channel ${channel}: ${message}`)
	})

	// 为每个用户创建发布客户端
	const publisher = redis.createClient();
	socket.on('data', data => {
		publisher.publish('main', data)
	})

	socket.on('end', () => {
		// 如果用户断开了连接，结束订阅客户端
		subscriber.unsubscribe('main');
		subscriber.end(true);
		publisher.end(true);
	})
})

server.listen(3001);

// Redis 客户端既可以订阅频道上的消息，也可以向频道发布消息。
// 发给频道的消息会传递给 所有订阅该频道的客户端。发布者不需要知道谁是订阅者，订阅者也不知道发布者是谁。将发布者和订阅者解耦是种强大清晰的模式。