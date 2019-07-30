<template >
    
  <div style="display: flex; width: 100%; flex-direction: row; align-items: flex-start; flex-wrap: wrap">
    <v-snackbar
      v-model="sucesso"
      color="green"
    >
      {{sucessoMessage}}
      <v-btn @click="sucesso=false">
        Fechar
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="erro"
      color="red"
    >
      {{erroMessage}}
      <v-btn @click="erro=false">
        Fechar
      </v-btn>
    </v-snackbar>
    <v-flex xs6>
      <v-card style="border-radius: 10px; cursor: pointer;" hover ripple :class="tabs === 0 ? 'elevation-5' : 'elevation-0'" :color="tabs === 0 ? '#F9A825' : '#444'" @click="tabs=0" class="ma-2 pa-2" light>
        <h2 class="white--text text-xs-center font-weight-bold">Solicitações Pendentes</h2>
      </v-card>
    </v-flex>
    <v-flex xs6>
      <v-card style="border-radius: 10px; cursor: pointer;" :style="tabs === 1 ? '' : ''" hover ripple :class="tabs === 1 ? 'elevation-5' : 'elevation-0'" :color="tabs === 1 ? '#F9A825' : '#444'" @click="tabs=1" class="ma-2 pa-2" light>
        <h2 class="white--text text-xs-center font-weight-bold">Solicitações Atendidas</h2>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-tabs-items
        v-model="tabs"
      >
        <v-tab-item>
          <span class="pl-3" >Pendentes</span>
          <div style="display: flex; width: 100%; flex-wrap: wrap">
            <v-flex xs12 md4 v-for="comprovante in comprovantes" v-show="comprovante.status === 'pendente' ? true : false" :key="comprovante.key">
              <v-card
                light
                class="ma-2"
                height="180"
                style="border-radius: 10px;"
              >
                <div style="flex-direction: column; display: flex, align-items: center; justify-content: flex-start; width:100%; flex-wrap: wrap">
                  <div style="display: flex; width: 100%; justify-content: center">
                    <v-avatar class="text-xs-center">
                      <v-icon>
                        account_circle
                      </v-icon>
                      <v-icon size="5" class="ml-2 mr-2" color="black">fiber_manual_record</v-icon>
                      <span class="font-weight-bold black--text pl-2 pr-2" style="border-radius: 8px; border: 1px solid #f00; padding: 2px;">{{comprovante.status}}</span>
                    </v-avatar>
                  </div>
                  <v-divider></v-divider>
                  <h4 class="pl-2 ma-2 mt-0 mb-4">Cliente: <span class="font-weight-light">{{ comprovante.nomeDoUsuario }}</span></h4>
                  <h4 class="pl-2 ma-2">Banco: <span class="font-weight-light">{{ comprovante.nomeDoBanco }}</span></h4>
                </div>

                <v-card-actions>
                  <v-btn @click="abreAnalise(comprovante)" block round color="yellow darken-3">Analisar</v-btn>
                </v-card-actions>
                
              </v-card>
            </v-flex>
          </div>
        </v-tab-item>

        <v-tab-item>
          <span class="pl-3" >Atendidas</span>
          <div style="display: flex; width: 100%; flex-wrap: wrap">
            <v-flex xs12 md4 v-for="comprovante in comprovantes" v-show="comprovante.status === 'pendente' ? false : true" :key="comprovante.key">
              <v-card
                light
                class="ma-2"
                height="180"
                style="border-radius: 10px;"
              >
                <div style="flex-direction: column; display: flex, align-items: center; justify-content: flex-start; width:100%; flex-wrap: wrap">
                  <div style="display: flex; width: 100%; justify-content: center">
                    <v-avatar class="text-xs-center">
                      <span class="font-weight-bold black--text pl-2 pr-2" :style="comprovante.status === 'pago' ? '#C6FF00' : '#FF1744'" style="border-radius: 8px; border: 1px solid #999; padding: 2px;">{{comprovante.status}}</span>
                      <v-icon size="5" class="ml-2 mr-2" color="black">fiber_manual_record</v-icon>
                      <span class="font-weight-bold black--text pl-2 pr-2" style="border-radius: 8px; border: 1px solid #F9A825; padding: 2px;">{{comprovante.data}}</span>
                    </v-avatar>
                  </div>
                  <v-divider></v-divider>
                  <h4 class="pl-2 ma-2 mt-0 mb-4">Cliente: <span class="font-weight-light">{{ comprovante.nomeDoUsuario }}</span></h4>
                  <h4 class="pl-2 ma-2">Banco: <span class="font-weight-light">{{ comprovante.nomeDoBanco }}</span></h4>
                </div>

                <v-card-actions>
                  <v-btn @click="abreAnalise(comprovante)" :disabled="comprovante.status === 'pago' ? true : false" block round class="white--text" color="red darken-3">Re-Analisar</v-btn>
                </v-card-actions>
                
              </v-card>
            </v-flex>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
    <v-dialog
      v-model="analiseDialog"
      fullscreen
    >
      <v-card>
        <v-flex>
          <v-toolbar >
            <v-toolbar-side-icon>
              <v-icon color="green" size="35">
                monetization_on
              </v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>
              Análise de comprovante
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="fechaAnalise" icon>
              <v-icon color="red">
                close
              </v-icon>
            </v-btn>
          </v-toolbar>
          <h3 class="ml-4 mt-4">Dados do cliente</h3>
          <v-card
            light
            class="ma-4 pa-4 mt-1"
            style="border-radius: 10px;"
          >
            <h4 class="mt-1 mb-1">Banco: {{ analiseContent.nomeDoBanco }}</h4>
            <h4 class="mt-1 mb-1">Cliente: {{ analiseContent.nomeDoUsuario }}</h4>
            <h4 class="mt-1 mb-1">CPF: {{ analiseContent.cpfDoUsuario }}</h4>
          </v-card>
        </v-flex>
        <v-flex>
            <h3 class="ml-4">Comprovante</h3>
          <v-card
            light
            class="pa-1 ma-4"
            style="border-radius: 10px;"
          >
            <img width="100%" style="border-radius: 10px;" :src="analiseContent.imagemComprovante" alt="comprovante">
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card class="ml-4 mr-4 mb-4 pb-4" color="transparent">
            <v-btn @click="abreAddCota" block color="yellow darken-3" round> Aprovar e Adicionar Cotas </v-btn>
            <v-btn @click="recusaCota" block color="yellow darken-3" round> Recusar Comprovante 
              <v-progress-circular indeterminate color="black" v-if="recusaCotaEmAndamento"></v-progress-circular>
            </v-btn>
          </v-card>
        </v-flex>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addCotaDialog" 
      width="350"
    >
        <v-card
          class="pa-3 ma-3"
          light
          style="display: flex; border-radius: 10px; justify-content: center;flex-direction: column"
        >
          <h4 class="text-xs-center">Quantidade de cotas para adicionar</h4>
            <v-flex xs12>
              <v-text-field type="number" box color="yellow darken-3" v-model="quantidadeDeCotasParaAdicionar"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <h4>Beneficiado: {{ analiseContent.nomeDoUsuario }}</h4>
            </v-flex>
            <v-flex xs12>
              <v-btn block color="yellow darken-3" round @click="beforeAddCota">Confirmar
                <v-progress-circular indeterminate color="black" v-if="addCotaEmAndamento"></v-progress-circular>
              </v-btn>
              
              <v-btn block color="yellow darken-3" round @click="recusaCota">Recusar Comprovante
                <v-progress-circular indeterminate color="black" v-if="recusaCotaEmAndamento"></v-progress-circular>
              </v-btn>
              
            </v-flex>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db, auth } from '../../services/Firebase.js'
