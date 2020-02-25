<template>
  <div>
    <div id="bienvenidaFrame" v-show="mostrarMensaje">
      <h1 id="bienvenidaMessage">Bienvenido</h1>
      <p id="mensajePunto">
        Selecciona un punto en
        el mapa para comenzar
      </p>
      <button type="button" id="entendidoButton" @click="esconderMensaje">Entendido</button>
    </div>
    <div id="popupLugar" v-show="puntoSeleccionado.showPopup">
      <p>{{puntoSeleccionado.lat}},{{puntoSeleccionado.lng}}</p>
      <b-container fluid class="seleccionarRadio">
        <b-row class="my-1">
          <b-col sm="8">
            <b-form-input id="ingresarRadio" v-model="radio" v-on:submit="seleccionarPunto"></b-form-input>
            <label for="ingresarRadio">Ingresar Radio en km</label>
            <button v-show="delimitarAreaShowup" type="button" id="delimitarButton" @click="delimitarArea">Determinar</button>
            <button v-show="mostrarAreaShowup" type="button" id="delimitarButton" @click="mostrarArea">Mostrar</button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div id="map">
      
    </div>
  </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import {mapState} from 'vuex'; 

export default {
  computed: {
    ...mapState(['puntoSeleccionado'])
  },
  data() {
    return {
      mostrarMensaje: true,
      map: null,
      radio: 0,
      accessToken: "pk.eyJ1IjoiZmVyc3BlZGlmeSIsImEiOiJjazV6c29jczUwMHBiM2xudmxla2I4Y3N0In0.dIJ-dEHzi6LQyqBHLgJZ-g",
      mapStyle: 'mapbox://styles/angelraguilera/ck54ht1zz00wi1cmu46sgd4ds',
      center: [-99.154037, 19.501014],
      zoom: 12,
      delimitarAreaShowup: true,
      mostrarAreaShowup: false
    };
  },
  mounted () {
    this.createMap()
    this.btnPuntoLabel == 'Determinar'
  },
  methods: {
    createMap: function () {
      Mapbox.accessToken = this.accessToken
      this.map = new Mapbox.Map({ //acceder a map con store
        container: 'map', 
        style: this.mapStyle,
        center:  this.center,
        zoom: this.zoom
      })
      this.map.on('moveend', () => {
        console.log(this.$store.state.puntoSeleccionado.showPopup)
      })
      this.map.on('click', (e) => {
        this.delimitarAreaShowup = true;
        this.mostrarAreaShowup = false;
        if (this.map.getLayer("points")) {
          this.map.removeLayer("points");
        }
        if (this.map.getSource("point")) {
          this.map.removeSource("point");
        }
        this.$store.commit('setPoint',{
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          showup: true
        })
        this.map.addSource("point", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                this.puntoSeleccionado.lng,
                this.puntoSeleccionado.lat
              ]
            },
          }
        });
        this.map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'point',
          'layout': {
            'icon-image': "puntero",
            'icon-size': 0.15
          }
        });
        this.$store.commit('showupTrue')
      });
    },
    esconderMensaje() {
      this.mostrarMensaje = false;
    },
    seleccionarPunto(map, e) {
      console.log(e);
    },
    mostrarArea(){
      console.log("Zoom al mapa");
      this.map.flyTo({
        center: [this.puntoSeleccionado.lng,this.puntoSeleccionado.lat],
        zoom: 12,
        bearing: 0,
 
// These options control the flight curve, making it move
// slowly and zoom out almost completely before starting
// to pan.
speed: 0.4, // make the flying slow
curve: 1, // change the speed at which it zooms out
 
// This can be any easing function: it takes a number between
// 0 and 1 and returns another number between 0 and 1.
easing: function(t) {
return t;
},
 
// this animation is considered essential with respect to prefers-reduced-motion
essential: true
});

    },
    delimitarArea() {
      this.delimitarAreaShowup = false;
      this.mostrarAreaShowup = true;
      if (this.radio > 0){
        if (this.map.getLayer("points")) {
          this.map.removeLayer("points");
        }
        if (this.map.getSource("point")) {
          this.map.removeSource("point");
        }
        console.log(this.$store.state.puntoSeleccionado.lat,this.$store.state.puntoSeleccionado.lng)
        if (this.map.getLayer("marker")) {
          this.map.removeLayer("marker");
        }
        if (this.map.getSource("markers")) {
          this.map.removeSource("markers");
        }
        this.map.addSource("markers", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                this.puntoSeleccionado.lng,
                this.puntoSeleccionado.lat
              ]
            },
          }
        });
        this.map.addLayer({
          id: "marker",
          source: "markers",
          type: "circle",
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, ((this.radio *1000)/ 0.075 / Math.cos(this.puntoSeleccionado.lat * Math.PI / 180))]
              ],
              base: 2
            },
            "circle-color": "#1a9ea6",
            "circle-opacity": 0.5,
            "circle-stroke-width": 0,
            "circle-pitch-scale": "map"
          },
        });
      }
    }
  }
};

</script>
<style scoped>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css");
#map {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -99;
}
#bienvenidaFrame {
  position: absolute;
  width: 566px;
  height: 328px;
  left: 437px;
  top: 30%;
  background: #1a9ea6;
}
#bienvenidaMessage {
  position: absolute;
  width: 234px;
  height: 53px;
  left: 166px;
  top: 37px;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 48px;
  line-height: 53px;
  text-align: center;
  color: #ffffff;
}
#mensajePunto {
  position: absolute;
  width: 258px;
  height: 52px;
  left: 154px;
  top: 138px;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 26px;
  text-align: center;
  color: #ffffff;
}
#entendidoButton {
  position: absolute;
  width: 130px;
  height: 45px;
  left: 218px;
  top: 220px;
  background: #11656a;
  border-color: #11656a;
  color: #ffffff;
}
#popupLugar {
  position: absolute;
  width: 319px;
  height: 242px;
  left: 40%;
  top: 65%;
  background: #1a9ea6;
}
.seleccionarRadio {
  position: absolute;
  left: 17%;
  bottom: 10%;
}
#delimitarButton {
  background: #11656a;
  border-color: #11656a;
  color: #ffff;
}
</style>
