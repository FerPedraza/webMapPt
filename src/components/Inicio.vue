<template>
  <div class="loginWrapper" v-bind:class="{ active: !mostrarMensaje }">
    <div v-bind:id="['map']" v-bind:style="mapContainer"></div>
    <div class="bienvenidaFrame" v-show="mostrarMensaje">
      <h1 id="bienvenidaMessage">Bienvenido</h1>
      <p id="mensajePunto">Haz clic dos veces en el mapa para seleccionar un punto</p>
      <v-btn id="entendidoButton" type="button" @click="esconderMensaje">Entendido</v-btn>
    </div>
    <div
      v-bind:id="['popupLugarContainer']"
      v-bind:style="popupLugarContainer"
      v-show="puntoSeleccionado.showPopup"
    >
      <h1>El punto seleccionado es:</h1>
      <h2>{{puntoSeleccionado.direccion}}</h2>
      <h3>Latitud / Longitud</h3>
      <h4>{{puntoSeleccionado.lat}},{{puntoSeleccionado.lng}}</h4>
      <b-container class="seleccionarRadio">
        <b-form-input id="inputRadio" v-model="radio" @click="delimitarArea" type="number"></b-form-input>
        <label>Selecciona el radio en km</label>
        <v-btn type="button" id="delimitarButton" @click="mostrarAreabtn">Mostrar</v-btn>
      </b-container>
    </div>
    <div id="barraMenu">
      <div id="menu" type="button" @click="desplegarMenu">
        <img src="../assets/menu.png" width="100%" height="100%" alt />
      </div>
      <div id="logout" type="button" @click="logOut">
        <img src="../assets/logoutIcon.png" width="100%" height="100%" alt />
      </div>
    </div>
    <div id="menuCard" v-show="menuShowup">
      <div id="backMenu" @click="ocultarMenu">
        <img src="../assets/chevronLeft.png" width="100%" height="100%" type="button" alt />
      </div>
      <div id="userCard">
        <img src="../assets/profile.png" id="userIcon" alt />
        <div id="correoFrame">
          <p id="correo">{{email}}</p>
        </div>
      </div>
      <p id="lugaresFavoritos">Lugares Favoritos</p>
      <div id="infoFrame">
        <v-list-item-group v-model="lugarList" color="#1a9ea6">
          <v-list-item
            two-line
            v-for="(lugar, i) in lugaresGuardados"
            :key="i"
            :disabled="false"
            @click="pointListSelected(lugar)"
          >
            <v-list-item-content>
              <v-list-item-title>{{lugaresGuardados[i].nombre}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-dialog v-model="calendarShowup" persistent justify="center">
          <div id="seleccionFecha">
            <p id="histogramaTitle">
              Selecciona una fecha
              <br />para el análisis
            </p>
            <v-btn id="calendarioButton" color="#1a9ea6" @click="analisDelictivo">Hecho</v-btn>
            <div id="calendario">
              <v-date-picker v-model="date"></v-date-picker>
            </div>
          </div>
        </v-dialog>
      </div>
      <div></div>
      <v-dialog v-model="radiomsj" persistent max-width="290" justify="center">
        <v-card>
          <v-card-title class="headline">¡Oh oh!</v-card-title>
          <v-card-text>Debes seleccionar un punto en el mapa con doble clic y un radio para continuar</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#1a9ea6" text @click="radiomsj = false">Entendido</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-bind:id="['histogramaFrame']" v-bind:style="histogramaFrame" v-show="histogramaShowed">
      <div v-show="!histoExpanded" id="maximizeIcon" type="button" @click="ampliarHistograma">
        <img src="../assets/expand.png" width="100%" height="100%" alt />
      </div>
      <div v-show="histoExpanded" id="minimizeIcon" type="button" @click="minimizarHistograma">
        <img src="../assets/minimize.png" width="100%" height="100%" alt />
      </div>
      <div id="histogramaTitleFrame">
        <p id="histogramaTitle">Delitos de la región conforme {{opcionSelecc}}</p>
      </div>
      <div id="histogramaCard">
        <div id="histo">
          <div id="plot" />
        </div>
        <div id="histobuttons">
          <v-container fluid>
            <v-row class="justify-space-between mb-6">
              <v-switch v-model="opcionSelecc" label="Dias" value="dias"></v-switch>
              <v-switch v-model="opcionSelecc" label="Meses" value="meses"></v-switch>
              <v-switch v-model="opcionSelecc" label="Años" value="años"></v-switch>
            </v-row>
          </v-container>
        </div>
      </div>
    </div>
    <div v-show="!menuShowup" id="buttonFrame">
      <v-btn
        v-show="showButtons"
        type="button"
        id="indiceButton"
        rounded
        color="#1a9ea6"
        @click="indiceDelictivo"
      >Indice delictivo</v-btn>
      <v-btn
        v-show="showButtons"
        type="button"
        id="analisisButton"
        rounded
        color="#1a9ea6"
        @click="analisisDelictivo"
      >Análisis delictivo</v-btn>
    </div>
    <img
      v-show="showButtons && showInfoIcon && !menuShowup"
      id="infoPunto"
      type="button"
      @click="infoPunto"
      src="../assets/pointInfo.png"
      alt
    />
    <v-btn
      v-show="heatMapButton.showup"
      v-bind:id="['heatMapButtonStyle']"
      v-bind:style="buttonMapaCalor"
      rounded
      color="#1a9ea6"
      @click="mapaCalor"
      dark
    >{{heatMapButton.msj}}</v-btn>
    <img
      v-show="heatMapButton.showup && mapExpanded"
      id="buttonMapExpand"
      type="button"
      @click="maximizeMapa"
      src="../assets/expand.png"
      width="100%"
      height="100%"
      alt
    />
    <img
      v-show="!mapExpanded"
      id="buttonMapMinimize"
      type="button"
      @click="minimizaMapa"
      src="../assets/minimize.png"
      width="100%"
      height="100%"
      alt
    />

    <vue-google-autocomplete
      id="search"
      v-show="showUpBar"
      class="form-control"
      placeholder="Busca una dirección"
      v-on:placechanged="getAddressDiection"
    ></vue-google-autocomplete>
  </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import { mapState } from "vuex";
import firebase from "firebase";
import { db } from "../main";
import Plotly from "plotly.js";
import axios from "axios";
import moment from "moment";
import VueGoogleAutocomplete from "vue-google-autocomplete";
var _ = require("lodash");

export default {
  components: { VueGoogleAutocomplete },
  computed: {
    ...mapState(["puntoSeleccionado"])
  },
  data() {
    return {
      showUpBar: true,
      lugarList: null,
      lugaresGuardados: [],
      address: "",
      isActive: false,
      radiomsj: false,
      showInfoIcon: false,
      mapExpanded: true,
      histoExpanded: false,
      heatMapButton: {
        showup: false,
        msj: "Mostrar mapa de calor"
      },
      coordenadas: [],
      dias: [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo"
      ],
      meses: [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
      ],
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
        { text: "00", value: 0 },
        { text: "01", value: 1 },
        { text: "02", value: 2 },
        { text: "03", value: 3 },
        { text: "04", value: 4 },
        { text: "05", value: 5 },
        { text: "06", value: 6 },
        { text: "07", value: 7 },
        { text: "08", value: 8 },
        { text: "09", value: 9 },
        { text: "10", value: 10 },
        { text: "11", value: 11 },
        { text: "12", value: 12 },
        { text: "13", value: 13 },
        { text: "14", value: 14 },
        { text: "15", value: 15 },
        { text: "16", value: 16 },
        { text: "17", value: 17 },
        { text: "18", value: 18 },
        { text: "19", value: 19 },
        { text: "20", value: 20 },
        { text: "21", value: 21 },
        { text: "22", value: 22 },
        { text: "23", value: 23 }
      ],
      optionsMinutos: [
        { text: "00", value: 0 },
        { text: "01", value: 1 },
        { text: "02", value: 2 },
        { text: "03", value: 3 },
        { text: "04", value: 4 },
        { text: "05", value: 5 },
        { text: "06", value: 6 },
        { text: "07", value: 7 },
        { text: "08", value: 8 },
        { text: "09", value: 9 },
        { text: "10", value: 10 },
        { text: "11", value: 11 },
        { text: "12", value: 12 },
        { text: "13", value: 13 },
        { text: "14", value: 14 },
        { text: "15", value: 15 },
        { text: "16", value: 16 },
        { text: "17", value: 17 },
        { text: "18", value: 18 },
        { text: "19", value: 19 },
        { text: "20", value: 20 },
        { text: "21", value: 21 },
        { text: "22", value: 22 },
        { text: "23", value: 23 },
        { text: "24", value: 24 },
        { text: "25", value: 25 },
        { text: "26", value: 26 },
        { text: "27", value: 27 },
        { text: "28", value: 28 },
        { text: "29", value: 29 },
        { text: "30", value: 30 },
        { text: "31", value: 31 },
        { text: "32", value: 32 },
        { text: "33", value: 33 },
        { text: "34", value: 34 },
        { text: "35", value: 35 },
        { text: "36", value: 36 },
        { text: "37", value: 37 },
        { text: "38", value: 38 },
        { text: "39", value: 39 },
        { text: "40", value: 40 },
        { text: "41", value: 41 },
        { text: "42", value: 42 },
        { text: "43", value: 43 },
        { text: "44", value: 44 },
        { text: "45", value: 45 },
        { text: "46", value: 46 },
        { text: "47", value: 47 },
        { text: "48", value: 48 },
        { text: "49", value: 49 },
        { text: "50", value: 50 },
        { text: "51", value: 51 },
        { text: "52", value: 52 },
        { text: "53", value: 53 },
        { text: "54", value: 54 },
        { text: "55", value: 55 },
        { text: "56", value: 56 },
        { text: "57", value: 57 },
        { text: "58", value: 58 },
        { text: "59", value: 59 }
      ],
      date: new Date(),
      mostrarMensaje: true,
      map: null,
      radio: 0,
      accessToken:
        "pk.eyJ1IjoiZmVyc3BlZGlmeSIsImEiOiJjazV6c29jczUwMHBiM2xudmxla2I4Y3N0In0.dIJ-dEHzi6LQyqBHLgJZ-g",
      mapStyle: "mapbox://styles/angelraguilera/ck54ht1zz00wi1cmu46sgd4ds",
      center: [-99.154037, 19.501014],
      zoom: 12,
      menuShowup: false,
      showButtons: true,
      calendarShowup: false,
      histogramaShowed: false,
      mapContainer: {
        position: "absolute",
        top: "5%",
        left: "0",
        height: "95%",
        width: "100%"
      },
      histogramaFrame: {
        position: "absolute",
        width: "50%",
        height: "95%",
        right: "0",
        top: "5%"
      },
      histogramaGraph: {
        width: "860px",
        height: "650px"
      },
      buttonMapaCalor: {
        right: "51%"
      },

      popupLugarContainer: {
        left: "50%"
      },
      email: null,
      firebaseUid: null
    };
  },
  watch: {
    radio: function() {
      this.answer = "Waiting for you to stop typing...";
      this.debouncedGetAnswer();
    },
    opcionSelecc: function() {
      this.solicitudhistograma();
    }
  },
  mounted() {
    this.createMap();
    console.log(localStorage.getItem("usuario"));
    this.map.doubleClickZoom.disable();
    db.collection("usuarios")
      .doc(localStorage.getItem("usuario"))
      .collection("lugares")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.lugaresGuardados.push(doc.data());
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  },
  created: function() {
    this.debouncedGetAnswer = _.debounce(this.delimitarArea, 500);
    var user = firebase.auth().currentUser;

    if (user != null) {
      this.email = user.email;
      this.firebaseUid = user.uid;
    }
  },
  methods: {
    /**
     * When the location found
     * @param {Object} addressData Data of the found location
     * @param {Object} placeResultData PlaceResult object
     * @param {String} id Input container ID
     */
    getAddressDiection: function(addressData, placeResultData, id) {
      console.log(placeResultData);
      console.log(id);
      console.log(addressData);
      if (this.map.getLayer("points")) {
        this.map.removeLayer("points");
      }
      if (this.map.getSource("point")) {
        this.map.removeSource("point");
      }
      this.$store.commit("setPoint", {
        lat: addressData.latitude,
        lng: addressData.longitude,
        showup: true
      });
      this.map.flyTo({
        center: [this.puntoSeleccionado.lng, this.puntoSeleccionado.lat],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
      this.newPoint();
    },
    pointListSelected(lugar) {
      if (this.map.getLayer("points")) {
        this.map.removeLayer("points");
      }
      if (this.map.getSource("point")) {
        this.map.removeSource("point");
      }
      var precision = 1000000000000000; // 15 decimals
      var randomnum =
        Math.floor(
          Math.random() * (0 * precision - 1 * precision) + 1 * precision
        ) /
        (1 * precision);
      randomnum = (randomnum - randomnum.toFixed(7)).toFixed(15);
      var lati = (+randomnum + +lugar.lat).toFixed(15);
      var long = (+randomnum + +lugar.long).toFixed(15);
      this.$store.commit("setPoint", {
        lat: parseFloat(lati),
        lng: parseFloat(long),
        showup: true
      });
      this.map.flyTo({
        center: [this.puntoSeleccionado.lng, this.puntoSeleccionado.lat],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
      this.newPoint();
    },
    newPoint() {
      this.radio = 0;
      this.calendarShowup = false;
      this.showButtons = true;
      this.histogramaShowed = false;
      this.heatMapButton.showup = false;
      this.mostrarMensaje = false;
      this.showInfoIcon = false;
      this.mapExpanded = true;
      this.mapContainer.width = "100%";
      this.mapContainer.left = "0%";
      this.histogramaFrame.width = "50%";
      this.popupLugarContainer.left = "50%";
      this.menuShowup = false;
      if (this.map.getLayer("earthquakes-heat")) {
        this.map.removeLayer("earthquakes-heat");
      }
      if (this.map.getLayer("earthquakes-point")) {
        this.map.removeLayer("earthquakes-point");
      }
      if (this.map.getSource("earthquakes")) {
        this.map.removeSource("earthquakes");
      }

      this.heatMapButton.msj = "Mostrar mapa de calor";

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

      this.$store.commit("setDireccion");
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
          }
        }
      });
      this.map.addLayer({
        id: "points",
        type: "symbol",
        source: "point",
        layout: {
          "icon-image": "puntero",
          "icon-size": 0.15
        }
      });
      this.$store.commit("showupTrue");
    },
    format_date(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
    },
    createMap: function() {
      Mapbox.accessToken = this.accessToken;
      this.map = new Mapbox.Map({
        //acceder a map con store
        container: "map",
        style: this.mapStyle,
        center: this.center,
        zoom: this.zoom
      });
      /*this.map.on('moveend', () => {
        console.log(this.$store.state.puntoSeleccionado.showPopup)
      })*/
      this.map.on("dblclick", e => {
        if (this.map.getLayer("points")) {
          this.map.removeLayer("points");
        }
        if (this.map.getSource("point")) {
          this.map.removeSource("point");
        }
        this.$store.commit("setPoint", {
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          showup: true
        });
        this.map.flyTo({
          center: [this.puntoSeleccionado.lng, this.puntoSeleccionado.lat],
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
        this.newPoint();
      });
    },
    esconderMensaje() {
      this.mostrarMensaje = false;
    },
    mostrarAreabtn() {
      this.mostrarArea();
      this.delimitarArea();
    },
    mostrarArea() {
      console.log("Zoom al mapa");
      this.map.fitBounds([
        [
          this.puntoSeleccionado.lng,
          this.puntoSeleccionado.lat + this.radio / 111
        ],
        [
          this.puntoSeleccionado.lng,
          this.puntoSeleccionado.lat - this.radio / 111
        ]
      ]);
    },
    centrarIzquierda() {
      let width = document.getElementById("map").offsetWidth;
      this.map.fitBounds(
        [
          [
            this.puntoSeleccionado.lng,
            this.puntoSeleccionado.lat + this.radio / 111
          ],
          [
            this.puntoSeleccionado.lng,
            this.puntoSeleccionado.lat - this.radio / 111
          ]
        ],
        { offset: [-width / 8, 0] }
      );
    },
    desplegarMenu() {
      if (this.radio > 0) {
        this.mostrarAreabtn();
      }
      this.menuShowup = true;
      this.histogramaShowed = false;
      this.heatMapButton.showup = false;
      this.mapContainer.width = "80%";
      this.mapContainer.left = "20%";
      this.histogramaFrame.width = "50%";
      this.popupLugarContainer.left = "57%";
    },
    indiceDelictivo() {
      if (this.radio > 0) {
        this.radiomsj = false;
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
        if (this.map.getLayer("trees-point")) {
          this.map.removeLayer("trees-point");
        }
        if (this.map.getLayer("trees-heat")) {
          this.map.removeLayer("trees-heat");
        }
        if (this.map.getSource("trees")) {
          this.map.removeSource("trees");
        }
        this.showUpBar = false;
        this.puntoSeleccionado.showPopup = false;
        this.showInfoIcon = true;
        this.buttonMapaCalor.right = "51%";
        this.histoExpanded = false;
        this.mapExpanded = true;
        this.histogramaShowed = true;
        this.menuShowup = false;
        this.heatMapButton.showup = true;
        this.mapContainer.left = "0%";
        this.mapContainer.width = "50%";
        this.histogramaFrame.width = "50%";
        this.solicitudhistograma();
        this.mostrarAreabtn();
        this.centrarIzquierda();
      } else {
        this.radiomsj = true;
      }
    },
    solicitudhistograma() {
      var i = 0;
      var j = 0;
      if (this.opcionSelecc == "dias") {
        //http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio=2000&lat=19.50146&long=-99.24939&opcion=histograma&parametro=diaSemana
        //http://ec2-3-130-122-111.us-east-2.compute.amazonaws.com:7400/?radio=1700&lat=19.54532&long=-99.13508&opcion=histograma&parametro=diaSemana
        let url =
          "https://capitalroute.codes:7400/?radio=" +
          this.radio * 1000 +
          "&lat=" +
          this.puntoSeleccionado.lat.toFixed(5) +
          "&long=" +
          this.puntoSeleccionado.lng.toFixed(5) +
          "&opcion=histograma&parametro=diaSemana";
        //let url = 'http://localhost:8080/diaSemana.json'
        this.x = this.dias;
        axios
          .get(url, { crossdomain: true })
          .then(response => {
            this.info = response.data;
            for (i = 0; i < this.dias.length; i++) {
              this.y[i] = this.info[i + 1];
            }
            console.log(this.y);
            console.log(this.info);
            this.mostrarHistograma();
          })
          .catch(error => {
            console.log(error);
          });
      }

      if (this.opcionSelecc == "meses") {
        this.x = this.meses;
        let url =
          "https://capitalroute.codes:7400/?radio=" +
          this.radio * 1000 +
          "&lat=" +
          this.puntoSeleccionado.lat.toFixed(5) +
          "&long=" +
          this.puntoSeleccionado.lng.toFixed(5) +
          "&opcion=histograma&parametro=mes";
        //let url = 'http://localhost:8080/mes.json'
        axios
          .get(url, { crossdomain: true })
          .then(response => {
            this.info = response.data;
            for (i = 0; i < this.meses.length; i++) {
              this.y[i] = this.info[i + 1];
            }
            this.mostrarHistograma();
          })
          .catch(error => {
            console.log(error);
          });
      }
      if (this.opcionSelecc == "años") {
        this.x = this.años;
        let url =
          "https://capitalroute.codes:7400/?radio=" +
          this.radio * 1000 +
          "&lat=" +
          this.puntoSeleccionado.lat.toFixed(5) +
          "&long=" +
          this.puntoSeleccionado.lng.toFixed(5) +
          "&opcion=histograma&parametro=ano";
        //let url = 'http://localhost:8080/ano.json'
        axios
          .get(url, { crossdomain: true })
          .then(response => {
            this.info = response.data;
            j = 0;
            for (var key in this.info) {
              this.años[j] = key;
              j++;
            }
            j = 0;
            for (var key1 in this.info) {
              this.y[j] = this.info[key1];
              j++;
            }
            console.log(this.x);

            console.log(this.y);

            this.mostrarHistograma();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    mostrarHistograma() {
      var data = [
        {
          x: this.x,
          y: this.y,
          type: "bar"
        }
      ];
      var layout = {
        autosize: true
      };
      Plotly.newPlot("plot", data, layout);
      console.log(this.histogramaGraph.width + this.histogramaGraph.height);
    },
    mapaCalor() {
      if (this.heatMapButton.msj == "Mostrar mapa de calor") {
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
        let url =
          "https://capitalroute.codes:7400/?radio=" +
          this.radio * 1000 +
          "&lat=" +
          this.puntoSeleccionado.lat.toFixed(5) +
          "&long=" +
          this.puntoSeleccionado.lng.toFixed(5) +
          "&opcion=mapaCalor";
        //let url = 'http://localhost:8080/yh.json'
        this.heatMapButton.msj = "Ocultar mapa de calor";
        this.map.addSource("trees", {
          type: "geojson",
          data: url
        });
        this.map.addLayer(
          {
            id: "trees-heat",
            type: "heatmap",
            source: "trees",
            maxzoom: 15,
            paint: {
              // increase weight as diameter breast height increases
              "heatmap-weight": {
                property: "delitos",
                type: "interval",
                stops: [
                  [1, 0],
                  [80, 1]
                ]
              },
              // increase intensity as zoom level increases
              "heatmap-intensity": {
                stops: [
                  [11, 1],
                  [15, 3]
                ]
              },
              // assign color values be applied to points depending on their density
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(236,222,239,0)",
                0.1,
                "rgb(254,217,118)",
                0.2,
                "rgb(254,178,76)",
                0.3,
                "rgb(253,141,60)",
                0.5,
                "rgb(252,78,42)",
                0.7,
                "rgb(227,26,28)",
                0.9,
                "rgb(177,0,38)"
              ],
              // increase radius as zoom increases
              "heatmap-radius": {
                stops: [
                  [11, 15],
                  [15, 20]
                ]
              },
              // decrease opacity to transition into the circle layer
              "heatmap-opacity": {
                default: 1,
                stops: [
                  [16, 1],
                  [18, 0]
                ]
              }
            }
          },
          "waterway-label"
        );
        this.map.addLayer(
          {
            id: "trees-point",
            type: "circle",
            source: "trees",
            minzoom: 15,
            paint: {
              // increase the radius of the circle as the zoom level and dbh value increases
              "circle-radius": {
                property: "delitos",
                type: "exponential",
                stops: [
                  [{ zoom: 15, value: 1 }, 5],
                  [{ zoom: 15, value: 80 }, 10],
                  [{ zoom: 22, value: 1 }, 20],
                  [{ zoom: 22, value: 80 }, 50]
                ]
              },
              "circle-color": {
                property: "delitos",
                type: "exponential",
                stops: [
                  [0, "rgba(236,222,239,0)"],
                  [20, "rgb(254,217,118)"],
                  [40, "rgb(254,178,76)"],
                  [70, "rgb(253,141,60)"],
                  [100, "rgb(252,78,42)"],
                  [130, "rgb(227,26,28)"],
                  [160, "rgb(177,0,38)"]
                ]
              },
              "circle-stroke-color": "white",
              "circle-stroke-width": 1,
              "circle-opacity": {
                stops: [
                  [14, 0],
                  [15, 1]
                ]
              }
            }
          },
          "waterway-label"
        );
      } else if (this.heatMapButton.msj == "Ocultar mapa de calor") {
        if (this.map.getLayer("trees-point")) {
          this.map.removeLayer("trees-point");
        }
        if (this.map.getLayer("trees-heat")) {
          this.map.removeLayer("trees-heat");
        }
        if (this.map.getSource("trees")) {
          this.map.removeSource("trees");
        }
        this.heatMapButton.msj = "Mostrar mapa de calor";
      }
    },
    analisisDelictivo() {
      if (this.radio > 0) {
        this.histoExpanded = false;
        this.mapExpanded = true;
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
        if (this.map.getLayer("trees-point")) {
          this.map.removeLayer("trees-point");
        }
        if (this.map.getLayer("trees-heat")) {
          this.map.removeLayer("trees-heat");
        }
        if (this.map.getSource("trees")) {
          this.map.removeSource("trees");
        }
        this.heatMapButton.msj = "Mostrar mapa de calor";
        this.showUpBar = false;
        this.puntoSeleccionado.showPopup = false;
        this.calendarShowup = false;
        this.showButtons = true;
        this.histogramaShowed = false;
        this.heatMapButton.showup = false;
        this.mostrarMensaje = false;
        this.showInfoIcon = true;
        this.mapExpanded = true;
        this.mapContainer.width = "100%";
        this.mapContainer.left = "0%";
        this.histogramaFrame.width = "50%";
        this.popupLugarContainer.left = "50%";
        this.showInfoIcon = true;
        this.calendarShowup = true;
        this.showButtons = true;
      } else {
        this.radiomsj = true;
      }
    },
    analisDelictivo() {
      console.log("Pos lo lanzamos");

      this.getPredicciones();
      this.calendarShowup = false;
    },
    getPredicciones() {
      console.log(this.date);
      let url =
        "https://capitalroute.codes:7300/?radio=" +
        this.radio * 1000 +
        "&lat=" +
        this.puntoSeleccionado.lat.toFixed(5) +
        "&long=" +
        this.puntoSeleccionado.lng.toFixed(5) +
        "&fechaInicial=" +
        this.format_date(this.date) +
        "%2000:00&fechaFinal=" +
        this.format_date(this.date) +
        "%2023:59";
      //let url = 'http://localhost:8080/responsePredicciones.json'
      axios
        .get(url, { crossdomain: true })
        .then(response => {
          var coorde = response.data;
          console.log(coorde.preds[1].coordenadas[1]);
          var coordena = [];
          for (var i = 0; i < Object.keys(coorde.preds).length; i++) {
            coordena = coordena.concat({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  coorde.preds[i].coordenadas[1],
                  coorde.preds[i].coordenadas[0]
                ]
              },
              properties: {
                fecha: coorde.preds[i].fecha
              }
            });
          }
          this.coordenadas = coordena;
          this.map.addSource("prediction", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: this.coordenadas
            }
          });
          this.map.addLayer({
            id: "predictions",
            type: "symbol",
            source: "prediction",
            layout: {
              "icon-image": "danger",
              "icon-size": 0.5
            }
          });
          this.map.on("click", "predictions", e => {
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
          this.map.on("mouseenter", "predictions", () => {
            this.map.getCanvas().style.cursor = "pointer";
          });

          // Change it back to a pointer when it leaves.
          this.map.on("mouseleave", "predictions", () => {
            this.map.getCanvas().style.cursor = "";
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    maximizeMapa() {
      this.mapExpanded = false;
      this.histogramaShowed = false;
      this.menuShowup = false;

      this.mapContainer.left = "0%";
      this.mapContainer.width = "100%";
      this.histogramaFrame.width = "50%"; //
      this.popupLugarContainer.left = "42%"; // seria false
      this.buttonMapaCalor.right = "1%"; //
      this.mostrarArea();
      //this.histogramaGraph.width = "1720px"; //Por eso no salia el histo
      //this.histogramaGraph.height = "650px";
    },
    minimizaMapa() {
      this.mapExpanded = true;
      this.histogramaShowed = true;
      this.menuShowup = false;
      this.mapContainer.width = "50%";
      this.popupLugarContainer.left = "42%"; //seria false
      this.buttonMapaCalor.right = "51%";
      this.centrarIzquierda();
      //this.histogramaGraph.width = "1720px";
      //this.histogramaGraph.height = "650px";
    },
    minimizarHistograma() {
      this.heatMapButton.showup = true;
      this.histogramaFrame.width = "50%";
      this.histoExpanded = false;
      this.solicitudhistograma();
    },
    ampliarHistograma() {
      this.heatMapButton.showup = false;
      this.histogramaFrame.width = "100%";
      this.histoExpanded = true;
      this.solicitudhistograma();
    },
    cerrarHistograma() {},
    ocultarMenu() {
      if (this.radio > 0) {
        this.mostrarAreabtn();
      }
      this.menuShowup = false;
      this.calendarShowup = false;
      this.showButtons = true;
      this.mapContainer.left = "0%";
      this.mapContainer.width = "100%";
      this.popupLugarContainer.left = "50%";
    },
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
        })
        .catch(function(error) {
          // An error happened.
          console.log(error);
        });
      this.email = null;
      this.firebaseUid = null;
      this.$router.replace("/login");
    },

    delimitarArea() {
      if (this.radio > 0) {
        if (this.map.getLayer("points")) {
          this.map.removeLayer("points");
        }
        if (this.map.getSource("point")) {
          this.map.removeSource("point");
        }
        console.log(
          this.$store.state.puntoSeleccionado.lat,
          this.$store.state.puntoSeleccionado.lng
        );
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
            }
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
                [
                  20,
                  (this.radio * 1000) /
                    0.075 /
                    Math.cos((this.puntoSeleccionado.lat * Math.PI) / 180)
                ]
              ],
              base: 2
            },
            "circle-color": "#1a9ea6",
            "circle-opacity": 0.5,
            "circle-stroke-width": 0,
            "circle-pitch-scale": "map"
          }
        });
      }
    },
    infoPunto() {
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
      if (this.map.getLayer("trees-point")) {
        this.map.removeLayer("trees-point");
      }
      if (this.map.getLayer("trees-heat")) {
        this.map.removeLayer("trees-heat");
      }
      if (this.map.getSource("trees")) {
        this.map.removeSource("trees");
      }
      this.heatMapButton.msj = "Mostrar mapa de calor";
      this.showUpBar = true;
      this.heatMapButton.msj = "Mostrar mapa de calor";
      this.puntoSeleccionado.showPopup = true;
      this.calendarShowup = false;
      this.showButtons = true;
      this.histogramaShowed = false;
      this.heatMapButton.showup = false;
      this.mostrarMensaje = false;
      this.showInfoIcon = false;
      this.mapExpanded = true;
      this.mapContainer.width = "100%";
      this.mapContainer.left = "0%";
      this.histogramaFrame.width = "50%";
      this.popupLugarContainer.left = "50%";
      this.mostrarAreabtn();
    }
  }
};
</script>
<style scoped>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css");
.loginWrapper {
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
}
.loginWrapper > *:not(.bienvenidaFrame) {
  filter: blur(10px);
}
.active > *:not(.bienvenidaFrame) {
  filter: blur(0px);
}
#map {
}
#search {
  position: absolute;
  width: 10%;
  height: 10%;
  left: 50%;
  top: 9%;
}
#seleccionHora {
  position: absolute;
  width: 80%;
  height: 55%;
  left: 10%;
  top: 7%;
  background: #ffffff;
}
#seleccionFecha {
  position: absolute;
  width: 40vh;
  height: 30vh;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
}
#buttonFrame {
  position: absolute;
  width: 17em;
  height: 15vh;
  left: 2%;
  top: 85%;
}
#histogramaFrame {
  background: #ffffff;
}
#indiceButton {
  position: absolute;
  width: 80%;
  height: 30%;
  left: 10%;
  top: 15%;
  background: #1a9ea6;
  border-color: #1a9ea6;
  color: #ffffff;
}
#analisisButton {
  position: absolute;
  width: 80%;
  height: 30%;
  left: 10%;
  top: 50%;
  background: #1a9ea6;
  border-color: #1a9ea6;
  color: #ffffff;
}
#analisButton {
  position: absolute;
  width: 80%;
  height: 30%;
  left: 10%;
  top: 35%;
  background: #1a9ea6;
  border-color: #1a9ea6;
  color: #ffffff;
}
#menuCard {
  position: absolute;
  width: 20%;
  height: 100%;
  left: 0;
  top: 0;
  background: #1a9ea6;
}
#backMenu {
  position: relative;
  width: 1.5em;
  height: 2em;
  left: 85%;
  top: 1.7%;
  background: #1a9ea6;
}
#infoFrame {
  position: absolute;
  width: 80%;
  height: 73%;
  left: 10%;
  top: 22%;
  overflow-y: auto;
  background: #ffffff;
}
#userCard {
  position: absolute;
  width: 85%;
  height: 10%;
  left: 5%;
  top: 7.5%;
  background: #1a9ea6;
}
#userIcon {
  position: absolute;
  width: 3.5vw;
  height: 3vw;
  left: 1%;
  top: 15%;
  background: #1a9ea6;
}
#correoFrame {
  position: relative;
  width: 75%;
  height: 80%;
  left: 25%;
  top: 10%;
  background: #1a9ea6;
}
#lugaresFavoritos {
  position: relative;
  top: 6em;
  color: #dddddd;
}
#correo {
  position: relative;
  width: 100%;
  height: 2em;
  top: 1em;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 2vh;
  line-height: 2em;
  text-align: left;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
