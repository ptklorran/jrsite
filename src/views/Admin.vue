<template>
  <div class="home">
    <v-dialog v-model="addPorcentagemDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card light>
        <v-toolbar dark height="80" color="grey darken-4">
          <v-btn icon @click="addPorcentagemDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title class="hidden-sm-and-down">Pagamentos</v-toolbar-title>
          <v-spacer class="hidden-sm-and-down"></v-spacer>
          <v-text-field
            clearable
            type="number"
            outline
            color="yellow darken-3"
            class="mt-3"
            label="Porcentagem"
            placeholder="% aqui"
            v-model="porcentagem"
          ></v-text-field>
          <v-btn
            round
            color="yellow darken-3"
            @click="calculaPagamento">
            Calcular
          </v-btn>
          <v-btn
            round
            color="yellow darken-3"
            @click="pagarCotas">
            Pagar
          </v-btn>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Dados</v-subheader>
          <v-list-tile
            v-for="(pagamento, index) in listaDePagamentos"
            :key="index"
          >
            <v-list-tile-avatar>
              <v-avatar class="elevation-1">
                <v-icon
                  color="yellow darken-3"
                >
                  person
                </v-icon>
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ pagamento.nome }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                <span>{{ pagamento.numero_cotas }} cotas =</span>
                <span class="green--text"> + R${{pagamento.valor | moeda }}</span>
                <span> ({{ porcentagem }}%)</span>
              </v-list-tile-sub-title>
              <v-list-tile-sub-title>
                <span round outline small color="yellow darken-3">
                  antes: <span class="red--text">{{ pagamento.saldo_atual | moeda }}</span> ->
                </span>
                <span round outline small color="green">
                  agora: <span class="green--text">R$ {{ pagamento.saldo_novo | moeda }}</span>
                </span>
              <v-divider></v-divider>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
    <v-toolbar app class="elevation-1">
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
      
      <v-btn class="warning" round @click="addPorcentagem" outline>Adicionar % diária</v-btn>
    </v-toolbar>
    
    <v-navigation-drawer
      app
      v-model="drawer"
      width="250"
      class="elevation-4 bg"
    >
      <v-toolbar width="300" class="elevation-0 transparent">
        <v-toolbar-title class="title" >
          <v-layout row>
            <v-img class="mr-3" height="20" width="20" src="https://firebasestorage.googleapis.com/v0/b/investfacil-d1f3d.appspot.com/o/logo.png?alt=media&token=ff5da0ed-e347-4095-a9d7-8173f7431087"></v-img>
            <span class="text-xs-center text-uppercase">Invest</span>
            <span class="font-weight-light text-xs-center text-uppercase">Fácil</span>
          </v-layout>
        </v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list
        class="ml-2"
      >
        <!--
        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Dashboard')" to="/admin/dashboard">
          <v-icon size="20" class="mr-3">
            pie_chart
          </v-icon>
          Dashboard
        </v-list-tile>
        -->
        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Investidores')" to="/admin/clientes" v-ripple>
          <v-icon size="20" class="mr-3">
            monetization_on
          </v-icon>
          Clientes
        </v-list-tile>

        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Responda Tickets de seus clientes')" to="/admin/tickets">
          <v-icon size="20" class="mr-3">
            forum
          </v-icon>
          Tickets
        </v-list-tile>


        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Solicitações de pagamento')" to="/admin/solitacoesdepagamento">
          <v-icon size="20" class="mr-3">
            how_to_vote
          </v-icon>
          Solicitações de Saque
        </v-list-tile>
        
        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Solicitações de pagamento')" to="/admin/formasdepagamento">
          <v-icon size="20" class="mr-3">
            how_to_vote
          </v-icon>
          Formas de Pagamento
        </v-list-tile>
        
        <v-list-tile active-class="menuAtivo" @click="mudaTextoToolbar('Análise de comprovantes')" to="/admin/solicitacoesadicaodecotas">
          <v-icon size="20" class="mr-3">
            how_to_vote
          </v-icon>
          Análise de comprovantes
        </v-list-tile>
        
        <v-list-tile active-class="menuAtivo" to="/home">
          <v-icon size="20" class="mr-3">
            person
          </v-icon>
          Voltar Para a Área de Usuários
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
          <v-card v-if="DIV_HOME" light class="pa-2" style="margin-top: -60px; display: flex; width: 100%; height: 100vh; border-radius: 10px;">
            <iframe src="https://br.widgets.investing.com/top-cryptocurrencies?theme=lightTheme&roundedCorners=true" width="100%" height="100%" frameborder="0" allowtransparency="true" marginwidth="0" marginheight="0"></iframe>
          </v-card>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { auth, db } from '../services/Firebase.js'
