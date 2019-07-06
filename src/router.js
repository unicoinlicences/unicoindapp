import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import BrowsePublications from './views/BrowsePublications.vue'
import ManagePublications from './views/ManagePublications.vue'
import MyBids from './views/MyBids.vue'
import MyLicenses from './views/MyLicenses.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'UniCoin - Home',
      component: Home
    },
    {
      path: '/BrowsePublications',
      name: 'UniCoin - Browse Publications',
      component: BrowsePublications
    },
    {
      path: '/ManagePublications',
      name: 'UniCoin - Manage Publications',
      component: ManagePublications
    },
    {
      path: '/MyBids',
      name: 'UniCoin - Manage Bids',
      component: MyBids
    },
    {
      path: '/MyLicenses',
      name: 'UniCoin - Manage Licences',
      component: MyLicenses
    },
  ]
})