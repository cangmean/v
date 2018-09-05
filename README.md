# v

学习 webpack 配置, vue 原理 ([参考地址](https://github.com/DMQ/mvvm))

### vue 中的双向数据绑定

vue 中通过`Object.defineProperty` 属性来监听数据的变化， dep 管理订阅者 watcher

- observer 观察者，监听数据的变化。对于 watcher 来说是发布者
- dep 中间层，收集订阅者
- watcher 观察者，注册监听属性变化
- compile 编译节点，解析指令， 监听事件和属性

**流程**

首先我们会在页面中定义 vue 渲染的部分

```html
<div id="app">
  <p>{{ name }}</p>
  <div>
    <input type="text" v-model="name">
    <button v-on:click="clickA">clickA</button>
  </div>
</div>
```

```js
new V({
  el: '#app',
  data: {
    name: ''
  },
  methods: {
    clickA() {
      console.log('click A')
    }
  }
})
```

Vue 实例循环`#app`和他的子节点，并对`{{ name }}` 和 `v-`开头的指令进行解析，通过 watcher 订阅属性`name`。订阅时获取`name`值会触发 vue 实例的 get 方法，将 watcher 添加到 `name`属性的 dep 中。也就完成了 watcher 订阅 name 属性操作。当`name`值发生变化，触发 set 方法时，dep 通知所有订阅者，完成更新。

### 参考

本文内容都是通过阅读 https://github.com/DMQ/mvvm 来学习 vue 的双向绑定原理，如果想要了解详细的内容可以去查看。
