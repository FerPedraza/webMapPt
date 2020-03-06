<template>
  <div class="loginWrapper">
    <div class="top"></div>
    <div class="loginCard">
      <div id="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="textInput">
        <div id="userInput">
          <img src="../assets/user.png" alt />
          <input type="text" placeholder="Usuario" v-model="usuario" />
        </div>
        <div id="passwordInput">
          <img src="../assets/lock.png" alt />
          <input type="password" placeholder="Contraseña" v-model="password" />
        </div>
      </div>
      <div id="googleLogin"  @click="loginGoogle">
        <img type="button" src="../assets/google-icon.png" alt />
      </div>
      <div id="loginButtonWrapper">
        <button id="loginButton" @click="login">LOGIN</button>
      </div>
      <div id="extraText">
        <a href id="olvidarPassword" @click="olvidarPasswd">¿Olvidaste tu Contraseña?</a>
        <a href id="createCuenta" @click="crearCuenta">Crear nueva cuenta</a>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
import firebase from "firebase";
//import { db } from "@/main";
export default {
  data() {
    return {
      password: "",
      usuario: ""
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.usuario, this.password)
        .then(user => {
          localStorage.setItem("usuario", user);
          this.$router.replace("/inicio");
        });
    },
    loginGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();
      var self = this
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        localStorage.setItem("usuario", user);
        self.$router.replace("/inicio");
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        console.log(error);
        //var errorCode = error.code;
        //var errorMessage = error.message;
        // The email of the user's account used.
        //var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        //var credential = error.credential;
        // ...
      });
      
      
    },
    olvidarPasswd() {
      this.$router.replace("/recuperarCuenta");
    },
    crearCuenta() {
      this.$router.replace("/registro");
      
    }
  }
};
</script>
<style scoped>
.loginWrapper {
  width: 100%;
  height: 100%;
}
.loginCard {
  position: absolute;
  top: 20%;
  transform: translateX(70%);
  width: 42%;
  height: 60%;
}
#logo {
  position: relative;
  top: 5%;
}
#logo img {
  height: 130px;
}
.textInput {
  position: relative;
  top: 10%;
  padding: 3%;
  left: 0%;
}
.textInput img {
  margin-right: 1%;
}
#passwordInput {
  margin: 0.5%;
}
#userInput {
  margin: 0.5%;
}
#googleLogin {
  position: relative;
  top: 10%;
}
#loginButtonWrapper {
  position: relative;
  top: 15%;
}
#loginButton {
  background-color: #1a9ea6;
  color: #ffffff;
  width: 8em;
}
#extraText {
  position: relative;
  bottom: -15%;
}
#olvidarPassword {
  float: left;
  position: fixed;
  left: -20%;
}
#createCuenta {
  float: right;
  position: fixed;
  right: -20%;
}
.top {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 12%;
  left: 0px;
  top: 0px;
}
.bottom {
  position: absolute;
  background-color: #1a9ea6;
  width: 100%;
  height: 13%;
  left: 0px;
  bottom: 0px;
}
</style>