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
    <v-flex xs6 md6 pa-1>
      <v-card
        hover
        v-ripple
        @click="tabs=0"
        height="50"
        class="cardAdmin green"
      >
        <span class="display-2 white--text">  </span>
        <h5
          class="title white--text text-xs-center font-weight-light"
        >
          Enviar Um Ticket
        </h5>
      </v-card>
    </v-flex>
    <v-flex xs6 md6 pa-1>
      <v-card
        hover
        v-ripple
        @click="tabs=1"
        height="50"
        class="cardAdmin blue darken-3"
      >
        <span class="display-2 white--text">  </span>
        <h5
          class="title white--text text-xs-center font-weight-light"
        >
          Meus Tickets
        </h5>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-tabs-items v-model='tabs'>
        <v-tab-item>
          <v-card
            hover
            light
            class="cardSolicitacao grey lighten-4"
          >
            <v-icon size="40" color="yellow darken-3" class="ma-3">
              forum
            </v-icon>
            <v-flex xs12 pl-2 pr-2>
              <v-text-field
                solo
                label="Assunto"
                v-model="assunto"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 pl-2 pr-2>
              <v-textarea
                solo
                label="Mensagem"
                v-model="mensagem"
              >
              </v-textarea>
            </v-flex>
            <v-btn
              round
              color="yellow darken-3"
              class="ma-4"
              @click="beforeEnviaParaAnalise"
            ><span class="white--text">Enviar Ticket Agora</span>
            <v-progress-circular v-if="envioEmAndamento" indeterminate color="black"></v-progress-circular>
            </v-btn>
          </v-card>
        </v-tab-item>
        <v-tab-item>

        </v-tab-item>
      </v-tabs-items>
    </v-flex>
  </div>
</template>

<script>
import {db, auth} from '../../services/Firebase.js'
import Moment from 'moment'
import 'moment/locale/pt-br'

export default {
  data () {
    return {
      tabs: null,
      envioEmAndamento: false,
      assunto: '',
      mensagem: '',
      sucesso: false,
      sucessoMessage: '',
      erro: false,
      erroMessage: '',
      meusTickets: []
    }
  },
  methods: {
    async beforeEnviaParaAnalise () {
      this.envioEmAndamento = true
      const userUid = await auth.currentUser.uid
      const dataDeHoje = Moment().locale('pt-br').format('L')
      const nomeDoUsuario = this.$store.getters.GET_FULL_PERFIL.nome
      const cpfDoUsuario = this.$store.getters.GET_FULL_PERFIL.cpf
      const assunto = this.assunto
      const mensagem = this.mensagem
      const dados = {
        descricao: 'ticket',
        uid: userUid,
        data: dataDeHoje,
        nomeDoUsuario: nomeDoUsuario,
        cpfDoUsuario: cpfDoUsuario,
        assunto: assunto,
        mensagem: mensagem,
        status: 'pendente'
      }
      this.enviaParaAnalise(dados)
    },
    enviaParaAnalise (dados) {
      db.ref('tickets').push(dados)
        .then(() => {
          this.sucesso = true
          this.sucessoMessage = 'Ticket Enviado'
        })
        .catch((error) => {
          this.erro = true
          this.erroMessage = "Erro inesperado" + error.message
        })
        .then(() => {
          this.envioEmAndamento = false
          this.envioEmAndamento = false
        })
    },
    pegaMeusTickets () {
      const userUid = auth.currentUser.uid
      const query = db.ref('tickets')
      query.on('value', snapshot => {
        var items = []
        snapshot.forEach(item => {
          let itemBaixo = item.val()
          itemBaixo.key = item.key
          if(itemBaixo.uid === userUid) {
            items.push(item)
          }
        })
        this.meusTickets = items
      })
    }
  },
  created () {
    this.pegaMeusTickets()
  }
}
</script>

<style>
  .cardSolicitacao {
    width: 100%;
    display: flex;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px; 
    flex-direction: column;
    justify-content: center;
  }
</style>

