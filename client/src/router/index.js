import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import header from '@/components/header'
import register from '@/components/register'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        content: home,
        header: header
      },
      props: { choice: 'home' }
    },
    {
      path: '/register',
      name: 'register',
      components: {
        header: header,
        content: register
      },
      props: { choice: 'register' }
    }
  ]
})
