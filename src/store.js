import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        puntoSeleccionado: {
            showPopup: false,
            lat: "",
            lng: "",
            nombreLugar: "",
        },
        delimitarAreaShowup: true,
        mostrarAreaShowup: false,
    },
    mutations: {    
        setPoint(state, point) {
            state.puntoSeleccionado.lat = point.lat
            state.puntoSeleccionado.lng = point.lng
            state.delimitarAreaShowup = point.showup
        },
        showupTrue(state){
            state.puntoSeleccionado.showPopup = true
        }

    },
    actions: {

    }
})