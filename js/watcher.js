//对比新值和老值
class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.get() //获取老值
  }
  get() {
    Dep.target = this
    let oldValue = this.getVal(this.vm, this.exp)
    Dep.target = null
    return oldValue
  }
  getVal(vm, exp) {
    exp = exp.split('.') //[msg,a,b]
    return exp.reduce((prev, next) => {
      return prev[next]
    }, vm.$data)
  }
  //对外暴露的方法
  update() {
    let newValue = this.getVal(this.vm, this.exp)
    let oldValue = this.value
    if (newValue != oldValue) {
      this.cb(newValue)
    }
  }
}