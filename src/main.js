import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')

console.log('好嗨哟11')
// document.querySelector('#app').addEventListener('click', () => {
//   import('./test.js').then(res => {
//     res.default()
//   })
// })
