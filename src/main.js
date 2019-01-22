import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')

// document.querySelector('#app').addEventListener('click', () => {
//   import('./test.js').then(res => {
//     res.default()
//   })
// })
