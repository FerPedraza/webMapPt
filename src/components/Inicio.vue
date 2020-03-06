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
    <div v-bind:id="['popupLugar']" v-bind:style="popupLugarContainer" v-show="puntoSeleccionado.showPopup" >
      <p>{{puntoSeleccionado.lat}},{{puntoSeleccionado.lng}}</p>
      <b-container fluid class="seleccionarRadio">
        <b-row class="my-1">
          <b-col sm="8">
            <b-form-input id="ingresarRadio" v-model="radio" @click="delimitarArea"></b-form-input>
            <label for="ingresarRadio">Ingresar Radio en km</label>
            <!--<button v-show="delimitarAreaShowup" type="button" id="delimitarButton" @click="delimitarArea">Determinar</button>-->
            <button  type="button" id="delimitarButton" @click="mostrarArea">Mostrar</button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div id="barraMenu">
      <div id="menu" type="button" @click="desplegarMenu">
          <img src="../assets/menu.png" width="37px" height="40px" alt />
          
      </div>
    </div>
    <div id="menuCard" v-show="menuShowup">
        <div id="backMenu" @click="ocultarMenu">
          <img src="../assets/arrow.png" width="50px" height="47px" type="button" alt />
          
      </div>



    </div>
    <div v-bind:id="['map']" v-bind:style="mapContainer">
      
    </div>
  </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import {mapState} from 'vuex'; 
var _ = require('lodash');
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
      menuShowup: false,
      mapContainer:{
          position: 'absolute',
          top: '5%',
          left: '0',
          height: '95%',
          width: '100%',
          
      },
      popupLugarContainer:{
        left: '42%',
    }
      //delimitarAreaShowup: true,
      //mostrarAreaShowup: true
    };
  },
  watch: {
    // whenever question changes, this function will run
      radio: function () {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  mounted () {
    this.createMap()
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.delimitarArea, 500)
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
        this.radio =0;
        if (this.map.getLayer("marker")) {
          this.map.removeLayer("marker");
        }
        if (this.map.getSource("markers")) {
          this.map.removeSource("markers");
        }
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
      // Geographic coordinates of the LineString
      this.map.fitBounds([
        [this.puntoSeleccionado.lng,(this.puntoSeleccionado.lat + this.radio/111)],
        [this.puntoSeleccionado.lng,(this.puntoSeleccionado.lat - this.radio/111)]
      ]);

    },
    desplegarMenu(){
      this.menuShowup = true;
      this.mapContainer.width = "80%";
      this.mapContainer.left = "20%";
      this.popupLugarContainer.left = "57%";
    },
    ocultarMenu(){
      this.menuShowup = false;
      this.mapContainer.width = "100%";
      this.mapContainer.left = "0%";
      this.popupLugarContainer.left = "42%";
    },

    delimitarArea() {
      
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
  z-index: -99;
}
#menuCard{
  position: absolute;
  width: 20%;
  height: 100%;
  left: 0;
  top: 0;
  background: #1a9ea6;
}
#backMenu {
  position: absolute;
  width: 3%;
  height: 3%;
  right: 14%;
  top: 0.7%;
  background: #1a9ea6;
}
#barraMenu{
  position: absolute;
  top: 0;
  left: 0;
  height: 5%;
  width: 100%;
  z-index: -99;
  background: #1a9ea6;
}

#bienvenidaFrame {
  position: absolute;
  width: 566px;
  height: 328px;
  left: 36%;
  top: 30%;
  background: #1a9ea6;
}
#bienvenidaMessage {
  position: absolute;
  width: 234px;
  height: 53px;
  left: 30%;
  top: 15%;
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
#menu {
  position: absolute;
  width: 3%;
  height: 3%;
  left: 0.5%;
  top: 8%;
  background: #1a9ea6;
}
</style>
