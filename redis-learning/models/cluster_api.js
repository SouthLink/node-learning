
// Node 集群 API 演示

const cluster = require('cluster');
const http = require('http');
const NUM_CPUS = require('os').cpus().length;
const workers = {};
let requests = 0;


if (cluster.isMaster) {
	for (let i = 0; i < NUM_CPUS; i++) {
		workers[i] = cluster.fork();
		((i) => {
			// 监听来自工作进程的消息
			workers[i].on('message', (message) => {
				if (message.cmd === 'incrementRequestTotal') {
					// 增加总请求数
					requests ++;
					for (var j = 0; j < NUM_CPUS; j++) {
						// 将新的总请求数发给所有工作进程
						workers[j].send({
							cmd: 'updateOfRequestTotal',
							requests: requests
						})
					}
				}
			})
			// 用闭包保留当前工作进程的索引
		})(i)
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(('Worker %s died.', worker.process.pid))
	})
} else {
	// 监听来自主进程的消息
	process.on('message', (message) => {
		if (message.cmd === 'updateOfRequestTotal') {
			// 根据主进程的消息更新请求数
			requests = message.requests
		}
	});

	http.Server((req, res) => {
		res.writeHead(200);
		res.end(`Worker ${process.pid}: ${requests} requests.`);
		// 让主进程知道该增加总请求数了
		process.send({ cmd: 'incrementRequestTotal' });
	}).listen('2001')
}