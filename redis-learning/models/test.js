const assert = require('assert');
const Todo = require('./todo');
const todo = new Todo();

let testsCompleted = 0;

// 如果程序出了问题，则会有异常抛出。如果 todo.length 不是0，那么这个断言会在栈跟踪中显示一条错误消息，在控制台中输出“No items should exist”。
function deleteTest() {
  todo.add('Delete Me')
  console.log(todo)
  assert.equal(todo.length, 1, '1 item should exist');
  todo.deleteAll();
  assert.equal(todo.length, 0, 'No item should exist');
  testsCompleted++
}

// 当程序产生特定的值表明逻辑有问题时，可以采用这 种断言
function addTest() {
  todo.deleteAll();
  todo.add('Added');
  assert.notEqual(todo.getCount(), 0, '1 item should exist');
  testsCompleted++;
}

// 因为是异步测试，所以要提供一个回调函 数(cb)，向测试运行者发送测试结束的信号
function doAsyncTest(cb) {
  todo.doAsync(value => {
    assert.ok(value, 'Callback should be passed true');
    testsCompleted++;
    cb();
  });
}

// assert 模块还可以检查程序抛出的错误消息是否正确，代码如下所示。throws 调用中的第 二个参数是一个正则表达式，表示要在错误消息中查找文本 requires。
function throwsTest(cb) {
  assert.throws(todo.add, /requires/);
  testsCompleted++;
}

deleteTest();
addTest();
throwsTest();
doAsyncTest(() => {
  console.log(`Completed ${testsCompleted} tests`);
});