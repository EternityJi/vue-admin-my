import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import User from '@/components/User'
import Role from '@/components/author/Role'
import DataList from '@/components/DataList'
import DemoList from '@/components/DemoList'
import error from '@/components/error/401'
import categories from '@/components/categories'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'Login',
    component: Login,
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/users',
        name: 'User',
        component: User
      },
      {
        path: '/roles',
        name: 'Role',
        component: Role
      },
      {
        path: '/categories',
        name: 'categories',
        component: categories
      },
      {
        path: '/reports',
        name: 'DataList',
        component: DataList
      },
      {
        path: '/DemoList',
        name: 'DemoList',
        component: DemoList
      },
      {
        path: '*',
        redirect: '/404'
      },
      {
        path: '/error/401',
        name: 'error',
        component: error
      }
    ]
  }
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  var token = JSON.parse(localStorage.getItem('userInfo'))
  const menusList = JSON.parse(localStorage.getItem('menusList'))
  console.log(token)
  console.log(menusList)
  if (to.path === '/login' || token) {
    next()
    // if (menusList) {
    //   // var isPermission = false
    //   menusList.forEach(l1 => {
    //     // console.log(l1.path)
    //     l1.children.forEach(l2 => {
    //       console.log(l2.path)
    //       // if (l2.path === to.fullPath) {
    //       //   isPermission = true
    //       //   console.log(l2.path)
    //       // }
    //     })
    //   })
    //   // if (!isPermission) {
    //   //   next({path: '/error/401', replace: true})
    //   // } else {
    //   //   next()
    //   // }
    // }
  } else {
    next('/login')
  }
})
// router.beforeEach((to, form, next) => {
//   var isPermission = false
//   const menusList = JSON.parse(localStorage.getItem('menusList'))
//   menusList.forEach(item => {
//     if (item.path === to.fullPath) {
//       isPermission = true
//     }
//   })
//   if (!isPermission) {
//     next({path: '/error/401', replace: true})
//   } else {
//     next()
//   }
// })
export default router
