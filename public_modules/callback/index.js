const http = require('http')
const fs = require('fs')

// 普通

// http.createServer((req, res) => {
// 	if (req.url == '/') {
// 		fs.readFile('./lib/titles.json', (err, data) => {
// 			if (!err) {
// 				const titles = JSON.parse(data.toString());

// 				fs.readFile('./lib/recent.html', (err, data) => {
// 					if (!err) {
// 						const tmpl = data.toString()
// 						const html = tmpl.replace('%', titles.join('<li></li>'))

// 						res.writeHead(200, {'Content-Type': 'text/html'})
// 						res.end(html)
// 					} else {
// 						console.error(err)
// 						res.end('Server Error')
// 					}
// 				})
// 			} else {
// 				console.error(err)
// 				res.end('Server Error')
// 			}
// 		})
// 	}
// }).listen(8072)

// 优化回调方法

// function onRequset(req, res) {
// 	if (req.url == '/') {
// 		fs.readFile('./lib/titles.json', (err, data) => {
// 			if (!err) {
// 				getTemplate(data, res)
// 			} else {
// 				hasError(err, res)
// 			}
// 		})
// 	}
// }

// function getTemplate(data, res) {
// 	const titles = JSON.parse(data.toString());

// 	fs.readFile('./lib/recent.html', (err, data) => {
// 		if (!err) {
// 			formateHtml(data, titles, res)
// 		} else {
// 			hasError(err, res)
// 		}
// 	})
// }

// function formateHtml(data, titles, res) {
// 	const tmpl = data.toString()
// 	const html = tmpl.replace('%', titles.join('<li></li>'))

// 	res.writeHead(200, {'Content-Type': 'text/html'})
// 	res.end(html)
// }


// function hasError(err, res) {
// 	console.error(err)
// 	res.end('Server Error')
// }

// http.createServer(onRequset).listen(8072)


// 优化嵌套层级和结构

function onRequset(req, res) {
	if (req.url == '/') {
		fs.readFile('./lib/titles.json', (err, data) => {
			if (err) return hasError(err, res)
			getTemplate(JSON.parse(data.toString()), res)
		})
	}
}

function getTemplate(titles, res) {
	fs.readFile('./lib/recent.html', (err, data) => {
		if (err) return hasError(err, res)
		formateHtml(data.toString(), titles, res)
	})
}

function formateHtml(tmpl, titles, res) {
	const html = tmpl.replace('%', titles.join('<li></li>'))
	res.writeHead(200, {'Content-Type': 'text/html'})
	res.end(html)
}


function hasError(err, res) {
	console.error(err)
	res.end('Server Error')
}

http.createServer(onRequset).listen(8072)


// Node 的异步回调惯例
// Node 中的大多数内置模块在使用回调时都会带两个参数:第一个用来放可能会发生的错
// 误，第二个用来放结果。错误参数经常缩写为 err。 下面这个是常用的函数签名的典型示例:
// const fs = require('fs');
// fs.readFile('./titles.json', (err, data) => {
//   if (err) throw err;
// 如果没有错误发生，则对数据进行处理 });