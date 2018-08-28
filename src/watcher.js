import { Dep } from './observer'

class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.get()
  }

  get() {
    Dep.target = this
    const val = this.vm.data[this.exp.trim()]
    Dep.target = null
    return val
  }

  update() {
    const newVal = this.vm.data[this.exp.trim()]
    if (this.value !== newVal) {
      this.value = newVal
      this.cb.call(this.vm, newVal)
    }
  }
}

export const warcher = (vm, exp, cb) => {
  return new Watcher(vm, exp, cb)
}
