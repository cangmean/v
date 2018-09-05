var uid = 0

/**
 * Dep是发布订阅模式中的中间层， 当有数据变化的时候通知所有订阅者(观察者)
 */
class Dep {
  static target = null

  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  depend() {
    Dep.target.addDep(this)
  }

  removeSub(sub) {
    let index = this.subs.indexOf(sub)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

/**
 * 对数据来说是观察者， 观察数据变化
 * 对节点来说是发布者， 通知变化
 */
class Observer {
  constructor(data) {
    this.data = data
    this.walk()
  }

  /**
   * 遍历所有属性，并监听
   */
  walk() {
    Object.keys(this.data).forEach(key => {
      this.defineReactive(key, this.data[key])
    })
  }

  defineReactive(key, val) {
    // 每个属性都用一个中间层
    const dep = new Dep()
    let ob = observe(val)
    Object.defineProperty(this.data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 全局变量，只是设置在Dep中而已， 是监听当前属性的watcher
        // 如果watcher没有注册在dep中，就添加进去
        if (Dep.target) {
          dep.depend()
        }
        return val
      },
      set(newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        ob = observe(newVal)
        // 通知订阅者(watcher)更新
        dep.notify()
      }
    })
  }
}

/**
 * 工厂函数, 只监听对象属性
 */
const observe = data => {
  if (!data || typeof data !== 'object') {
    return
  }
  return new Observer(data)
}

export { observe, Dep }
