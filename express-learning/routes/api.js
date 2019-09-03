
/*
 * Ps: api授权
 * BasicAuth 通过检查 Headers 中的 Authorization 其中携带的 username 和 password
 * 解析header失败则返回undefined， 未通过认证则返回 401/403状态码 表示客户没有携带正确的认证信息
 * 之前用的axios传参中Authorization没有携带认证信息，所以导致auth(req)返回undefined错误
*/

const auth = require('basic-auth');
const express = require('express');
const User = require('../models/user');
const Entry = require('../models/entry')

exports.auth = (req, res, next) => {
  const { name, pass } = auth(req);
  User.authenticate(name, pass, (err, user) => {
    // auth(req) 解析出的用户名密码通过认证后，将用户信息同步到req中
    if (user) req.remoteUser = user;
    next(err);
  })
}

exports.user = (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if (err) return next (err);
    if (!user.id) return res.status(404);
    res.json(user);
  })
}

// 内容协商
exports.entries = (req, res, next) => {
  const page = req.page;
  Entry.getRange(page.form, page.to, (err, entries) => {
		if (err) return next(err);
		res.format({
      json: () => {
        res.send(entries)
      },
      xml: () => {
        res.write('<entries>/n');
        entries.forEach(() => {
          res.write(`
          <entry>
            <title>${entry.title}</title>
            <body>${entry.body}</body>
            <username>${entry.username}</username>
          </entry>
          `)
        })
        res.end('</entries>');
      }
    })
	})
}

// 分页消息
exports.page = (req, res, next) => {
	const page = req.page;
	Entry.getRange(page.form, page.to, (err, entries) => {
		if (err) return next(err);
		res.json(entries);
	})
}