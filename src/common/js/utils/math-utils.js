let $math = require('mathjs');
export default {
  //加法
  add() {
    return comp('add', arguments)
  },
  //减法
  subtract() {
    return comp('subtract', arguments)
  },
  //乘法
  multiply() {
    return comp('multiply', arguments)
  },
  //除法
  divide() {
    return comp('divide', arguments)
  },
}

function comp(_func, args) {
  let t = $math.chain($math.bignumber(args[0]));
  for (let i=1; i<args.length; i++) {
    t = t[_func]($math.bignumber(args[i]))
  }
  // 防止超过6位使用科学计数法
  return parseFloat(t.done())
}

// 用法 mathUtils.math.add(0.1, 0.2, 0.5)