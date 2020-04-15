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
      <p>{{puntoSeleccionado.direccion}}</p> 
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
      <div id="logout" type="button" @click="logOut">
          <img src="../assets/logoutIcon.png" width="37px" height="40px" alt />
          
      </div>
    </div>
    <div id="menuCard" v-show="menuShowup">
      <div id="backMenu" @click="ocultarMenu">
        <img src="../assets/chevronLeft.png" width="30px" height="45px" type="button" alt />  
      </div>
      <div id="userCard">
        <img src="../assets/profile.png"  id="userIcon" alt /> 
        <div id= "correoFrame"><p id="correo" >{{email}}</p></div>
      </div>
      <div id="infoFrame" >
        <div v-show="!calendarShowup" ><p id="lugarTexto" >{{puntoSeleccionado.direccion}}</p></div>
        
        <div v-show="calendarShowup">
          <div id="seleccionHora">
            Seleccione la hora 
            <select v-model="hora">
              <option v-for="optionHoras in optionsHoras" v-bind:value="optionHoras.value" v-bind:key=optionHoras.value>
                {{ optionHoras.text }}
              </option>
            </select>
            :
            <select v-model="minuto">
              <option v-for="optionMinutos in optionsMinutos" v-bind:value="optionMinutos.value" v-bind:key=optionMinutos.value>
                {{ optionMinutos.text }}
              </option>
            </select>
          </div>
          <div id ="seleccionFecha">
            <v-date-picker  v-model="date" is-inline/></div>
          </div>
          
      </div>
      <div id="buttonFrame" >
        <button v-show="showButtons" type="button" id="indiceButton" @click="indiceDelictivo">Indice delictivo</button>
        <button v-show="showButtons" type="button" id="analisisButton" @click="analisisDelictivo">Análisis delictivo</button>
        <button v-show="!showButtons" type="button" id="analisButton" @click="analisDelictivo">Lanzar análisis delictivo</button>
      </div>
    </div>
    <div v-bind:id="['histogramaFrame']" v-bind:style="histoCont" v-show="histogramaShowed">
      <div id="maximizeIcon" type="button" @click="ampliarHistograma">
        <img src="../assets/expand.png" width="55px" height="55px" alt/> 
      </div>
      <div id="histogramaTitleFrame">
        <p id="histogramaTitle">
          Delitos de la región conforme {{opcionSelecc}}
          </p>
      </div>
      <div id="histogramaCard">
        <div id="histo">
          <div id="plot" />
        </div>
        <v-app id="histobuttons">
          <v-container fluid>
            <v-row class="justify-space-between mb-6" >
              <v-switch v-model="opcionSelecc" label="Dias" value="dias" ></v-switch>
              <v-switch v-model="opcionSelecc" label="Meses" value="meses"></v-switch>
              <v-switch v-model="opcionSelecc" label="Años" value="años"></v-switch>
            </v-row>
          </v-container>
        </v-app>
      </div>
    </div>
    <div v-bind:id="['map']" v-bind:style="mapContainer">
      
      
    </div>
    <v-btn v-show="heatMapButton.showup" v-bind:id="['heatMapButtonStyle']" v-bind:style="buttonMapaCalor" rounded color="primary"  @click="mapaCalor" dark>{{heatMapButton.msj}}</v-btn>
    <img v-show="heatMapButton.showup" v-bind:id="['maximizeHisto']" v-bind:style="buttonHistoExpand" type="button" @click="maximizeHistograma" src="../assets/expand.png" width="55px" height="55px" alt/> 
    
  </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import {mapState} from 'vuex'; 
import firebase from "firebase";
import Plotly from 'plotly.js';
import axios from 'axios';
var _ = require('lodash');

