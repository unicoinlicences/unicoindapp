import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import UserProfile from './views/UserProfile.vue'
import CreateProfile from './views/CreateProfile.vue'
import BrowsePublications from './views/BrowsePublications.vue'
import ListPublication from './views/ListPublication.vue'
import ManagePublications from './views/ManagePublications.vue'
import MyBids from './views/MyBids.vue'
import MyLicenses from './views/MyLicenses.vue'
import TermsOfService from './views/TermsOfService.vue'


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
      path: '/Profile',
      name: 'UniCoin - Profile',
      component: UserProfile
    },
    {
      path: '/CreateProfile',
      name: 'UniCoin - Create Profile',
      component: CreateProfile
    },
    {
      path: '/BrowsePublications',
      name: 'UniCoin - Browse Publications',
      component: BrowsePublications
    },
    {
      path: '/ListPublication',
      name: 'UniCoin - List new Publication',
      component: ListPublication
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
    {
      path: '/TermsOfService',
      name: 'UniCoin - Terms of Use',
      component: TermsOfService
    },
  ]
})