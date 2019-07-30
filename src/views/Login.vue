<template>
  <div class="principal" style="background-image: #333">
    <div style="display: flex; width: 100%; justify-content: center; align-items: center" class="mb-4">
      <img height="20" width="20" class="mr-2 mb-1" src="https://firebasestorage.googleapis.com/v0/b/investfacil-d1f3d.appspot.com/o/logo.png?alt=media&token=ff5da0ed-e347-4095-a9d7-8173f7431087"/>
      <span class="headline white--text text-xs-center text-uppercase">Invest</span>
      <span class="headline white--text font-weight-thin text-xs-center text-uppercase">Fácil</span>
    </div>
    <span class="text-xs-center headline font-weight-thin white--text mb-3"> Faça Login Na sua Conta </span>
    <v-flex
      xs12
      md6
      pa-4
      class="loginForm"
    >
      <v-card light class="elevation-0">
      <v-flex xs12>
        <v-text-field color="yellow darken-3" v-model="email" box label="Email" />
      </v-flex>
      <v-flex xs12>
        <v-text-field color="yellow darken-3"
          :append-icon="showPass ? 'visibility' : 'visibility_off'"
          :type="showPass ? 'text' : 'password'"
          @click:append="showPass = !showPass"
          @keydown.enter="login" v-model="senha"
          box 
          label="Senha" />
      </v-flex>
      <v-flex xs12>
        <v-btn
          block
          large
          round
          class="yellow darken-3"
          @click="login"
        >
          <span v-if="!carregandoLogin" class="text-xs-center black--text">Entrar</span>
          <v-progress-circular indeterminate v-if="carregandoLogin"></v-progress-circular>
        </v-btn>
      </v-flex>
      <v-flex xs12 ma-2>
        <v-divider></v-divider>
      </v-flex>
      </v-card>
    </v-flex>
    <div>
      <a flat>
        <span @click="alteraSenhaDialog = true" class="text-weight-thin caption white--text ">Esqueci a senha</span>
      </a>
    </div>
    <v-dialog
      absolute
      width="300"
      v-model="alteraSenhaDialog"
    >
      <v-flex xs12>
        <v-card
          class="pa-3"
        >
          <h3 class="text-xs-center">Quero Alterar Minha Senha</h3>
          <v-divider class="mt-2"></v-divider>
          <v-text-field
            label="Qual é o seu email?"
            color="yellow darken-3"
            v-model="email"
          >
          </v-text-field>
          <v-btn block round color="yellow darken-3" @click="enviaLinkRecuperacaoDeSenha">Enviar link de recuperação</v-btn>
          <div
            v-show="enviaLinkRecuperacao"
            class="mt-3"
            style="display: flex; width: 100%; justify-content: center; align-items: center"
          >
            <h4>Email enviado</h4>
            <v-icon
              class="ml-2"
              color="green"
            >
              check
            </v-icon>
          </div>
        </v-card>
      </v-flex>
    </v-dialog>
    <v-dialog
      absolute
      width="300"
      v-model="error"
    >
      <v-flex xs12>
        <v-card
          class="pa-3"
        >
          <h3 class="text-xs-center">Tivemos um erro</h3>
          <v-divider class="mt-2"></v-divider>
          <h2 class="font-weight-light mt-3 mb-3">{{ errorMessage }}</h2>
          <v-btn
            block
            round
            color="yellow darken-3"
            @click="error = false, errorMessage = ''"
          >
            Vou tentar novamente
          </v-btn>
        </v-card>
      </v-flex>
    </v-dialog>
  </div>
</template>

<script>
import { auth } from '../services/Firebase.js'

export default {
  data () {
    return {
      email: '',
      senha: '',
      showPass: false,
      entrando: false,
      error: false,
      errorMessage: '',
      alteraSenhaDialog: false,
      enviaLinkRecuperacao: false,
      carregandoLogin: false
    }
  },
  methods: {
    login() {
      const emailLogin = this.email
      const senhaLogin = this.senha
      this.carregandoLogin = true
      sessionStorage.clear()
      auth.signInWithEmailAndPassword(emailLogin, senhaLogin)
        .then(async user => {
          if(user) {
            this.carregandoLogin = false
            const usuarioUid = await auth.currentUser.uid
            sessionStorage.usuario = this.email
            sessionStorage.senha = this.senha
            sessionStorage.usuarioUid = usuarioUid 
            this.$store.dispatch('S', senhaLogin)
            this.$store.dispatch('E', emailLogin)
            this.$router.push('/login2')
          }
        })
        .catch(erro => {
          if(erro) {
            this.carregandoLogin = false
            this.error = true,
            this.errorMessage = erro
          }
        })
    },
    enviaLinkRecuperacaoDeSenha() {
      auth.sendPasswordResetEmail(this.email)
      .then(
        () => this.enviaLinkRecuperacao = true
      )
      .catch(
        erro => {
          this.error = true
          this.errorMessage = erro
        }
      )
      
    }
  }
}
</script>


<style>
  .principal {
    background-color: #333
  }
  .loginForm {
    border-radius: 5px;
    display: flex;
    padding: 16px;
    opacity: 0.9;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: #fdfcfc;
  }
</style>
