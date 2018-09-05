import { isFunc } from './utils'
import { observe } from './observer'
import { compile } from './compile'

class V {
  constructor(options) {
    this.$options = options
    this.$data = options.data
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

    // 监听数据变化
    observe(data)
  }

  /**
   * 编译渲染
   */
  render() {
    compile(this.$options.el, this)
  }

  /**
   * 代理数据
   * 原本需要 vm.$data[key] 访问的数据， 可以使用 vm[key] 访问
   * 原本需要 vm.$data[key] = val 设置的数据， 可以使用 vm[key] = val 设置
   * @param {String} key
   */
  proxy(key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      get() {
        return this.$data[key]
      },
      set(val) {
        this.$data[key] = val
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

export default V
