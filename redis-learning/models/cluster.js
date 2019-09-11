
// Node 集群 API 演示

const cluster = require('cluster');
const http = require('http');
const NUM_CPUS = require('os').cpus().length;

console.log(NUM_CPUS)

if (cluster.isMaster) {
	// 给每个核创建一个分叉
	for(let i = 0; i < NUM_CPUS; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(('Worker %s died.', worker.process.pid))
	})
} else {
	http.Server((req, res) => {
		res.writeHead(200);
		res.end('I am a worker running in process: ' + process.pid);
	}).listen(2000)
}

