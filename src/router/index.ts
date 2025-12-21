import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from '@/components/HomePageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/", component: HomePageView}
  ],
})

router.beforeEach((to, from, next)=>{
  if (to.path !== "/"){
    next({path: "/"});
  } else {
    next()
  }
})

export default router
