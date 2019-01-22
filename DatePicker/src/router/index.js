import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/DatePicker'
    }, {
      path: '/DatePicker',
      name: 'DatePicker',
      component: () => import('@/components/DatePicker')
    }
  ]
})
