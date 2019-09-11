// plugin
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const createError = require('http-errors');
const logger = require('morgan');
const session = require('express-session');

// routers
// const indexRouter = require('./routes/index');

// models
const Redis = require('./models/redis');
const RedisSocket = require('./models/redis_socket');

// api
// const apiAuth = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// 输出有颜色区分的日志，以便于开发调试
app.use(logger('dev'));
// 解析请求主体
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 决定格式，formdata or json
app.use(cookieParser());
// 提供./public 下 的静态文件
app.use(express.static(path.join(__dirname, 'public')));




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



module.exports = app;