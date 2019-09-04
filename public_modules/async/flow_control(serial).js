// 串行流程控制

const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');
const configFilename = './public_modules/async/lib/rss_feads.txt'

const checkForRSSFile = () => {
	fs.exists(configFilename, (exists) => { // fs 
		if (!exists) return next(new Error(`Missing Rss file ${configFilename}`))
		next(null, configFilename)
	})
}

// 读取并解析包含 预订源 URL 的文件
const readRSSFile = (configFilename) => {
	fs.readFile(configFilename, (err, feedList) => {
		if (err) return next(err)
		// 将预订源 URL 列表转换成字符串， 然后分隔成一个数组
		feedList = feedList
			.toString()
			.replace(/^\s+|\s+$/g, '')
			.split('\n')

		const random = Math.floor(Math.random() * feedList.length)
		// 从预订源 URL 数组中随 机选择一个预订源 URL
		next(null, feedList[random])
	})
}

// 向选定的预订源发 送 HTTP 请求以获取数据
const downloadRSSFild = (feedUrl) => {
	request({
		url: feedUrl
	}, (err, res, body) => {
		if (err) return next(err)
		if (res.statusCode != 200)
			return next(new Error('Abnormal response status code'))
		next(null, body)
	})
}

// 将预订源数据解 析到一个条目数组中
const parseRSSFeed = (rss) => {
	const handler = new htmlparser.RssHandler();
	const parser = new htmlparser.Parser(handler);

	parser.parseComplete(rss);
	console.log(handler.dom.items)
	if (!handler.dom.items.length)
		return next(new Error('No Rss items found'))

	const item = handler.dom.items.shift();
	console.log(item.title)
	console.log(item.link)
}

const tasks = [
	checkForRSSFile,
	readRSSFile,
	downloadRSSFild,
	parseRSSFeed
]

const next = (err, result) => {
	if (err) throw err
	const currentTask = tasks.shift()
	if (currentTask) {
		currentTask(result)
	}
}

next()