import Moment from 'moment'
import 'moment/locale/pt-br'
import { error } from 'util';

export default {
  data() {
    return {
      analiseDialog: false,
      analiseContent: {},
      addCotaDialog: false,
      comprovantes: [],
      quantidadeDeCotasParaAdicionar: 0,
      tabs: 0,
      addCotaEmAndamento: false,
      recusaCotaEmAndamento: false,
      sucesso: false,
      sucessoMessage: '',
      erro: false,
      erroMessage: ''
    }
  },
  methods: {
    abreAnalise (comprovante) {
      this.analiseDialog = true
      this.analiseContent = comprovante
    },
    fechaAnalise () {
      this.analiseDialog = false
      this.analiseContent = {}
      this.addCotaDialog = false
    },
    abreAddCota() {
      this.addCotaDialog = true
    },
    beforeAddCota() {
      this.addCotaEmAndamento = true
      const favorecidoUid = this.analiseContent.uid
      const quantidadeDeCotas = this.quantidadeDeCotasParaAdicionar
      var allUsers = this.$store.getters.GET_USERS
      var cotas = null
      var posicaoCota = null
      var posicaoExtrato = null
      var perfilUser = null
      const diaDeHoje = Moment().locale('pt-bt').format('L')
      const ultimoRecebimento = Moment().add(549, 'days').calendar()
      allUsers.map(user => {
        if (favorecidoUid === user.uid) {
          var cotasSnap
          var extratosSnap
          const query = db.ref('usuarios/' + user.uid + '/cotas')
          query.on('value', snapshot => {
            cotasSnap = snapshot.val()
          },
          (error) => {
            this.erro = true
            this.erroMessage = 'erro, tente novamente!'
            this.fechaAnalise()
          }          
          )
          const query1 = db.ref('usuarios/' + user.uid + '/extratos')
          query1.on('value', snapshot => {
            extratosSnap = snapshot.val()
          },
          (error) => {
            this.erro = true
            this.erroMessage = 'erro, tente novamente!'
            this.fechaAnalise()
          }          
          )
          if(cotasSnap === undefined) {
            posicaoCota = 0
          } else {
            posicaoCota = cotasSnap.length
          }
          if(extratosSnap === undefined) {
            posicaoExtrato = 0
          } else {
            posicaoExtrato = extratosSnap.length
          }
        }
      })

      var updates = {
        descricao: 'Adição de ' + quantidadeDeCotas + ' cota(s)',
        posicaoCota: posicaoCota,
        posicao: posicaoExtrato,
        id_user: favorecidoUid,
        quantidade: quantidadeDeCotas,
        data: diaDeHoje,
        valor: 0,
        primeiro_recebimento: diaDeHoje,
        ultimo_recebimento: ultimoRecebimento,
        status: '1'
      }
      this.addCota(updates)
    },
    addCota(updates) {
      const keyComprovante = this.analiseContent.key
      db.ref('usuarios/' + updates.id_user + '/cotas/' + updates.posicaoCota).set(updates)
        .then(() => {
          this.sucesso = true
          this.sucessoMessage = 'Cota Adicionada'
          this.addCotaEmAndamento = false
          db.ref('comprovantesParaAnalise/'+ keyComprovante).update({
            status: 'pago'
          }).then(() => this.fechaAnalise())
          .then(() => {
            db.ref('usuarios/' + updates.id_user + '/extratos/' + updates.posicao).set(updates)
          })
        })
        .catch((error) => {
          this.erro = true
          this.erroMessage = 'erro' + error.message
          this.addCotaEmAndamento = false
        })
    },
    recusaCota () {
      this.recusaCotaEmAndamento = true
      const keyDoComprovante = this.analiseContent.key
      db.ref('comprovantesParaAnalise/' + keyDoComprovante).update({
        status: 'recusado'
      }).then(() => {
        this.sucesso = true
        this.sucessoMessage = "Cota Recusada"
        this.fechaAnalise()
      })
      .catch((error) => {
        this.erro = true
        this.erroMessage = "erro: " + error.message
        this.fechaAnalise()
      })
    },
    pegaComprovantes () {
      var query = db.ref('comprovantesParaAnalise')
      query.on('value', async snapshot => {
        var comprovants = []
        snapshot.forEach(item => {
          let comprovante = item.val()
          comprovante.key = item.key 
          comprovants.push(comprovante)
        });
        this.comprovantes = comprovants.reverse()
      })
    },
  },
  created() {
    this.pegaComprovantes()
  }
}
</script>

