// const canadianDollar = 0.91;

// function roundTwo(amount) {
// 	return Math.round(amount * 100) / 100
// }

// exports.canadianToUS = canadian => roundTwo(canadian * canadianDollar)
// exports.USToCanadian = us => roundTwo(us * canadianDollar)


class Currency {
  constructor(canadianDollar) {
    this.canadianDollar = canadianDollar
  }

  roundTwoDecimals(amount) {
    return Math.round(amount * 100) / 100
  }

  canadianToUS(canadian) {
    return this.roundTwoDecimals(canadian * this.canadianDollar)
  }

  USToCanadian(us) {
    return this.roundTwoDecimals(us * this.canadianDollar)
  }
}

// exports = new Currency(0.91)

// 这行代码不可用，从require中console.log我们可以看到，require进来的是一个空对象。
// 为什么返回的不是一个Currency类呢，因为node不允许export被重写
// 又因为export只是对module.export的全局引用，最初被定义为一个可以添加属性的空对象，所以我们看到返回的是一个 {}	
// 如果我们用exports.currency = new Currency(0.91)的方式导出，引用模块里要以currency.currency的方式来引用这个类，麻烦且没有必要

module.exports = new Currency(0.91)

// 为了让前面那个模块的代码能用，需要把 exports 换成 module.exports。
// 用 module. exports 可以对外提供单个变量、函数或者对象。
// 如果你创建了一个既有 exports 又有 module.exports 的模块，那它会返回 module.exports，而 exports 会被忽略。

// 最终在程序里导出的是 module.exports。exports 只是对 module.exports 的一个全 局引用，最初被定义为一个可以添加属性的空对象。
// exports.myFunc 只是 module.exports. myFunc 的简写。
// 所以，如果把 exports 设定为别的，就打破了 module.exports 和 exports 之间的引用 关系。
// 可是因为真正导出的是 module.exports，那样 exports 就不能用了，因为它不再指向 module.exports 了。
// 如果你想保留那个链接，可以像下面这样让 module.exports 再次引用 exports:
//      module.exports = exports = Currency;
// 根据需要使用 exports 或 module.exports 可以将功能组织成模块，规避掉程序脚本 一直增长所产生的弊端。