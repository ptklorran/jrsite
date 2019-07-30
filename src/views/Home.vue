<template>
  <div class="home">
    <v-toolbar app class="elevation-1" dark color="grey darken-3" >
      <v-btn
        flat
        icon
        @click.prevent="drawer = !drawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
      <v-toolbar-title class="title" >
        <span> {{ TEXTO_DRAWER }} </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn round color="yellow darken-4"> <span class="grey--text"><span class="white--text hidden-sm-and-down">Meus Rendimentos: </span> <span class="white--text font-weight-bold"> R$ {{ SALDO }} </span></span> </v-btn>
    </v-toolbar>
    
    <v-navigation-drawer
      app
      dark
      v-model="drawer"
      width="250"
      class="elevation-0 bg"
    >
      <v-toolbar width="300" class="elevation-0 transparent">
        <v-toolbar-title class="title" >
          <v-layout row>
            <v-img class="mr-3 p-2" height="20" width="20" src="https://firebasestorage.googleapis.com/v0/b/investfacil-d1f3d.appspot.com/o/logo.png?alt=media&token=ff5da0ed-e347-4095-a9d7-8173f7431087"></v-img>
            <span class="text-xs-center text-uppercase">Invest</span>
            <span class="font-weight-light text-xs-center text-uppercase">Fácil</span>
          </v-layout>
        </v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list
        class="ml-2"
      >
        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Dashboard')" to="/home/dashboard">
          <v-icon size="20" class="mr-3">
            pie_chart
          </v-icon>
          Dashboard
        </v-list-tile>

        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Compre Uma Cota')" to="/home/adicionarfundos" v-ripple>
          <v-icon size="20" class="mr-3">
            monetization_on
          </v-icon>
          Adicionar Cotas
        </v-list-tile>
        
        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Meu Perfil')" to="/home/meuperfil" v-ripple>
          <v-icon size="20" class="mr-3">
            person
          </v-icon>
          Meu Perfil
        </v-list-tile>
        
        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Minhas Cotas')" to="/home/minhascotas" v-ripple>
          <v-icon size="20" active-class="menuAtivo" class="mr-3">
            person
          </v-icon>
          Minhas Cotas
        </v-list-tile>

        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Envie um ticket')" to="/home/tickets">
          <v-icon size="20" class="mr-3">
            forum
          </v-icon>
          Tickets
        </v-list-tile>


        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Solicite seu pagamento')" to="/home/querosolicitarpagamento">
          <v-icon size="20" class="mr-3">
            how_to_vote
          </v-icon>
          Solicitar Pagamento
        </v-list-tile>

        <v-list-tile active-class="menuAtivo" v-if="this.$store.getters.GET_FULL_PERFIL.admin === true" to="/admin">
          <v-icon size="20" class="mr-3">
            lock
          </v-icon>
          Área Admin
        </v-list-tile>

        <v-list-tile active-class="menuAtivo" @click.prevent="sair">
          <v-icon size="20" class="mr-3">
            directions_run
          </v-icon>
          Sair
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <div class="content">
      <transition name="router-anim">
        <div style="display: flex; width: 100%">
          <router-view/>
          <v-card v-if="DIV_HOME" light class="pa-2" style="margin-top: -66px; display: flex; width: 100%; height: 120vh; border-radius: 10px;">
            <iframe src="https://br.widgets.investing.com/top-cryptocurrencies?theme=lightTheme&roundedCorners=true" width="100%" height="100%" frameborder="0" allowtransparency="true" marginwidth="0" marginheight="0"></iframe>
          </v-card>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { auth, db } from '../services/Firebase.js'

export default {
  data () {
    return {
      drawer: false,
      saldo: 0,
      usuario: null ,
      emailLocal: ''
    }
  },
  computed: {
    DIV_HOME () {
      return this.$store.getters.DIV_HOME
    },
    TEXTO_DRAWER () {
      return this.$store.getters.TEXTO_DRAWER
    },
    GET_FULL_PERFIL () {
      return this.$store.getters.GET_FULL_PERFIL
    },
    SALDO () {
      var saldo = this.$store.getters.GET_FULL_PERFIL.saldo_disponivel
      var saldoFixado = parseFloat(saldo).toFixed(2)
      return saldoFixado
    }
  },
  methods: {
    //passo 0
    logadoOuNao () {
      auth.onAuthStateChanged(user => {
        if(user) {
          var usuarioAtual = auth.currentUser.uid 
          this.pegaUsuario(usuarioAtual)
        } else {
          return this.$router.push('/login')
        }
      })
    },
    //passo 1
    pegaUsuario(usuarioAtual) {
      var query = db.ref('usuarios/' + usuarioAtual)
      query.on('value', snapshot => {
        var atualUsuario = snapshot.val()
        this.usuario = atualUsuario
        this.$store.dispatch('SET_PERFIL', atualUsuario)
      })
    },
    sair () {
      auth.signOut()
      this.$router.push('/')
    },
    mudaTextoToolbar (texto) {
      this.$store.dispatch('MUDA_TEXTO_TOOLBAR', texto)
    }
  },
  created () {
    this.logadoOuNao()
  }
}
</script>

<style>
  .content {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .menuAtivo {
    background-color: #F9A825;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  .menuAtivo:hover {
    border-radius: 5px;
  }

  .bg {
    display: flex;
    flex-direction: column;
    background-image: rgb(173, 52, 52)
  }

  .router-anim-enter-active {
    animation: coming 0.4s;
    animation-delay: 0.6s;
    opacity: 0;
  }

  .router-anim-leave-active {
    animation: going 0.4s
  }

  @keyframes going {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-10px);
      opacity: 0;
    }
  }

  @keyframes coming {
   from {
     transform: translateX(-10px);
     opacity: 0;
   }
   to {
     transform: translateX(0px);
     opacity: 1;
   }
  }
</style>

