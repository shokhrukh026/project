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
      
      {path: '/producers', component: () => import('pages/Producers.vue')},
      {path: '/producer/products/:id', name: 'producer-products', component: () => import('pages/ProducerProducts.vue'), props: true },
      {path: '/producers/product/detail/:id', name: 'producer-product-detail', component: () => import('pages/ProducerProductDetail.vue'), props: true},
      {path: '/return', name: 'return', component: () => import('pages/Return.vue'), props: true},

      {path: '/customers', component: () => import('pages/Customers.vue')},
      {path: '/customer/products/:uid', name: 'customer-products', component: () => import('pages/CustomerProducts.vue'), props: true },
      {path: '/customers/product/detail/:id', name: 'customer-product-detail', component: () => import('pages/CustomerProductDetail.vue'), props: true},

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
