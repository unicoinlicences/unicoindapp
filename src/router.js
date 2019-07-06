import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import Create from './views/Create.vue'
// import Manage from './views/Manage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'UniCoin - Home',
      component: Home
    },
    // {
    //   path: '/create',
    //   name: 'UniCoin - Create',
    //   component: Create
    // },
    // {
    //   path: '/manage',
    //   name: 'UniCoin - Manage',
    //   component: Manage
    // },
  ]
})
