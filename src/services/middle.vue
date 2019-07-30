<template>
  <div class="redirecionando">
    <h1 class="text-xs-center font-weight-thin white--text" >Redirecionando em {{ timeLapse }}...</h1>
    <v-btn round outline color="yellow darken-3" to="/home" v-show="erroNoTime"><span class="white--text subtitle">Não foi redirecionado? clique aqui...</span></v-btn>
  </div>
</template>

<script>
import { auth } from './Firebase'

export default {
  data () {
    return {
      email: '',
      senha: '',
      timeLapse: '',
      erroNoTime: false
    }
  },
  methods: {
    loginTrue () {
      var em = this.email
      var se = this.senha
      auth.signInWithEmailAndPassword(em, se)
      .then(
        user => {
          if(user) {
            this.$router.push('/home')
          }
        }
      ).catch(
        error => {
          if(error) {
            this.$router.push('/login')
          }
        }
      )
    },
    enviaParaHome () {
      setTimeout(() => this.loginTrue(), 4000)
      setTimeout(() => this.timeLapse = 4, 1000)
      setTimeout(() => this.timeLapse = 3, 2000)
      setTimeout(() => this.timeLapse = 2, 3000)
      setTimeout(() => this.timeLapse = 1, 4000)
      setTimeout(() => {
        this.timeLapse = 0
        this.erroNoTime = true
      }, 5000)
    },
    getInformacoes () {
      var email = window.localStorage.getItem('e')
      var senha = window.localStorage.getItem('s')
      this.email = email
      this.senha = senha
      this.enviaParaHome()
    }
  },
  mounted () {
    auth.signOut()
    setTimeout(this.getInformacoes(), 1000)
  }
}
</script>

<style>
  .redirecionando {
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #333;
  }
</style>
