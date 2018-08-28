import { isFunc } from './utils'
import { observe } from './observer'
import { compile } from './compile'

class V {
  constructor(options) {
    this.$options = options
    this.callHook('beforeCreate')
    if (this.$options.data) {
      this.initData(this.$options.data)
    }

    this.render()
    this.callHook('mounted')
  }

  initData(data) {
    if (isFunc(data)) {
      data = data()
    }
    // 代理数据
    Object.keys(data).forEach(key => {
      this.proxy(key)
    })
    observe(data)
    this.$data = data
  }

  render() {
    compile(this)
  }

  proxy(key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get() {
        return this.data[key]
      },
      set(val) {
        this.data[key] = val
      }
    })
  }

  callHook(hook) {
    const fn = this.$options[hook]
    if (fn) {
      fn()
    }
  }
}
