const async = require('async')

// 串行
async.series([
  callback => {
    setTimeout(() => {
      console.log('I execute first1')
      callback()
    }, 200)
  },
  callback => {
    setTimeout(() => {
      console.log('I execute first2')
      callback()
    }, 200)
  },
  callback => {
    setTimeout(() => {
      console.log('I execute first3')
    }, 200)
  },
])