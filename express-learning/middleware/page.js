// 分页中间件

module.exports = (cb, perpage) => {
  perpage = perpage || 10;
  // 返回中间件函数
  return (req, res, next) => {
    let page = Math.max(
      parseInt(req.params.page || '1', 10),
      1
    ) - 1;
    console.log(cb)
    console.log(perpage)
    cb((err, total) => {
      if (err) return next(err);
      req.page = res.locals.page = {
        number: page,
        perpage: perpage,
        from: page * perpage,
        to: page * perpage + perpage - 1,
        total: total,
        count: Math.ceil(total / perpage)
      }
    });
    next()
  }
}