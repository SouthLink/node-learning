// 闭包

function asyncFunction(callback) {
  setTimeout(callback, 200)
}

let color = 'blue';

(function(color) {
  asyncFunction(() => {
    console.log(`The color is ${color}`)
  })
})(color)

color = 'green';