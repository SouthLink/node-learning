/*
 * Ps: 校验程序中间件
 *
 *
 */

// 校验输入是否有值
exports.required = (field) => {
  field = parseField(field)
  return (req, res, next) => {
    // 每次收到请求都检查输入域是否有值
    if (getField(req, res, field)) {
      // 如果有，则进入下一个中间件
      next()
    } else {
      // 如果没有，显示错误
      res.status(500).send(`${field.join(' ')} is required`);
      // res.redirect('back')
    }
  }
}

// 校验输入长度
exports.lengthAbove = (field, len) => {
  field = parseField(field)
  return (req, res, next) => {
    if (getField(req, res, field).length > len) {
      next()
    } else {
      // console.log(res)
      const fields = field.join(' ');
      res.status(500).send(`${fields} must have more than ${len} characters`, 'error');
      // res.redirect('back');
    }
  }
}




// 解析entry[name]符号
function parseField(field) {
  return field
    .split(/\[|\]/)
    .filter((s) => s);
}

// 基于parserField查找属性
function getField(req, res, field) {
  // console.log(req.body)
  let val = req.body;
  field.forEach((prop) => {
    val = val[prop]
  })

  return val
}