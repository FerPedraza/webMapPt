<template>
  <div class="loginWrapper">
    <div class="top"></div>
    <div class="loginCard">
      <div id="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="textInput">
        <v-row id="userInput" no-gutters>
          <v-col cols="auto" sm="3">
            <img src="../assets/user.png" alt />
          </v-col>
          <v-col cols="auto" sm="8">
            <v-text-field v-model="usuario" label="Usuario"></v-text-field>
          </v-col>
        </v-row>
        <v-row id="passwordInput" no-gutters>
          <v-col cols="auto" sm="3">
            <img src="../assets/lock.png" alt />
          </v-col>
          <v-col cols="auto" sm="8">
            <v-text-field type="password" label="Contraseña" v-model="password" />
          </v-col>
        </v-row>
      </div>
      <div id="googleLogin" @click="loginGoogle">
        <img type="button" src="../assets/google-icon.png" alt />
      </div>
      <div id="loginButtonWrapper">
        <v-btn id="loginButton" @click="login">LOGIN</v-btn>
      </div>
      <div id="extraText">
        <a id="olvidarPassword" @click="olvidarPasswd">¿Olvidaste tu Contraseña?</a>
        <a id="createCuenta" @click="crearCuenta">Crear nueva cuenta</a>
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
      firebase.auth().useDeviceLanguage();
      firebase
        .auth()
        .signInWithEmailAndPassword(this.usuario, this.password)
        .then(user => {
          console.log(user);
          localStorage.setItem("usuario", this.usuario);
          this.$router.replace("/inicio");
        })
        .catch(function() {
          alert("Error al Iniciar Sesion");
        });
    },
    loginGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();
      var self = this;
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          //var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user.email;
          localStorage.setItem("usuario", user);
          self.$router.replace("/inicio");
          // ...
        })
        .catch(function() {
          // Handle Errors here.
          alert("Error al Iniciar Sesion");
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
@media (min-width: 300px) and (max-width: 400px) {
  .textInput #userInput {
    position: relative;
    top: -1.5em;
  }
  .textInput #passwordInput {
    position: relative;
    top: -3em;
  }
  .textInput img {
    position: relative;
    top: 3em;
    right: 3em;
  }
  #loginButtonWrapper button {
    position: relative;
    top: -11em;
  }
  #extraText a {
    position: relative;
    top: -6em;
    right: -8em;
    margin-left: -7em;
    margin-right: -2em;
    font-size: 0.86em;
  }
  #googleLogin img {
    position: relative;
    top: -2em;
  }
}
@media (min-width: 500px) and (max-width: 800px) {
  .textInput img {
    position: relative;
    top: 3em;
    right: 3em;
  }
  #googleLogin img {
    position: relative;
    top: -2em;
  }
  #loginButtonWrapper button {
    position: relative;
    top: -4em;
  }
  #extraText a {
    position: relative;
    top: -3em;
    margin-left: -7em;
    margin-right: -2em;
    right: -8em;
  }
}
.loginWrapper {
  width: 100%;
  height: 100%;
}
.loginError {
  border-radius: 1em;
  border-style: dashed;
  color: red;
}
.loginCard {
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
.textInput {
  position: relative;
  top: 10%;
  padding: 3%;
  left: 0%;
}
.textInput img {
  width: 5vh;
  height: 5vh;
  margin-right: 5%;
  margin-top: 5%;
}
#passwordInput {
  position: relative;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
  width: 60%;
  margin: 1%;
}
#userInput {
  position: relative;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
  width: 60%;
  margin: 1%;
}
#googleLogin {
  position: relative;
  top: 3%;
}
#loginButtonWrapper {
  position: relative;
  top: 10%;
}
#loginButton {
  background-color: #1a9ea6;
  color: #ffffff;
  width: 8em;
}
#extraText {
  position: relative;
  top: 7vh;
}
#olvidarPassword {
  position: relative;

  left: -30%;
}
#createCuenta {
  position: relative;
  right: -30%;
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