#barraMenu {
  position: absolute;
  top: 0;
  left: 0;
  height: 5%;
  width: 100%;
  background: #1a9ea6;
}
.bienvenidaFrame {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30vw;
  height: 35vh;
  background: #1a9ea6;
}
#bienvenidaMessage {
  position: relative;
  left: 50%;
  top: 18%;
  transform: translate(-50%, -50%);
  width: 70%;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 4.5vh;
  line-height: 0.8vh;
  text-align: center;
  color: #ffffff;
}
#mensajePunto {
  position: relative;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 70%;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 2.7vh;
  line-height: 1em;
  text-align: center;
  color: #ffffff;
}
#entendidoButton {
  position: absolute;
  left: 50%;
  top: 75%;
  transform: translate(-50%, -50%);
  width: 12em;
  height: 3em;
  background: #11656a;
  border-color: #11656a;
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
#histogramaTitle {
  position: relative;
  left: 50%;
  top: 18%;
  width: 80%;
  transform: translate(-50%, -50%);
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 2.8vh;
  line-height: 3vh;
  text-align: center;
  color: #000000;
}
/*#calendarioTitle{
  position: relative;
  left: 50%;
  top: 18%;
  width: 80%;
  transform: translate(-50%, -50%);
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 2.8vh;
  line-height: 3vh;
  text-align: center;
  color: #000000;
}*/
#calendario {
  position: relative;
  left: 50%;
  top: 25%;
  width: 70%;
  transform: translate(-50%, -50%);
}
#calendarioButton {
  position: absolute;
  left: 50%;
  top: 70%;
  width: 30%;
  transform: translate(-50%, -50%);
  font-family: Manjari;
  color: #ffffff;
}
#lugarTexto {
  position: absolute;
  width: 80%;
  left: 10%;
  top: 20%;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 3vh;
  line-height: 1em;

  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
