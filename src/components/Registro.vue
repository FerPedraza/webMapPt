<template>
  <div class="registroWrapper">
    <div class="top"></div>
    <div class="registroCard">
      <div id="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <p id="bienvenidaText">¡Bienvenido a capitalRoute!</p>
      <div id="textoFields">
        <v-form v-model="valid">
          <v-container>
        <v-row no-gutters>
          <label >Correo electrónico</label>
        </v-row>
        <v-row no-gutters>
          <v-text-field solo="solo" clearable="clearable" dense="dense" :rules="emailRules" required  v-model="correo" />
        </v-row>
        <v-row no-gutters>
          <label >Confirmar correo electrónico</label>
        </v-row>
        <v-row no-gutters> 
          <v-text-field solo="solo" clearable="clearable" dense="dense" :rules="emailMatch" required  v-model="confirmacionCorreo" />
        </v-row>
        <v-row no-gutters>
          <label >Contraseña</label>
        </v-row>
        <v-row no-gutters>  
          <v-text-field solo="solo" clearable="clearable" dense="dense" type="password" :rules="passwordRules" required v-model="password" />
        </v-row>
        <v-row no-gutters>
          <label >Confirmar password</label>
        </v-row>
        <v-row no-gutters>  
          <v-text-field solo="solo" clearable="clearable" dense="dense" type="password" :rules="passwordMatch" required v-model="confirmacionPassword" />
        </v-row>
        </v-container>
        </v-form>
      </div>
      <div id="buttonWrapper">
        <v-btn id="crearCuentaBoton" :disabled="!valid" @click="crearCuenta()">CREAR CUENTA</v-btn>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
//import { functions } from "firebase";
//import firebase from 'firebase';
export default {
  data() {
    return {
        valid: false,
        correo : "",
        confirmacionCorreo : "",
        password : "",
        confirmacionPassword : "",
        emailRules: [
          v => !!v || 'Se necesita un correo electrónico',
          v => /.+@.+/.test(v) || 'Correo electrónico no válido',
        ],
        emailMatch: [
          v => !!v || 'Se requiere confirmar el correo',
          () => (this.correo === this.confirmacionCorreo) || 'El correo debe coincidir',
        ],
        passwordRules: [
          v => !!v || 'La contraseña debe tener al menos una minuscula, una mayuscula y un número',
          v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])+/.test(v) || 'Contraseña no válida',
        ],
        passwordMatch: [
          v => !!v || 'Se requiere confirmar la contraseña',
          (v) => (v === this.password) || 'La contraseña debe coincidir',
        ],

    };
  },
  methods:{
    crearCuenta(){
      console.log(this.valid);    }



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
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 40vw;
  height: 60vh;
}
#bienvenidaText {
  font-size: 2.8vh;
  text-align: center;
  margin-top: 9%;
}
#logo {
  position: relative;
  left: 50%;
  top: 15%;
  transform: translate(-50%, -50%);
  width: 12vh;
  height: 12vh;
}
#logo img {
  width: 100%;
  height: 100%;
}
#textoFields{
  position: relative;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  width: 30vw;
  height: 50vh;
}
#textoFields label {
  float: left;
}
#crearCuentaBoton {
  background-color: #1a9ea6;
  color: #ffffff;
  width: 10em;
  height: 5vh;
}
#buttonWrapper {
  position: relative;
  top: -2vh;
}

.top {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 10vh;
  left: 0px;
  top: 0px;
}
.bottom {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 10vh;
  left: 0px;
  bottom: 0px;
}
</style>