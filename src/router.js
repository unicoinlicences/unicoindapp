import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'

//pages
import Home from './views/Home.vue'
import UserProfile from './views/UserProfile.vue'
import CreateProfile from './views/CreateProfile.vue'
import BrowsePublications from './views/BrowsePublications.vue'
import ListPublication from './views/ListPublication.vue'
import ManagePublications from './views/ManagePublications.vue'
import MyBids from './views/MyBids.vue'
import MyLicenses from './views/MyLicenses.vue'
import TermsOfService from './views/TermsOfService.vue'
import ContactUs from './views/ContactUs.vue'



Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'UniCoin - Home',
      component: Home,
      meta: {
        accountNeeded: false
      }
    },
    {
      path: '/Profile',
      name: 'UniCoin - Profile',
      component: UserProfile,
      meta: {
        accountNeeded: true
      }
    },
    {
      path: '/CreateProfile',
      name: 'UniCoin - Create Profile',
      component: CreateProfile,
      meta: {
        accountNeeded: false
      }
    },
    {
      path: '/BrowsePublications',
      name: 'UniCoin - Browse Publications',
      component: BrowsePublications,
      meta: {
        accountNeeded: false
      }
    },
    {
      path: '/ListPublication',
      name: 'UniCoin - List new Publication',
      component: ListPublication,
      meta: {
        accountNeeded: true
      }
    },
    {
      path: '/ManagePublications',
      name: 'UniCoin - Manage Publications',
      component: ManagePublications,
      meta: {
        accountNeeded: true
      }
    },
    {
      path: '/MyBids',
      name: 'UniCoin - Manage Bids',
      component: MyBids,
      meta: {
        accountNeeded: true
      }
    },
    {
      path: '/MyLicenses',
      name: 'UniCoin - Manage Licences',
      component: MyLicenses,
      meta: {
        accountNeeded: true
      }
    },
    {
      path: '/TermsOfService',
      name: 'UniCoin - Terms of Use',
      component: TermsOfService,
      meta: {
        accountNeeded: false
      }
    },
    {
      path: '/ContactUs',
      name: 'UniCoin - Contact Us',
      component: ContactUs,
      meta: {
        accountNeeded: false
      }
    },
  ]
})

// router.beforeEach((to, from, next) => {
//   console.log("router")
//   console.log(to.meta.accountNeeded)
//   let pageNeedsAccount = to.meta.accountNeeded
//   console.log(store.state.userNumber)

//   if (pageNeedsAccount && store.state.userNumber == 0) {
//     window.location.href = "/CreateProfile?newUser=true"
//   }
//   next()
// })

export default router