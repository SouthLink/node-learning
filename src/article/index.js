// 

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const articles = [{ title: 'Example' }]
const Article = require('./article.js').Articles
const read = require('node-readability');
const url = 'http://www.manning.com/cantelon2/'



app.set('port', process.env.PORT || 3000)
app.set('views', path.join( __dirname, 'views'))

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 支持编码为 JSON/表单 的请求消息体
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 要加载 Bootstrap 的 CSS，用 express.static 将文件注册到恰当的 URL 上:
app.use(
	'/css/bootstrap.css',
	express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)

app.get('/articles', (req, res, next) => {
	Article.all((err, article) => {
		if (err) return next(err)
		res.format({
			html: () => {
				res.render('./ejs/article.ejs', { articles: article })
			},
			json: () => {
				res.send(article)
			}
		})
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
	const date = new Date().getTime()

	read(url, (err, result) => {
		// 用 readability 模块 获取这个URL指向的页面
		console.log(result.title)
		let resultTransfer = result
		if (err || !result) res.status(500).send('Error downloading article')

		Article.create(
			{ title: resultTransfer.title, content: resultTransfer.content },
			(err, article) => {
				if (err) return next(err)
				console.log('耗时' + new Date().getTime() - date + 'ms')

				// ejs 模板渲染
				res.format({
					html: () => {
						res.render('./ejs/article.ejs', { articles: article })
					},
					json: () => {
						res.send(article)
					}
				})

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


