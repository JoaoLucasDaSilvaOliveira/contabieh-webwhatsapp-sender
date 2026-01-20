import { createRouter, createMemoryHistory } from 'vue-router' // Mude para createMemoryHistory
import HomePageView from '@/components/HomePageView.vue'

const router = createRouter({
  history: createMemoryHistory(), // Histórico em memória, não na URL
  routes: [
    {path: "/", component: HomePageView}
  ],
})

// Mantenha seu guard se necessário, mas memory history geralmente não precisa disso
router.beforeEach((to, from, next)=>{
  if (to.path !== "/"){
    next({path: "/"});
  } else {
    next()
  }
})

export default router