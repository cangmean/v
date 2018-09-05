import { watcher } from './watcher'

class Compile {
  constructor(el, vm) {
    this.vm = vm
    this.el = document.querySelector(el)
    this.init()
  }

  /**
   * 初始化，对需要vue渲染的部分进行解析，监听事件，数据绑定等操作
   */
  init() {
    this.fragment = this.nodeToFragment(this.el)
    this.compileElement(this.fragment)
    this.el.appendChild(this.fragment)
  }

  /**
   * 将节点转移到fragment中
   * @param {Node} el
   */
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild

    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }

  /**
   * 对fragment对象进行编译
   * @param {Fragment} el
   */
  compileElement(el) {
    const childNodes = el.childNodes
    // 循环子节点，进行编译
    Array.prototype.slice.call(childNodes).forEach(node => {
      const reg = /\{\{(.*)\}\}/
      const text = node.textContent
      if (CompileUtil.isNode(node)) {
        this.compileNode(node)
      } else if (CompileUtil.isNodeText(node) && reg.test(text)) {
        this.compileNodeText(node, reg.exec(text)[1])
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }

  /**
   * 编译节点
   * @param {Node} node
   */
  compileNode(node) {
    const attrs = node.attributes
    Object.values(attrs).forEach(attr => {
      let name = attr.name
      if (CompileUtil.isDirective(name)) {
        const exp = attr.value.trim()
        const dir = name.substring(2)
        if (CompileUtil.isEventDirective(dir)) {
          this.compileEvent(node, exp, dir)
        } else {
          this.compileDirective(node, exp, dir)
        }

        node.removeAttribute(name)
      }
    })
  }

  /**
   * 编译模板字符串
   * @param {Node} node
   */
  compileNodeText(node, exp) {
    CompileUtil.text(this.vm, node, exp.trim())
  }

  compileEvent(node, exp, dir) {
    CompileUtil.event(this.vm, node, exp, dir)
  }

  /**
   * 编译指令
   */
  compileDirective(node, exp, dir) {
    CompileUtil[dir] && CompileUtil[dir](this.vm, node, exp)
  }
}

/**
 * 关于节点的更新操作
 */
class Updater {
  static text(node, val) {
    node.textContent = val || ''
  }

  static model(node, val) {
    node.value = val || ''
  }
}

/**
 * 编译Dom工具类
 */
class CompileUtil {
  static updater = Updater
  /**
   * 是否是document节点
   * @param {Node} node
   */
  static isNode(node) {
    return node.nodeType === 1
  }

  /**
   * 是否是文本
   * @param {Node}} node
   */
  static isNodeText(node) {
    return node.nodeType === 3
  }

  /**
   * 该属性是否是vue指令
   * @param {String} name 属性名
   */
  static isDirective(name) {
    return name.startsWith('v-')
  }

  /**
   * 该属性是否是vue事件
   * @param {String} name
   */
  static isEventDirective(name) {
    return name.startsWith('on')
  }

  /**
   * 处理事件
   */
  static event(vm, node, exp, dir) {
    const eventType = dir.split(':')[1]
    const fn = vm.$options.methods && vm.$options.methods[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  }

  /**
   * 绑定监听
   * @param {Vue} vm Vue实例
   * @param {Node} node 节点
   * @param {String} exp 表达式
   * @param {String} dir 指令
   */
  static bind(vm, node, exp, dir) {
    const fn = this.updater[dir]
    const value = vm[exp]

    fn && fn(node, value)

    // 监听
    watcher(vm, exp, val => {
      fn && fn(node, val)
    })
  }

  static text(vm, node, exp) {
    this.bind(vm, node, exp, 'text')
  }

  static model(vm, node, exp) {
    this.bind(vm, node, exp, 'model')

    let oldVal = vm[exp]
    node.addEventListener(
      'input',
      function(e) {
        const newVal = e.target.value
        if (oldVal === newVal) {
          return
        }
        vm[exp] = newVal
        oldVal = newVal
      },
      false
    )
  }
}

export const compile = (el, vm) => {
  return new Compile(el, vm)
}
