const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');

router.get('/entries', function(req, res, next){
	res.render('entries', { title: 'entries'})
})

router.get('/getEntriesList', function(req, res, next){
	res.send(list)
})

// 用表单提交的数据创建消息
exports.submit = (req, res, next) => {
	// 来自表单中名为“entry[...]” 的控件
	const data = req.body.entry;
	// 加载用户数据的中间件
	const user = res.locals.user;
	const username = user ? user.name : null;
	const entry = new Entry({
		userName: username,
		title: data.title,
		body: data.body
	})

	// 把表单信息保存到redis，并跳转到消息列表展示页
	entry.save((err) => {
		if (err) return next(err);
		console.log('remoteUser' + req.remoteUser)
		if (req.remoteUser) {
			res.json({ message: 'Entry added' })
		} else {
			res.redirect('/entriesList')
		}
	})
}

// 获取消息列表, 并展示消息列表
exports.list = (req, res, next) => {
	Entry.getRange(0, -1, (err, entries) => {
		if (err) return next(err)
		res.render('entries', {
			title: 'Entries',
			entries: entries
		})
	})
}

exports.form = (req, res, next) => {
  res.render('post', { title: 'post' });
};

// module.exports = router