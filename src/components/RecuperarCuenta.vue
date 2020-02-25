<template>
  <div class="recuperarWrapper">
    <div class="top"></div>
    <div class="recuperarCard">
      <div id="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <p id="textoIndicaciones">
        Ingresa tu correo electrónico.
        <br />Te enviaremos un correo electrónico con más indicaciones
      </p>
      <div id="correoWrapper">
        <label for="correo">Correo electrónico</label>
        <input type="text" name="correo" v-model="correo"/>
      </div>
      <div id="buttonWrapper">
        <button id="recuperarButton" @click="recuperacionCuenta()">ENVIAR CORREO</button>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
import firebase from 'firebase';
export default {
  data() {
    return {
        correo : ""
    };
  },
  methods:{
    recuperacionCuenta(){
      firebase.auth().sendPasswordResetEmail(this.correo).then(function() {
        console.log("Algo anda bien :)");
        
      }).catch(function(error) {
        console.log("Algo anda mal :/");
        console.log(error);
      });
      this.$router.replace("/login");
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
  top: 20%;
  transform: translateX(70%);
  width: 40%;
  height: 60%;
}
#logo {
  position: relative;
  top: -2%;
}
#logo img {
  height: 130px;
}
#textoIndicaciones {
  font-weight: bolder;
}
#correoWrapper {
  position: relative;
  top: 10%;
}
#correoWrapper input {
  width: 50%;
  position: relative;
  left: 0%;
}
#correoWrapper label {
  float: left;
  width: 50%;
}
#recuperarButton {
  background-color: #1a9ea6;
  color: #ffffff;
  width: 40%;
  height: 10%;
}
#buttonWrapper {
  position: relative;
  top: 20%;
  left: -25%;
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