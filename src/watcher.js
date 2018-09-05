import { Dep } from './observer'

/**
 * 订阅者， 订阅节点数据变化
 * 订阅Vue实例的 expOrFn属性, 并触发cb回调
 */
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.depIds = {}

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = this.parseGetter(expOrFn)
    }
    // 获取监听属性的值
    this.value = this.get()
  }

  parseGetter(exp) {
    return function(obj) {
      return obj[exp]
    }
  }

  /**
   * Dept.target = this 只是把当前的订阅器添加到全局变量中
   * 当调用call获取属性是， 触发observe监听
   */
  get() {
    Dep.target = this
    const val = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return val
  }

  addDep(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }

  update() {
    const newVal = this.get()
    if (this.value !== newVal) {
      this.value = newVal
      this.cb.call(this.vm, newVal)
    }
  }
}

export const watcher = (vm, exp, cb) => {
  return new Watcher(vm, exp, cb)
}
