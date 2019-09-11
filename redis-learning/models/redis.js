
const redis = require('redis');
const db = redis.createClient();


// redis event 

db.on('connect', () => {
	console.log('redis client connected to server')
})

db.on('ready', () => {
	console.log('redis server is reading')
})

db.on('error', (err) => {
 	console.error('redis error', err)
})

// redis key/value

db.set('color', 'red', err => {
	if (err) throw err
})

db.get('color', (err, value) => {
	console.log(value)
})

// detection key

db.exists('users', (err, doesExist) => {
	if (err) throw err;
	console.log('users exists:', doesExist)
})

// 默认情况下，在写入时会将键和值强制转换成字符串。比如说，如果设定某个键的值是数字，那么在读取这条记录时，得到的值将会是个字符串:
// 如果值是包含多个值的数组，那么客户端会报一个很神秘的错误，即“ReplyError:ERR syntaxerror”
db.set('users', ['Alice', 'Bob'], redis.print);


// 散列表 (是键/值对的数据集)
// 设定散列表 存储多个键/值对
db.hmset('camping', {
	shelter: '2-person tent',
	cooking: 'campstove',
}, redis.print)

// 获取“camping.cooking”的值
db.hget('camping', 'cooking', (err, value) => {
	if (err) throw err;
	console.log('v', value)  // campstove
})

// 以数组形式 获取散列键
db.hkeys('camping', (err, keys) => {
	if (err) throw err;
	keys.forEach(key => console.log(`${key}`))   // shelter cooking
})


// 列表 （包含字符串值的有序数据集） 列表在概念上跟数组类似，最好当作栈(LIFO:后进先出)或队列(FIFO:先进先出)来用
// 列表既没有提供确定某个值是否存在其中的办法，也没有提供确定某个值的索引的办法。我 们只能通过手动遍历获取这些信息，但做这件事效率很低，应该尽量避免。

db.lpush('tasks', 'Paint the bikeshed red.', redis.print)
db.lpush('tasks', 'Paint the bikeshed green.', redis.print);
db.lrange('tasks', 0, -1, (err, items) => {
  if (err) throw err;
  items.forEach(item => console.log(`  ${item}`));
});

// 集合 无序数据集，其中不允许有重复值。集合是一种高性能的数据结构，检查成员、添加和移除记录都可以在 O(1) 时间内完成，所以其非常适合对性能要求比较高的任务

db.sadd('admins', 'Alice', redis.print)
db.sadd('admins', 'Bob', redis.print);
db.sadd('admins', 'Alice', redis.print);
db.smembers('admins', (err, members) => {
  console.log(members);
});








