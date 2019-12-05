class Observer {
  constructor(data) {
    this.observe(data)
  }
  observe(data) {
    if (!data || typeof data !== "object") {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]) //数据劫持
    })
  }
  defineReactive(obj, key, value) {
    this.observe(value)
    let that = this
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        Dep.target && dep.addSubs(Dep.target)
        return value
      },
      set(newVal) {
        if (value === newVal) {
          return
        }
        that.observe(newVal) //如果是对象就继续劫持
        value = newVal
        dep.notify() //通知更新
      }
    })
  }
}
class Dep {
  constructor() {
    this.subs = []
  }
  addSubs(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}