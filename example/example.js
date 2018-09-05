import V from '../src/index'

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
