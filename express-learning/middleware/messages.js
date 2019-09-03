// 消息回话中间件

const express = require('express');

// 存储消息回话到session中
function message(req) {
  return (msg, type) => {
    type = type || 'info';
    let sess = req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({type: type, string: msg})
  }
} 

// 中间件
module.exports = (req, res, next) => {
  res.message = message(req);
  res.error = (msg) => {
    return res.message(msg, 'error');
  };
  res.locals.messages = req.session.messages || [];
  // 移除消息，避免消息堆积
  res.locals.removeMessages = () => {
    req.session.messages = [];
  };
  next();
}