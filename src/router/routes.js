const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/Empty.vue'),
  //   children: [{
  //     path: '',
  //     component: () => import('pages/Login.vue')
  //   }]
  // },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '/', component: () => import('pages/Main.vue')},
      {path: '/accounting', component: () => import('pages/Accounting.vue')},
      {path: '/dashboard-grid', component: () => import('pages/DashboardGrid.vue')},
      {path: '/products/:id', name: 'products', component: () => import('pages/ProductsList.vue'), props: true },
      {path: '/products-buy/:id', name: 'products-buy', component: () => import('pages/ProductsBuy.vue'), props: true },
      {path: '/producers', component: () => import('pages/ProducersList.vue')},
      {path: '/customers', component: () => import('pages/CustomersList.vue')},

    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
