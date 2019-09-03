const User = require('../models/user')

// 登录页面
exports.form = (req, res) => {
  res.render('login', {title: 'Login'})
}

// 登陆
exports.submit = (req, res, next) => {
  const data = req.body.user;
  User.authenticate(data.name, data.pass, (err, user) => {
    if (err) next (err);
    if (user) {
      // 为认证存储uid
      req.session.uid = user.id;
      res.redirect('/')
    } else {
      // 认证失败输出错误
      res.error('Sorry! invalid credentials. ');
      res.redirect('back');
    }
  })
}

// 登出
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/')
  })
}