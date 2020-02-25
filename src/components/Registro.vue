<template>
  <div class="registroWrapper">
    <div class="top"></div>
    <div class="registroCard">
      <div id="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <p id="bienvenidaText">¡Bienvenido a capitalRoute!</p>
      <div id="textoFields">
        <label for="correo">Correo electrónico</label>
        <input type="text" placeholder name="correo" v-model="correo" />
        <label for="confirmacionCorreo">Confirmar correo electrónico</label>
        <input type="text" placeholder name="confirmacionCorreo" v-model="confirmacionCorreo" />
        <label for="password">Contraseña</label>
        <input type="password" placeholder name="password" v-model="password" />
        <label for="confirmacionPassword">Confirmar password</label>
        <input
          type="password"
          placeholder
          name="confirmacionPassword"
          v-model="confirmacionPassword"
        />
      </div>
      <div id="buttonWrapper">
        <button id="crearCuentaBoton" @click="crearCuenta()">CREAR CUENTA</button>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
//import { functions } from "firebase";
import firebase from 'firebase';
export default {
  data() {
    return {
        correo : "",
        confirmacionCorreo : "",
        password : "",
        confirmacionPassword : ""
    };
  },
  methods:{
    crearCuenta(){
      /*let data = {
        correo: this.correo,
        password: this.password,
      };
      db.collection('usuarios').doc(this.RFC);
      db.collection('usuarios').doc(this.RFC).set(data);
      */
      firebase.auth().createUserWithEmailAndPassword(this.correo, this.password).catch(function(error) {
        console.log(error.message)
      });
      this.$router.replace("/login");
    }



  }

};
</script>
<style scoped>
.registroWrapper {
  width: 100%;
  height: 100%;
}
.registroCard {
  position: absolute;
  top: 20%;
  transform: translateX(70%);
  width: 40%;
  height: 60%;
}
#bienvenidaText {
  font-size: 24px;
  text-align: center;
}
#logo {
  position: relative;
  top: -2%;
}
#textoFields input {
  display: block;
  position: relative;
  left: 10%;
  margin-bottom: 1.8em;
  width: 40%;
}
#textoFields label {
  float: left;
  width: 10em;
}
#crearCuentaBoton {
  background-color: #1a9ea6;
  color: #ffffff;
  width: 40%;
  height: 1%;
}
#buttonWrapper {
  position: relative;
  bottom: 3%;
}
#logo img {
  height: 130px;
}
.top {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 130px;
  left: 0px;
  top: 0px;
}
.bottom {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 130px;
  left: 0px;
  bottom: 0px;
}
</style>