<template>
  <div class="registroWrapper">
    <div class="top">
      <div id="backLogin"  type="button" @click="regresar">
        <img src="../assets/back.png" width="100%" height="100%" alt/>
      </div>
    </div>
    <div class="registroCard">
      <div id="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <p id="bienvenidaText">¡Bienvenido a capitalRoute!</p>
      <div id="textoFields">
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <label>Correo electrónico</label>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                solo="solo"
                clearable="clearable"
                dense="dense"
                :rules="emailRules"
                required
                v-model="correo"
              />
            </v-row>
            <v-row no-gutters>
              <label>Confirmar correo electrónico</label>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                solo="solo"
                clearable="clearable"
                dense="dense"
                :rules="emailMatch"
                required
                v-model="confirmacionCorreo"
              />
            </v-row>
            <v-row no-gutters>
              <label>Contraseña</label>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                solo="solo"
                clearable="clearable"
                dense="dense"
                type="password"
                :rules="passwordRules"
                required
                v-model="password"
              />
            </v-row>
            <v-row no-gutters>
              <label>Confirmar password</label>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                solo="solo"
                clearable="clearable"
                dense="dense"
                type="password"
                :rules="passwordMatch"
                required
                v-model="confirmacionPassword"
              />
            </v-row>
          </v-container>
        </v-form>
      </div>
      <div id="buttonWrapper">
        <v-btn id="crearCuentaBoton" :disabled="!valid" @click="crearCuenta()">CREAR CUENTA</v-btn>
      </div>
    </div>
    <div class="bottom"></div>
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
</template>
<script>
//import { functions } from "firebase";
import firebase from "firebase";
export default {
  data() {
    return {
      entendidoButton: "Entendido",
      tituloSolicitud: "",
      mensajeSolicitud: "",
      errorCard: false,
      valid: false,
      correo: "",
      confirmacionCorreo: "",
      password: "",
      confirmacionPassword: "",
      emailRules: [
        v => !!v || "Se necesita un correo electrónico",
        v => /.+@.+/.test(v) || "Correo electrónico no válido"
      ],
      emailMatch: [
        v => !!v || "Se requiere confirmar el correo",
        () =>
          this.correo === this.confirmacionCorreo || "El correo debe coincidir"
      ],
      passwordRules: [
        v =>
          !!v ||
          "La contraseña debe tener al menos una minuscula, una mayuscula, un número y tener al menos 6 caracteres",
        v =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])+.{6,}$/.test(v) ||
          "Contraseña no válida"
      ],
      passwordMatch: [
        v => !!v || "Se requiere confirmar la contraseña",
        v => v === this.password || "La contraseña debe coincidir"
      ]
    };
  },
  methods: {
    regresar() {
      this.$router.replace("/login");
    },
    redirecciona() {
      if (this.entendidoButton == "De acuerdo") {
        this.$router.replace("/login");
      }
      this.errorCard = false;
    },
    crearCuenta() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.correo, this.password)
        .then(() => {
          this.tituloSolicitud = "Genial!";
          this.mensajeSolicitud = "Tu cuenta ha sido creada con éxito";
          this.entendidoButton = "De acuerdo";
          this.errorCard = true;
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          if (errorCode == "auth/email-already-in-use") {
            this.tituloSolicitud = "Algo ha salido mal";
            this.mensajeSolicitud =
              "El correo que has introducido ya se encuentra en uso, vuelve a intentarlo usando otro correo";
            this.errorCard = true;
          } else if (errorCode == "auth/invalid-email") {
            this.tituloSolicitud = "Algo ha salido mal";
            this.mensajeSolicitud =
              "El correo que has introducido no es valido, vuelve a intentarlo con una dirección de correo válida";
            this.errorCard = true;
          } else {
            this.tituloSolicitud = "Algo ha salido mal";
            this.mensajeSolicitud = "Un error ha ocurrido, inténtalo más tarde";
            this.errorCard = true;
          }

          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
@media (min-width: 2000px) {
  .registroCard {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 40vw;
    height: 90vh;
  }
  #textoFields {
    position: relative;
    left: 50%;
    top: 38%;
    transform: translate(-50%, -50%);
    width: 30vw;
    height: 70vh;
    padding: 5em;
  }
  #textoFields form {
    position: relative;
    top: -5em;
    padding: 100px;
    height: 400vh;
  }
  #crearCuentaBoton {
    position: relative;
    background-color: #1a9ea6;
    color: #ffffff;
    width: 10em;
    height: 5vh;
    top: -8em;
  }
}
@media (min-width: 1000px) and (max-width: 1450px) {
  #textoFields form {
    position: relative;
    top: -1em;
  }
  #crearCuentaBoton {
    top: 1.5em;
  }
  #bienvenidaText {
    position: relative;
    top: -.5em;
  }
}
#backLogin {
  position: relative;
  left: 0%;
  top: 0%;
  width: 9vh;
  height: 10vh;
  background: #1a9ea6;
}
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
#textoFields {
  position: relative;
  left: 50%;
  top: 38%;
  transform: translate(-50%, -50%);
  width: 30vw;
  height: 50vh;
}
#textoFields label {
  float: left;
}
#crearCuentaBoton {
  position: relative;
  background-color: #1a9ea6;
  color: #ffffff;
  width: 10em;
  height: 5vh;
}
#buttonWrapper {
  position: relative;
  top: -3vh;
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