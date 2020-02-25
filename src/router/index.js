import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Inicio from '../components/Inicio.vue'
import Registro from '../components/Registro.vue'
import RecuperarCuenta from '../components/RecuperarCuenta.vue'
import 'es6-promise/auto'
import Vuex from 'vuex'


Vue.use(Vuex)
Vue.use(VueRouter)

const routes = [
  {
    path:'*',
    redirect:'/login'
  },
  {
    path : '/login',
    name : 'login',
    component : Login
  },
  {
    path : '/inicio',
    name : 'inicio',
    component : Inicio
  },
  {
    path : '/registro',
    name : 'registro',
    component : Registro
  },
  {
    path : '/recuperarcuenta',
    name : 'recuperar cuenta',
    component : RecuperarCuenta
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
