class Compile {
  constructor(el, vm) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    this.$vm = vm
    //判断元素是否存在,有就开始模板编译
    if (this.$el) {
      //把这些真实dom移入到fragment中
      this.$fragment = this.node2Fragment(this.$el)
      //编译 v-model {{name}} 元素节点和文本节点指令
      this.compile(this.$fragment)
      //渲染到界面
      this.$el.appendChild(this.$fragment)
    }
  }
  node2Fragment(el) {
    let fragment = document.createDocumentFragment()
    let child = null
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  compile(node) {
    let childNodes = node.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {//是否是元素节点,
        this.compileElement(node)
      } else if (this.isTextNode(node)) {
        this.compileText(node)
      }
      //深层次递归
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    })
  }
  compileElement(node) {
    //得到v-model
    let attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      let name = attr.name
      if (this.isDirective(name)) {
        let exp = attr.value
        let dir = name.substring(2)
        //console.log(dir, this.$vm.$data[exp]);
        compileUtil[dir](node, this.$vm, exp)
      }
    })
  }
  compileText(node) {
    let txt = node.textContent
    let reg = /\{\{(.*)\}\}/g
    if (reg.test(txt)) {
      compileUtil['text'](node, this.$vm, txt)
    }
  }
  //判断是否为元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  //判断是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  //是否为指令
  isDirective(attr) {
    return attr.indexOf('v-') == 0
  }
}
compileUtil = {
  getTextVal(vm, exp) {
    return exp.replace(/\{\{(.+?)\}\}/g, (_, arg) => {
      return this.getVal(vm, arg)
    })
  },
  getVal(vm, exp) {
    exp = exp.split('.') //[msg,a,b]
    return exp.reduce((prev, next) => {
      return prev[next]
    }, vm.$data)
  },
  setVal(vm, exp, value) {
    exp = exp.split('.')
    return exp.reduce((prev, next, index) => {
      if (index === exp.length - 1) {
        return prev[next] = value
      }
      return prev[next]
    }, vm.$data)
  },
  model(node, vm, exp) {
    let updataFn = this.updater['modelUpdater']
    //监控数据变化,应该调用watcher的callback
    new Watcher(vm, exp, (newVal) => {
      //当值变化后调用callback
      updataFn && updataFn(node, this.getVal(vm, exp))
    })
    node.addEventListener('input', (e) => {
      let newVal = e.target.value
      this.setVal(vm, exp, newVal)
    })
    updataFn && updataFn(node, this.getVal(vm, exp))
  },
  text(node, vm, exp) {
    let updataFn = this.updater['textUpdater']
    let value = this.getTextVal(vm, exp)
    exp.replace(/\{\{(.+?)\}\}/g, (_, arg) => {
      new Watcher(vm, arg, (newVal) => {
        updataFn && updataFn(node, this.getTextVal(vm, exp))
      })
    })
    updataFn && updataFn(node, value)
  },
  updater: {
    //文本更新
    textUpdater(node, value) {
      node.textContent = value
    },
    modelUpdater(node, value) {
      node.value = value
    }
  }

}