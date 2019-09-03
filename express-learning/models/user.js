// redis user 用户模型类

const redis = require('redis');
const redisDB = redis.createClient();
const bcrypt = require('bcrypt');

class User {
  constructor(obj) {
    for (let x in obj) {
      this[x] = obj[x]
    }
  }

  // 根据名称查找用户ID
  static getByName(name, cb) {
    User.getId(name, (err, id) => {
      if (err) return cb(err)
      User.get(id, cb)
    })
  }

  // 名称查找用户ID
  static getId(name, cb) {
    redisDB.get(`user:id:${name}`, cb);
  }

  // 根据用户ID获取用户实例
  static get(id, cb) {
    // 获取普通对象哈希
    redisDB.hgetall(`user:${id}`, (err, user) => {
      if (err) return cb(err);
      // 将普通对象转换成 新的 User 对象
      cb(null, new User(user))
    })
  }

  // 用户名密码认证
  static authenticate(name, pass, cb) {
    // 通过用户名查找用户
    User.getByName(name, (err, user) => {
      if (err) return cb(err)
      // 用户不存在
      if (!user.id) return cb()
      // 加密比对
      bcrypt.hash(pass, user.salt, (err, cryptoPass) => {
        if (err) return cb(err)
        if (cryptoPass == user.pass) return cb(null, user)
        cb()
      })
    })
  }

  // res.json 返回规范定义
  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }

  // 保存用户
  save(cb) {
    // 如果设置了ID，则用户已经存在
    if (this.id) {
      this.update(cb);
    } else {
      // 创建唯一ID  incr: 为键key储存的数字值加上一,如果键key不存在,那么它的值会先被初始化为0,再执行Incr 
      redisDB.incr('user:ids', (err, id) => {
        if (err) return cb(err);
        this.id = id 
        this.hashPassword((err) => {
          if (err) return cb(err);
          this.update(cb);
        })
      })
    }
  }

  // 更新用户
  update(cb) {
    const id = this.id;
    redisDB.set(`user:id:${this.name}`, id, (err) => {
      if (err) return cb(err)
      // 用Redis存储当前类的属性 hmset: 同时将多个 field-value (域-值)对设置到哈希表 key 中
      redisDB.hmset(`user:${id}`, this, (err) => {
        cb(err)
      })
    })
  }

  // 创建加密密码, 进过哈希 加盐处理
  hashPassword(cb) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return cb(err)
      this.salt = salt
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return cb(err)
        this.pass = hash;
        cb();
      })
    })
  }

}

module.exports = User;