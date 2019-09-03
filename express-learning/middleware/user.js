
/*
 * Ps: 加载用户信息中间件
 *
 *
*/

const User = require('../models/user');

module.exports = (req, res, next) => {
  // 会话中取出已登录用户的ID
  if (req.remoteUser) {
    res.locals.user = req.remoteUser
  }
  const uid = req.session.uid;
  if (!uid) return next()

  User.get(uid, (err, user) => {
    if (err) return next(err);
    // 将用户数据输出到响应对象中
    req.user = res.locals.user = user;
    next()
  })

}