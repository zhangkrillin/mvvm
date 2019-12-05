//new MVVM({data:{name:'kobe'}}...)
class MVVM {
  constructor(options) {
    //将数据挂载在实例上
    this.$el = options.el
    this.$data = options.data
    //模板存在就开始编译
    if (this.$el) {
      new Observer(this.$data)
      this.proxyData(this.$data)
      new Compile(this.$el, this)
    }
  }
  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          data[key] = newVal
        }
      })
    })
  }
}