import Moment from 'moment'
import 'moment/locale/pt-br'

export default {
  data () {
    return {
      drawer: false,
      usuarios: [],
      addPorcentagemDialog: false,
      usersCotistas: [],
      listaDePagamentos: [],
      porcentagem: 0,
      upup: null
    }
  },
  computed: {
    TEXTO_DRAWER () {
      return this.$store.getters.TEXTO_DRAWER
    },
    DIV_HOME () {
      return this.$store.getters.DIV_HOME
    }
  },
  methods: {
    sair () {
      auth.signOut().then(
        this.$router.push('/')
      )
    },

    mudaTextoToolbar (texto) {
      this.$store.dispatch('MUDA_TEXTO_TOOLBAR', texto)
    },
    verificaAdmin () {
      auth.onAuthStateChanged(async user => {
        if(user) {
          const Admin = this.$store.getters.GET_FULL_PERFIL.admin
          if(Admin === true) {
            const query = db.ref('usuarios')
            await query.on('value', snapshot => {
              let allUsers = []
              snapshot.forEach(item => {
                let it = item.val()
                it.uid = item.key
                allUsers.push(it)
              })
              this.usuarios = allUsers
              this.$store.dispatch('SET_USERS', allUsers)
            })
          } else {
            this.$router.push('/home')
          }
        } else {
          this.$router.push('/home')
        }
      })
    },
    addPorcentagem () {
      const usersFull = this.$store.getters.GET_USERS
      var userCotistas = []
      var listaDePagamentos = []

      usersFull.map(u => {
        if(u.cotas !== undefined) {
          userCotistas.push(u)
        }
      })
      
      this.usersCotistas = userCotistas
      this.addPorcentagemDialog = true
    },
    calculaPagamento () {
      const uC = this.usersCotistas
      var porc = parseFloat(this.porcentagem)
      var pagamentos = []

      uC.map(u => {
        let numeroDeCotas = 0

        u.cotas.filter(cota => {
          numeroDeCotas = numeroDeCotas + parseInt(cota.quantidade)
        })

        let umPorcento = (numeroDeCotas * 150) / 100
        let valorFinal = umPorcento * porc
        var dataAtual = Moment().locale('pt-br').format('L')
        var posicaoExtrato = u.extratos === undefined ? 0 : u.extratos.length + 1
        pagamentos.push({
          porcentagem: porc,
          posicao: posicaoExtrato,
          uid: u.uid,
          saldo_atual: u.saldo_disponivel,
          saldo_novo: parseFloat(u.saldo_disponivel) + valorFinal,
          data: dataAtual,
          nome: u.nome,
          valor: valorFinal,
          numero_cotas: numeroDeCotas,
          descricao: `Pagamento de ${numeroDeCotas} cota(s)`
        })
      })
      this.listaDePagamentos = pagamentos
    },
    pagarCotas() {
      const listaPagamentos = this.listaDePagamentos
      var updates = {}
      listaPagamentos.map(pagamento => {

        updates['usuarios/' + pagamento.uid + '/extratos/' + pagamento.posicao ] = pagamento
        updates['usuarios/' + pagamento.uid + '/saldo_disponivel'] = pagamento.saldo_novo
      })
      this.pagar(updates)
    },
    pagar(updates) {
      db.ref().update(updates).then(
        () => alert('pagamento efetuado')
      ).then(
        () => this.$router.push('/home')
      )
    }
  },
  filters: {
    moeda(val) {
      if(!val) return ''
      var valor = parseFloat(val)
      return valor.toFixed(2)
    }
  },
  created () {
    this.$store.dispatch('ATIVA_COTACAO_BTC')
    this.verificaAdmin()
  }
}
</script>

<style>
  .content {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .bg {
    display: flex;
    flex-direction: column;
    background-image: rgb(173, 52, 52)
  }

  .menuAtivo {
    background-color: #F9A825;
    border-radius: 5px;
    margin-right: 10px;
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

