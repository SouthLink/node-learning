const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.send('hello node.js')
})

app.listen(8071, () => {
	console.log('node.js listen 8071 port')
})