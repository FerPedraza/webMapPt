import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const request = require('request');

export default new Vuex.Store({
    state: {
        puntoSeleccionado: {
            showPopup: false,
            lat: "",
            lng: "",
            direccion: "",
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
        setDireccion(state) {
            var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + state.puntoSeleccionado.lat + ',' + state.puntoSeleccionado.lng+ '&key=AIzaSyDaV5qLKuwa1F6iK8IW83uspuAPVl8MrFc';
            console.log(url);
            request(url, function (err, res, body) {
                let json = JSON.parse(body);
                //console.log(json)
                state.puntoSeleccionado.direccion = json.results[0].formatted_address;
            }); 
        },
        showupTrue(state){
            state.puntoSeleccionado.showPopup = true
        }

    },
    actions: {

    }
})