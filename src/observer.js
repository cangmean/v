class Dep {
  static target = null

  constructor() {
    this.obs = []
  }

  add(ob) {
    this.obs.push(ob)
  }

  remove(ob) {
    const idx = this.obs.indexOf(ob)
    if (idx > -1) {
      this.obs.splice(idx, 1)
    }
  }

  notify() {
    this.obs.forEach(ob => {
      ob.notify()
    })
  }
}

class Observer {
  constructor(data) {
    this.data = data
    this.walk()
  }

  walk() {
    Object.keys(this.data).forEach(key => {
      this.defineReactive(key, this.data[key])
    })
  }

  defineReactive(key, val) {
    const dep = new Dep()
    const ob = observe(val)
    Object.defineProperty(this.data, key, {
      enumerable: true,
      configurable: true,
      get() {
        return val
      },
      set(newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        dep.notify()
        observe(val)
      }
    })
  }
}

const observe = data => {
  return new Observer(data)
}

export { observe, Dep }
