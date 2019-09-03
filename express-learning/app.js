// plugin
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const createError = require('http-errors');
const logger = require('morgan');
const session = require('express-session');

// routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const entriesRouter = require('./routes/entries');
const registerRouter = require('./routes/register');
const loginRoter = require('./routes/login');

// models
const Entry = require('./models/entry');

// api
const apiAuth = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//// middleware
const validate = require('./middleware/validate');
const message = require('./middleware/messages');
const userMiddleware = require('./middleware/user');
const pageMiddleware = require('./middleware/page');


// 输出有颜色区分的日志，以便于开发调试
app.use(logger('dev'));
// 解析请求主体
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 决定格式，formdata or json
app.use(cookieParser());
app.use(methodOverride());
// 提供./public 下 的静态文件
app.use(express.static(path.join(__dirname, 'public')));

// session plugin , after cookie
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

// 只要请求的路径以挂载点开头，就会触发这个中间件
app.use('/api', apiAuth.auth)
// 要把 express.static 放到它上面。否则每次返回静态文件时，都会浪费时间到数据 库中取用户数据
// 要放在session之后，每个每次都要从session去取uid
app.use(userMiddleware)
app.use(message)

// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/entriesRouter', entriesRouter);

// entries router
app.get('/post', entriesRouter.form);
// express 吧传入的参数/中间件，当Generator函数处理，顾名思义中间件就相当于管道, 通过调用next函数来通往下一个管道
app.post('/post',
    validate.required('entry[title]'),
    validate.lengthAbove('entry[title]', 4),
    entriesRouter.submit);
app.get('/entriesList', entriesRouter.list);

// register router
app.get('/register', registerRouter.form);
app.post('/register', registerRouter.submit);

// login router
app.get('/login', loginRoter.form);
app.get('/logout', loginRoter.logout);
app.post('/login', loginRoter.submit);

// api router
app.get('/api/user/:id', apiAuth.user);
app.get('/api/entry/:page?', pageMiddleware(Entry.count), apiAuth.entries);
app.post('/api/entry', entriesRouter.submit);

// catch 404 and forward to error handler 在开发时显示样式化 的 HTML 错误页面, 必须放在router 的后面，不然会先执行404
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development 在开发时显示样式化 的 HTML 错误页面
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// const User = require('./models/user');
// const user = new User({ name: 'Example', pass: 'test'});

// user.save(err => {
// 	if (err) console.log(err)
// 	console.log('user id %d', user.id)
// })

// User.getByName('Example', (err, user) => {
//   console.log(user);
// });



module.exports = app;