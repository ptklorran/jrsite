<template>
  <div class="home">
    <v-snackbar
        v-model="sucesso"
        color="green"
      >
        {{ sucessoMessage }}
        <v-btn
        color="pink"
        flat
        @click="sucesso = false"
      >
        Fechar
      </v-btn>
      </v-snackbar>
      <v-snackbar
        v-model="erro"
        color="red"
      >
        {{ erroMessage }}
        <v-btn
        color="black"
        flat
        @click="erro = false"
      >
        Fechar
      </v-btn>
      </v-snackbar>
    <v-flex xs12>
      <v-card
        hover
        light
        height="230"
        class="cardSolicitacao grey lighten-4"
      >
        <v-icon size="40" color="green" class="ma-3">
          monetization_on
        </v-icon>
        <span class="title mb-2 text-xs-center">Disponível: {{ SALDO_DISPONIVEL | moeda }}</span>
        <v-flex xs12 pr-2 pl-2>
          <v-text-field
            solo
            label="Valor que deseja Solicitar"
            v-model="valorDoSaque"
          >
          </v-text-field>
        </v-flex>
        <v-btn
          round
          color="green"
          class="mb-2"
          @click="onMountSolicitation"
        ><span class="white--text">Solicitar Agora</span>
          <v-progress-circular indeterminate v-if="envioEmAndamento" color="black"></v-progress-circular>
        </v-btn>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card style="border-radius: 10px;" light class="mt-4 pa-2">
        <v-list>
          <v-list-tile v-for="item in meusSaques" :key="item.key">
            <v-list-tile-avatar>
              <v-avatar>
                <v-icon :color="item.status === 'pendente' ? 'yellow darken-3' : 'green'">monetization_on</v-icon>
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                R${{ item.valorDoSaque }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                Status: {{ item.status }} - {{ item.data }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import { db, auth } from '../../services/Firebase.js'
import Moment from 'moment'
import 'moment/locale/pt-br'

export default {
  data () {
    return {
      valorDoSaque: 0,
      saldoIndisponivel: false,
      saldoDisponivel: 0,
      tabs: null,
      sucesso: false,
      sucessoMessage: '',
      erro: false,
      erroMessage: '',
      envioEmAndamento: false,
      meusSaques: [],
      allSaques: [],
      uidCliente: ''
    }
  },
  filters: {
    moeda (val) {
      if(!val) return ''
      var valor = val
      return valor.toFixed(2)
    }
  },
  watch: {
    async allSaques () {
      const uidCli = await auth.currentUser.uid
      console.log('uidCli' + uidCli)
      const allSaques = this.allSaques
      this.uidCliente = uidCli 
      var mSaques = []
      allSaques.map(saque => {
        if(saque.uid === uidCli) {
          mSaques.push(saque)
        }
      })
      this.meusSaques = mSaques
      return mSaques
    },
    valorDoSaque (val) {
      if(val <= 0) {
        this.valorDoSaque = 0
      }

      if(val > this.saldoDisponivel) {
        this.saldoIndisponivel = true
      } else {
        this.saldoIndisponivel = false
      }
      return val
    }
  },
  computed: {
    SALDO_DISPONIVEL () {
      this.saldoDisponivel = this.$store.getters.SALDO
      return this.$store.getters.SALDO
    },
    SAQUES_LENGTH () {
      return this.$store.getters.SAQUES_LENGTH
    }
  },
  methods: {
    onMountSolicitation () {
      if ( parseFloat(this.valorDoSaque) > this.saldoDisponivel ) {
        this.erro = true
        this.erroMessage = 'Saldo Insuficiente'
      } else {
        this.beforeEnviaParaAnalise()
      }
    },
    async beforeEnviaParaAnalise () {
      this.envioEmAndamento = true
      const userUid = await auth.currentUser.uid
      const dataDeHoje = Moment().locale('pt-br').format('L')
      const nomeDoUsuario = this.$store.getters.GET_FULL_PERFIL.nome
      const cpfDoUsuario = this.$store.getters.GET_FULL_PERFIL.cpf
      const banco = this.$store.getters.GET_FULL_PERFIL.banco
      const conta = this.$store.getters.GET_FULL_PERFIL.conta
      const agencia = this.$store.getters.GET_FULL_PERFIL.agencia
      const tipo_conta = this.$store.getters.GET_FULL_PERFIL.tipo_conta
      const titular= this.$store.getters.GET_FULL_PERFIL.titular
      const valorSaque = this.valorDoSaque
      const dados = {
        descricao: 'Saque',
        uid: userUid,
        data: dataDeHoje,
        nomeDoUsuario: nomeDoUsuario,
        cpfDoUsuario: cpfDoUsuario,
        valorDoSaque: valorSaque,
        banco: banco === undefined || null ? '' : banco,
        conta: conta === undefined || null ? '' : conta,
        agencia: agencia === undefined || null ? '' : agencia,
        tipo_conta: tipo_conta === undefined || null ? '' : tipo_conta,
        titular: titular === undefined || null ? '' : titular,
        status: 'pendente'
      }
      this.enviaParaAnalise(dados)
    },
    enviaParaAnalise (dados) {
      db.ref('saques').push(dados)
        .then(() => {
          this.sucesso = true
          this.sucessoMessage = 'Solicitação Enviada'
        })
        .catch((error) => {
          this.erro = true
          this.erroMessage = "Erro inesperado" + error.message
        })
        .then(() => {
          this.envioEmAndamento = false
        })
    },
    pegaMeusSaques () {
      const querySaque = db.ref('saques')
      querySaque.on('value', snapshot => {
        var items = []
        var itemsFinais = []
        snapshot.forEach(item => {
          let itemBaixo = item.val()
          itemBaixo['chave'] = item.key
          items.push(itemBaixo)
        })
        const itemFinal = items
        this.allSaques = itemFinal
      })
    }
  },
  created () {
    this.pegaMeusSaques()
  }
}
</script>

<style>
  .cardSolicitacao {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

