const User = require('../models/user')

exports.form = (req, res) => {
  res.render('register', { title: 'Register' });
};

// 用户注册
exports.submit = (req, res, next) => {
  const data = req.body.user;
  User.getByName(data.name, (err, user) => {
    if (err) return next(err);
    // 检查用户名是否唯一
    if (user.id) {
      res.error('用户名已经被占用')
      res.redirect('back');
    } else {
      // 创建用户
      user = new User({
        name: data.name,
        pass: data.pass
      })

      // 保存新用户， 这里我开始犯了一个错误，user.save在redirect('back')后调用，导致连续调用两次redirect
      // 由于已经发送了一次请求，因此它无法向同一请求发送另一个响应，所以会报 throw new ERR_HTTP_HEADERS_SENT('set')
      user.save((err) => {
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect('/')
      })
    }
    

  })
}

