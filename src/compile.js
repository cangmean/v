import { watcher } from './watcher'

class Compile {
  constructor(vm) {
    this.vm = vm
    this.el = document.querySelector(vm.$options.el)
    this.fragment = this.nodeToFragment(this.el)
  }

  /**
   * 将极爱的那转移到fragment中
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

  compileElement(el) {
    const childNodes = el.childNodes

    Array.slice.call(childNodes).forEach(node => {
      const reg = /\{\{(.*)\}\}/
      const text = node.textContent

      if (this.isNode(node)) {
        this.compileNode(node)
      } else if (this.isNodeText(node) && reg.test(text)) {
        this.compileNodeText(node)
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
  }

  /**
   * 编译模板字符串
   * @param {String} node
   */
  compileNodeText(node, exp) {
    const value = this.vm[exp.trim()]
    node.textContent = value
    watcher(this.vm, exp, val => {
      node.textContent = val
    })
  }

  isNode(node) {
    return node.nodeType === 1
  }

  isNodeText(node) {
    return node.nodeType === 3
  }
}

export const compile = vm => {
  return new Compile(vm)
}