#popupLugarContainer {
  position: absolute;
  width: 25vw;
  height: 30vh;
  bottom: -12vh;
  transform: translate(-50%, -50%);
  background: #1a9ea6;
}
#popupLugarContainer h1 {
  position: relative;
  left: 50%;
  top: 10%;
  width: 90%;
  transform: translate(-50%, -50%);
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 2.2vh;
  line-height: 1em;
  text-align: center;
  color: #ffffff;
}
#popupLugarContainer h2 {
  position: relative;
  left: 47%;
  top: 11%;
  width: 90%;
  height: 2.9em;
  transform: translate(-50%, -50%);
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 1.8vh;
  line-height: 1em;
  text-align: left;
  margin: 1em;
  color: #dddddd;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
#popupLugarContainer h3 {
  position: relative;
  left: 45%;
  width: 80%;
  top: 0.2em;
  transform: translate(-50%, -50%);
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 2.1vh;
  line-height: 1em;
  text-align: center;
  margin: 1em;
  color: #ffffff;
}
#popupLugarContainer h4 {
  position: relative;
  left: 45%;
  width: 90%;
  top: -0.9em;
  transform: translate(-50%, -50%);
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  font-size: 1.8vh;
  line-height: 1em;
  text-align: center;
  margin: 1em;
  color: #dddddd;
}
.seleccionarRadio {
  position: relative;
  height: 45%;
  width: 80%;
  left: 7%;
  bottom: 14%;
}
#inputRadio {
  position: relative;
  height: 35%;
  width: 80%;
  left: 0%;
  top: 0%;
}
.seleccionarRadio label {
  position: relative;
  width: 90%;
  left: -10%;
  top: 7%;
  height: 1em;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
#delimitarButton {
  position: relative;
  height: 35%;
  width: 6em;
  left: -10%;
  background: #11656a;
  border-color: #11656a;
  color: #ffff;
}
#menu {
  position: relative;
  width: 3.6vh;
  height: 3.6vh;
  left: 0.7%;
  top: 15%;
  background: #1a9ea6;
}
#logout {
  position: absolute;
  width: 3.6vh;
  height: 3.6vh;
  right: 0.7%;
  top: 15%;
  background: #1a9ea6;
}
#histogramaCard {
  position: absolute;
  width: 100%;
  height: 80%;
  left: 0%;
  top: 17%;
  background: #ffffff;
}
#histo {
  position: absolute;
  width: 90%;
  height: 70%;
  left: 5%;
  top: 5%;
  background: #ffffff;
}
#histobuttons {
  position: absolute;
  width: 60%;
  height: 20%;
  left: 20%;
  top: 90%;
  background: #ffffff;
}
#heatMapButtonStyle {
  position: absolute;
  bottom: 5%;
  background: #1a9ea6;
}
#buttonMapExpand {
  position: absolute;
  left: 46%;
  top: 8%;
  width: 4vh;
  height: 4vh;
}
#buttonMapMinimize {
  position: absolute;
  left: 96%;
  top: 8%;
  width: 4vh;
  height: 4vh;
}
#maximizeIcon {
  position: absolute;
  width: 4vh;
  height: 4vh;
  left: 92%;
  top: 3%;
  background: #ffffff;
}
#minimizeIcon {
  position: absolute;
  width: 4vh;
  height: 4vh;
  left: 96%;
  top: 3%;
  background: #ffffff;
}
#infoPunto {
  position: absolute;
  left: 0.5%;
  top: 6%;
  width: 7vh;
  height: 7vh;
}
#search {
  position: absolute;
  left: 50%;
  top: 10%;
  width: 28vw;
  height: 3em;
  transform: translate(-50%, -50%);
  background: #ffffff;
}
</style>




