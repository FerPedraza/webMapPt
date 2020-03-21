import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import firebase from 'firebase/app';
import 'firebase/firestore'
import VueFirestore from 'vue-firestore'
import Vuex from 'vuex'
import store from './store'
import VCalendar from 'v-calendar';
//import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';

//Vue.use(ElementUI);
Vue.use(VCalendar);
Vue.use(Vuex)
Vue.use(VueFirestore)
Vue.use(BootstrapVue)
Vue.config.productionTip = false
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAczRjFscIwPU3ojp0eKiYcRegvjiv9AV4",
  authDomain: "capitalrouteapp.firebaseapp.com",
  databaseURL: "https://capitalrouteapp.firebaseio.com",
  projectId: "capitalrouteapp",
  storageBucket: "capitalrouteapp.appspot.com",
  messagingSenderId: "322747008476",
  appId: "1:322747008476:web:184efaaaf42f975afbfb19"
});
export const db = firebaseApp.firestore()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')