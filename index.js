// 

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const articles = [{ title: 'Example' }]
const Article = require('./article.js').Articles
const read = require('node-readability');
const url = 'http://www.manning.com/cantelon2/'

app.set('port', process.env.PORT || 3000)

// 支持编码为 JSON/表单 的请求消息体
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/articles', (req, res, next) => {
	Article.all((err, article) => {
		if (err) return next(err)
		res.send(articles)
	})
	
})

app.get('/articles/:id', (req, res, next) => {
	const id = req.params.id
	Article.find(id, (err, article) => {
		if (err) return next(err)
		res.send(article)
	})
})

app.post('/articles', (req, res, next) => {
	// 从 POST 消息体中得到 URL
	const url = req.body.url;

	read(url, (err, result) => {
		// 用 readability 模块 获取这个URL指向的页面
		console.log(result.title)
		if (err || !result) res.status(500).send('Error downloading article')

		Article.create(
			{ title: result.title, content: result.content },
			(err, article) => {
				if (err) return next(err)
				res.send('article create success')
			}
		)
	})
	
})

app.delete('/articles/:id', (req, res, next) => {
	const id = req.params.id
	Article.delete(id, (err) => {
		if (err) return next(err)
		res.send({ message: 'Deleted'})
	})
})

app.listen(app.get('port'), () => {
	console.log(`listening ${app.get('port')}`)
})