export default {
  computed: {
    ...mapState(['puntoSeleccionado'])
  },
  data() {
    return {
      heatMapButton:{
        showup: false,
        msj: 'Mostrar mapa de calor'
      },
      coordenadas: [],
      dias: ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'],
      meses: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
      años: [],
      /*dias: [],
      meses:[],
      años:[],*/
      x: [],
      y: [],
      info: [],
      opcionSelecc: ". . . ",
      hora: 0,
      minuto: 0,
      optionsHoras: [
        { text: '00', value: 0 },
        { text: '01', value: 1 },
        { text: '02', value: 2 },
        { text: '03', value: 3 },
        { text: '04', value: 4 },
        { text: '05', value: 5 },
        { text: '06', value: 6 },
        { text: '07', value: 7 },
        { text: '08', value: 8 },
        { text: '09', value: 9 },
        { text: '10', value: 10 },
        { text: '11', value: 11 },
        { text: '12', value: 12 },
        { text: '13', value: 13 },
        { text: '14', value: 14 },
        { text: '15', value: 15 },
        { text: '16', value: 16 },
        { text: '17', value: 17 },
        { text: '18', value: 18 },
        { text: '19', value: 19 },
        { text: '20', value: 20 },
        { text: '21', value: 21 },
        { text: '22', value: 22 },
        { text: '23', value: 23 },
      ],
      optionsMinutos: [
        { text: '00', value: 0 },
        { text: '01', value: 1 },
        { text: '02', value: 2 },
        { text: '03', value: 3 },
        { text: '04', value: 4 },
        { text: '05', value: 5 },
        { text: '06', value: 6 },
        { text: '07', value: 7 },
        { text: '08', value: 8 },
        { text: '09', value: 9 },
        { text: '10', value: 10 },
        { text: '11', value: 11 },
        { text: '12', value: 12 },
        { text: '13', value: 13 },
        { text: '14', value: 14 },
        { text: '15', value: 15 },
        { text: '16', value: 16 },
        { text: '17', value: 17 },
        { text: '18', value: 18 },
        { text: '19', value: 19 },
        { text: '20', value: 20 },
        { text: '21', value: 21 },
        { text: '22', value: 22 },
        { text: '23', value: 23 },
        { text: '24', value: 24 },
        { text: '25', value: 25 },
        { text: '26', value: 26 },
        { text: '27', value: 27 },
        { text: '28', value: 28 },
        { text: '29', value: 29 },
        { text: '30', value: 30 },
        { text: '31', value: 31 },
        { text: '32', value: 32 },
        { text: '33', value: 33 },
        { text: '34', value: 34 },
        { text: '35', value: 35 },
        { text: '36', value: 36 },
        { text: '37', value: 37 },
        { text: '38', value: 38 },
        { text: '39', value: 39 },
        { text: '40', value: 40 },
        { text: '41', value: 41 },
        { text: '42', value: 42 },
        { text: '43', value: 43 },
        { text: '44', value: 44 },
        { text: '45', value: 45 },
        { text: '46', value: 46 },
        { text: '47', value: 47 },
        { text: '48', value: 48 },
        { text: '49', value: 49 },
        { text: '50', value: 50 },
        { text: '51', value: 51 },
        { text: '52', value: 52 },
        { text: '53', value: 53 },
        { text: '54', value: 54 },
        { text: '55', value: 55 },
        { text: '56', value: 56 },
        { text: '57', value: 57 },
        { text: '58', value: 58 },
        { text: '59', value: 59 },
      ],
      date: new Date(),
      mostrarMensaje: true,
      map: null,
      radio: 0,
      accessToken: "pk.eyJ1IjoiZmVyc3BlZGlmeSIsImEiOiJjazV6c29jczUwMHBiM2xudmxla2I4Y3N0In0.dIJ-dEHzi6LQyqBHLgJZ-g",
      mapStyle: 'mapbox://styles/angelraguilera/ck54ht1zz00wi1cmu46sgd4ds',
      center: [-99.154037, 19.501014],
      zoom: 12,
      menuShowup: false,
      showButtons: true,
      calendarShowup: false,
      histogramaShowed: false,
      mapContainer:{
          position: 'absolute',
          top: '5%',
          left: '0',
          height: '95%',
          width: '100%',
      },
      histoCont:{
          position: 'absolute',
          width: '50%',
          height: '95%',
          right: '0',
          top: '5%',
      },
      histogramaGraph:{
          width: '860px',
          height: '650px',
      },
      buttonHistoExpand:{
          left: '45%',  
      },
      buttonMapaCalor:{
          left: '37%',  
      },
      
      popupLugarContainer:{
        left: '42%',
      },
      email: null,
      firebaseUid: null,
    };
  },
  watch: {
    radio: function () {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    },
    opcionSelecc:function(){
      this.solicitudhistograma()
    }
  },
  mounted () {
    this.createMap()
    this.map.doubleClickZoom.disable()
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.delimitarArea, 500);
    var user = firebase.auth().currentUser;
    
    if (user != null) {
      this.email = user.email;
      this.firebaseUid = user.uid;
    }

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
      /*this.map.on('moveend', () => {
        console.log(this.$store.state.puntoSeleccionado.showPopup)
      })*/
      this.map.on('dblclick', (e) => {
        this.radio = 0;
        this.calendarShowup = false;
        this.showButtons = true;
        this.histogramaShowed = false;
        this.heatMapButton.showup = false;
        this.mapContainer.width = "100%";
        this.mapContainer.left = "0%";
        this.histoCont.width = "50%";
        this.popupLugarContainer.left = "42%";
        this.ocultarMenu();
        
        if (this.map.getLayer("earthquakes-heat")) {
          this.map.removeLayer("earthquakes-heat");
        }
        if (this.map.getLayer("earthquakes-point")) {
          this.map.removeLayer("earthquakes-point");
        }
        if (this.map.getSource("earthquakes")) {
          this.map.removeSource("earthquakes");
        }

        this.heatMapButton.msj = "Mostrar mapa de calor"

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
        if (this.map.getLayer("predictions")) {
        this.map.removeLayer("predictions");
        }
        if (this.map.getSource("prediction")) {
          this.map.removeSource("prediction");
        }
        this.$store.commit('setPoint',{
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          showup: true
        });
        this.$store.commit('setDireccion');
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
      this.histogramaShowed = false;
      this.heatMapButton.showup = false;
      this.mapContainer.width = "80%";
      this.mapContainer.left = "20%";
      this.histoCont.width = "50%";
      this.popupLugarContainer.left = "57%";
    },
    indiceDelictivo(){
      this.buttonHistoExpand.left = "45%";
      this.buttonMapaCalor.left ="37%";
      this.histogramaShowed = true;
      this.menuShowup = false;
      this.heatMapButton.showup = true;
      this.mapContainer.left = "0%";
      this.mapContainer.width = "50%";
      this.popupLugarContainer.left = "20%";
      console.log("Entre al indice");
      this.solicitudhistograma()
    },
    solicitudhistograma(){
      var i = 0;
      var j = 0;
      if(this.opcionSelecc == 'dias'){
        
        //http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio=2000&lat=19.50146&long=-99.24939&opcion=histograma&parametro=diaSemana
        //http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio=1700&lat=19.54532&long=-99.13508&opcion=histograma&parametro=diaSemana
        let url = 'http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio='+this.radio*1000+'&lat='+this.puntoSeleccionado.lat.toFixed(5)+'&long='+this.puntoSeleccionado.lng.toFixed(5)+'&opcion=histograma&parametro=diaSemana';
        console.log(url);
        this.x = this.dias;
        axios.get(url,{ crossdomain: true })
        .then(response => {
          this.info = response.data
          for (i = 0; i < this.dias.length; i ++) {
            this.y[i] = this.info[i+1];
            
          }
          console.log(this.y)
          console.log(this.info)
          this.mostrarHistograma();
        })
        .catch(error => {
          console.log(error)
        })
      }
      
      if(this.opcionSelecc == 'meses'){
        this.x = this.meses;
        let url = 'http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio='+this.radio*1000+'&lat='+this.puntoSeleccionado.lat.toFixed(5)+'&long='+this.puntoSeleccionado.lng.toFixed(5)+'&opcion=histograma&parametro=mes';
        console.log(url);
        axios.get(url,{ crossdomain: true })
        .then(response => {
          this.info = response.data
          for (i = 0; i < this.meses.length; i ++) {
            this.y[i] = this.info[i+1];
          }
          this.mostrarHistograma();
        })
        .catch(error => {
          console.log(error)
        })
      }
      if(this.opcionSelecc == 'años'){
        this.x = this.años;
        let url = 'http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio='+this.radio*1000+'&lat='+this.puntoSeleccionado.lat.toFixed(5)+'&long='+this.puntoSeleccionado.lng.toFixed(5)+'&opcion=histograma&parametro=ano';
        console.log(url);
        axios.get(url,{ crossdomain: true })
        .then(response => {
          this.info = response.data;
          j=0;
          for(var key in this.info){
            this.años[j] = key;
            j++;
          }
          j=0;
          for(var key1 in this.info){
            this.y[j] = this.info[key1];
            j++;
          }
          console.log(this.x);
          
          console.log(this.y);

          this.mostrarHistograma();
        })
        .catch(error => {
          console.log(error)
        })
      }
      
    },
    mostrarHistograma(){
      var data = [
        {
          x: this.x,
          y: this.y,
          type: 'bar'
          }
        ];
      var layout = {
        autosize: true,
        
      };
      Plotly.newPlot('plot', data, layout );
      console.log(this.histogramaGraph.width + this.histogramaGraph.height)
    },
    mapaCalor(){
      if(this.heatMapButton.msj == 'Mostrar mapa de calor'){
        
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
        let url = 'http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio='+this.radio*1000+'&lat='+this.puntoSeleccionado.lat.toFixed(5)+'&long='+this.puntoSeleccionado.lng.toFixed(5)+'&opcion=mapaCalor';
        console.log('http://localhost:8080/yh.json');
        this.heatMapButton.msj = 'Ocultar mapa de calor';
        this.map.addSource('trees', {
          type: 'geojson',
          data: url,
        });
        this.map.addLayer({
          id: 'trees-heat',
          type: 'heatmap',
          source: 'trees',
          maxzoom: 15,
          paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              property: 'delitos',
              type: 'interval',
              stops: [
                [1, 0],
                [80, 1]
              ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
              stops: [
                [11, 1],
                [15, 3]
              ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(236,222,239,0)',
              0.1, 'rgb(254,217,118)',
              0.2, 'rgb(254,178,76)',
              0.3, 'rgb(253,141,60)',
              0.5, 'rgb(252,78,42)',
              0.7, 'rgb(227,26,28)',
              0.9 , 'rgb(177,0,38)',
              
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
              stops: [
                [11, 15],
                [15, 20]
              ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
              default: 1,
              stops: [
                [16, 1],
                [18, 0] 
              ]
            },
          }
        }, 'waterway-label');
        this.map.addLayer({
          id: 'trees-point',
          type: 'circle',
          source: 'trees',
          minzoom: 15,
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
              property: 'delitos',
              type: 'exponential',
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 80 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 80 }, 50],
              ]
            },
            'circle-color': {
              property: 'delitos',
              type: 'exponential',
              stops: [
                [0, 'rgba(236,222,239,0)'],
                [20, 'rgb(254,217,118)'],
                [40, 'rgb(254,178,76)'],
                [70, 'rgb(253,141,60)'],
                [100, 'rgb(252,78,42)'],
                [130, 'rgb(227,26,28)'],
                [160 , 'rgb(177,0,38)']
              ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': {
              stops: [
                [14, 0],
                [15, 1]
              ]
            }
          }
        }, 'waterway-label');
      }
      else if(this.heatMapButton.msj == 'Ocultar mapa de calor'){
        if (this.map.getLayer("trees-point")) {
          this.map.removeLayer("trees-point");
        }
        if (this.map.getLayer("trees-heat")) {
          this.map.removeLayer("trees-heat");
        }
        if (this.map.getSource("trees")) {
          this.map.removeSource("trees");
        }
        this.heatMapButton.msj = "Mostrar mapa de calor"
      }
    },
    analisisDelictivo(){
      this.calendarShowup = true;
      this.showButtons = false;      
      console.log("Entre al analisis");
    },
    analisDelictivo(){
      console.log("Pos lo lanzamos");
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
      if (this.map.getLayer("predictions")) {
        this.map.removeLayer("predictions");
      }
      if (this.map.getSource("prediction")) {
        this.map.removeSource("prediction");
      }
        this.getPredicciones();
        
        
    },
    getPredicciones(){
      //http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7300/?radio=1500&lat=19.51197&long=-99.12691&fechaInicial=2020-03-10%2000:00&fechaFinal=2020-03-11%2023:59
      console.log(this.date);
      let url = 'http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7300/?radio='+this.radio*1000+'&lat='+this.puntoSeleccionado.lat.toFixed(5)+'&long='+this.puntoSeleccionado.lng.toFixed(5)+'&fechaInicial='+'2020-03-10'+'%2000:00&fechaFinal='+'2020-03-11'+'%2023:59';
      //var url = 'http://localhost:8080/responsePredicciones.json'
      console.log(url)
      axios.get(url,{ crossdomain: true })
        .then(response => {
          var coorde = response.data;
          console.log(coorde.preds[1].coordenadas[1])
          var coordena=[];
      for (var i = 0; i < Object.keys(coorde.preds).length; i++) {
        coordena =  coordena.concat({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [coorde.preds[i].coordenadas[1],coorde.preds[i].coordenadas[0]]
          },
          'properties': {
            'fecha': coorde.preds[i].fecha
          },
        });  
      }
      this.coordenadas = coordena;
      this.map.addSource("prediction", {
          type: "geojson",
          data: {
            'type': 'FeatureCollection',
            'features': this.coordenadas,
          }
        });
        this.map.addLayer({
          'id': 'predictions',
          'type': 'symbol',
          'source': 'prediction',
          'layout': {
            'icon-image': "danger",
            'icon-size': 0.5
          }
        });
        this.map.on('click', 'predictions', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var fecha = e.features[0].properties.fecha;
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          console.log(fecha);
        new Mapbox.Popup()
          .setLngLat(coordinates)
          .setHTML(fecha)
          .addTo(this.map);
          });
          
          // Change the cursor to a pointer when the mouse is over the places layer.
          this.map.on('mouseenter', 'predictions', () => {
            this.map.getCanvas().style.cursor = 'pointer';
          });
          
          // Change it back to a pointer when it leaves.
          this.map.on('mouseleave', 'predictions', () => {
            this.map.getCanvas().style.cursor = '';
          });
        })
        .catch(error => {
          console.log(error)
        })
      
    },
    maximizeHistograma(){
      this.histogramaShowed = false;
      this.menuShowup = false;
      this.mapContainer.left = "0%";
      this.mapContainer.width = "100%";
      this.histoCont.width = "50%";
      this.popupLugarContainer.left = "42%";
      this.buttonMapaCalor.left = "87%";
      this.buttonHistoExpand.left = "95%";
      this.histogramaGraph.width = "1720px";
      this.histogramaGraph.height = "650px";
      
      this.solicitudhistograma();
      
    },
    ampliarHistograma(){
      this.heatMapButton.showup = false;
      this.histoCont.width = "100%";
      
    },
    cerrarHistograma(){

    },
    ocultarMenu(){
      this.menuShowup = false;
      this.calendarShowup = false;
      this.showButtons = true;
      this.mapContainer.left = "0%";
      this.mapContainer.width = "100%";
      this.popupLugarContainer.left = "42%";

    },
    logOut(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
      // An error happened.
      console.log(error);
      });
      this.email = null;
      this.firebaseUid= null;
      this.$router.replace("/login");
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
#userCard{
  position: absolute;
  width: 70%;
  height: 10%;
  left: 5%;
  top: 7.5%;
  background: #1a9ea6;
}
#seleccionHora{
  position: absolute;
  width: 80%;
  height: 55%;
  left: 10%;
  top: 7%;
  background: #ffffff;
}
#seleccionFecha{
  position: absolute;
  width: 80%;
  height: 55%;
  left: 13%;
  top: 20%;
  background: #ffffff;
}
#infoFrame{
  position: absolute;
  width: 80%;
  height: 55%;
  left: 10%;
  top: 22%;
  background: #ffffff;
}
#buttonFrame{
  position: absolute;
  width: 70%;
  height: 15%;
  left: 15%;
  top: 81.5%;
  background: #1a9ea6;
}
#histogramaFrame{
  background: #ffffff;
}
#indiceButton {
  position: absolute;
  width: 80%;
  height: 20%;
  left: 10%;
  top: 15%;
  background: #11656a;
  border-color: #11656a;
  color: #ffffff;
}
#analisisButton {
  position: absolute;
  width: 80%;
  height: 20%;
  left: 10%;
  top: 50%;
  background: #11656a;
  border-color: #11656a;
  color: #ffffff;
}
#analisButton{
  position: absolute;
  width: 80%;
  height: 20%;
  left: 10%;
  top: 35%;
  background: #11656a;
  border-color: #11656a;
  color: #ffffff;
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
  right: 10%;
  top: 0.7%;
  background: #1a9ea6;
}
#logout {
  position: absolute;
  width: 3%;
  height: 3%;
  right: 0.5%;
  top: 8%;
  background: #1a9ea6;
}
#maximizeIcon {
  position: absolute;
  width: 3%;
  height: 3%;
  right: 5%;
  top: 3%;
  background: #ffffff;
}
#userIcon {
  position: absolute;
  width: 25%;
  height: 75%;
  left: 1%;
  top: 10%;
  background: #1a9ea6;
}
#correoFrame {
  position: absolute;
  width: 25%;
  height: 80%;
  left: 30%;
  top: 55%;
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
#histogramaTitleFrame {
  position: absolute;
  width: 50%;
  height: 10%;
  left: 25%;
  top: 8%;
  background: #ffffff;
}
#histogramaTitle{
  position: absolute;
  width: 80%;
  height: 5px;
  left: 10%;
  top: 11%;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  line-height: 30px;
  text-align: center;
  color: #000000;
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
#lugarTexto{
  position: absolute;
  width: 80%;
  left: 10%;
  top: 20%;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 26px;
  text-align: center;
  color: #000000;
}
#correo {
  position: absolute;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
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
#histogramaCard{
  position: absolute;
  width: 100%;
  height: 80%;
  left: 0%;
  top: 17%;
  background: #ffffff;
}
#histo{
  position: absolute;
  width: 90%;
  height: 70%;
  left: 5%;
  top: 5%;
  background: #ffffff;
}
#histobuttons{
  position: absolute;
  width: 60%;
  height: 20%;
  left: 20%;
  top: 90%;
  background: #ffffff;
}
#heatMapButtonStyle{
  position: absolute;
  bottom: 5%;
  background: #1a9ea6;
}
#maximizeHisto{
  position: absolute;
  top: 10%;
}
</style>




