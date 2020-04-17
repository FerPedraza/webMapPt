<template>
  <v-app>
  <div class="recuperarWrapper">
    <div class="top"></div>
    <div class="recuperarCard">
      <div id="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div id="textoIndicaciones">
      <h1>
        Te enviaremos un correo electrónico con más indicaciones.
        </h1>
        <h2><br />Ingresa tu correo electrónico</h2>
      </div>
      <div id="correoWrapper">
        <v-row no-gutters>
          <label >Correo electrónico</label>
        </v-row>
        <v-row no-gutters>
          <v-text-field solo="solo" clearable="clearable" dense="dense" :rules="emailRules" required  v-model="correo" />
        </v-row>
      </div>
      <div id="buttonWrapper">
        <v-btn id="recuperarButton" @click="recuperacionCuenta()">ENVIAR CORREO</v-btn>
      </div>
      <v-dialog v-model="errorCard" persistent max-width="290" justify="center">
        <v-card>
          <v-card-title class="headline">{{tituloSolicitud}}</v-card-title>
          <v-card-text>{{mensajeSolicitud}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#1a9ea6" text @click="redirecciona">{{entendidoButton}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="bottom"></div>
  </div>
  </v-app>
</template>
<script>
import firebase from 'firebase';
export default {
  data() {
    return {
        correo : "",
        emailRules: [
          v => !!v || 'Se necesita un correo electrónico',
          v => /.+@.+/.test(v) || 'Correo electrónico no válido',
        ],
        tituloSolicitud: "",
        mensajeSolicitud: "",
        entendidoButton: "Entendido",
        errorCard: false,
    };
  },
  methods:{
    redirecciona(){
      if(this.entendidoButton == 'De acuerdo'){
        this.$router.replace("/login");
      }
      this.errorCard = false;
    },
    recuperacionCuenta(){
      firebase.auth().sendPasswordResetEmail(this.correo).then(() => {
        this.tituloSolicitud = 'Bien!';
        this.mensajeSolicitud = 'Más instrucciones han sido enviadas. Revisa tu correo';
        this.entendidoButton = 'De acuerdo';
        this.errorCard = true;
      }).catch((error) => {
          this.tituloSolicitud = 'Algo salió mal';
          this.mensajeSolicitud = 'Un error ha ocurrido, inténtalo más tarde';
          this.errorCard = true;
          console.log(error);
      });
    }

  }
};
</script>
<style scoped>
.recuperarWrapper {
  width: 100%;
  height: 100%;
}
.recuperarCard {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40vw;
  height: 60vh;
}
#logo {
  position: relative;
  left: 50%;
  top: 12%;
  transform: translate(-50%, -50%);
  width: 15vh;
  height: 15vh;
}
#logo img {
  width: 100%;
  height: 100%;
}
#textoIndicaciones {
  position: relative;
  left: 50%;
  top: 18%;
  transform: translate(-50%, -50%);
  width: 70%;
  font-family: Manjari;
  font-style: normal;
  font-weight: normal;
  line-height: 0.8em;
  text-align: left;
}
#textoIndicaciones h1{
  font-size: 1.2em;
}
#textoIndicaciones h2{
  font-size: 1.1em;
}
#correoWrapper {
  position: relative;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 20%;
}
#correoWrapper label {
  float: left;
}
#recuperarButton {
  background-color: #1a9ea6;
  color: #ffffff;
  width: 10em;
  height: 5vh;
}
#buttonWrapper {
  position: relative;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 15%;
}
.top {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 12vh;
  left: 0px;
  top: 0px;
}
.bottom {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 13vh;
  left: 0px;
  bottom: 0px;
}
</style>