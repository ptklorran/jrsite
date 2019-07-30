<template>
  <div class="home">
    <v-flex xs4 md4 pa-1>
      <v-card
        hover
        light
        v-ripple
        @click="tabs = 0"
        class="cardAdmin"
        style="flex-direction: row"
      >
        <v-layout column class="pa-3">
          <v-flex xs6>
            <span
              class="black--text font-weight-bold"
            >
              Minhas Cotas
            </span>
          </v-flex>
          <v-flex xs6>
            <span class="display-1 black--text"> {{ COTAS_LENGTH }} </span>
          </v-flex>
        </v-layout>
        <v-layout column>
        </v-layout>
      </v-card>
    </v-flex>
    
    <v-flex xs4 md4 pa-1>
      <v-card
        hover
        light
        v-ripple
        @click="tabs = 1"
        class="cardAdmin"
        style="flex-direction: row"
      >
        <v-layout column wrap class="pa-3">
          <v-flex xs6>
            <span
              class="black--text font-weight-bold"
            >
              Rendimento <span class="hidden-sm-and-down">do dia</span>
            </span>
          </v-flex>
          <v-flex xs12>
            <span>R$</span>
            <span class="display-1 black--text">  {{ rendimentoDoDia.valor | moeda }} </span>
          </v-flex>
        </v-layout>
        <v-layout class="hidden-sm-and-down" column>
          <v-flex xs6></v-flex>
          <v-flex xs3 class="mt-3 ml-4">
            <v-btn class="" round small outline color="green">
              + {{ rendimentoDoDia.porcentagem }} %
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    
    <v-flex xs4 md4 pa-1>
      <v-card
        hover
        light
        v-ripple
        @click="tabs = 2"
        class="cardAdmin"
        style="flex-direction: row"
      >
        <v-layout column wrap class="pa-3">
          <v-flex xs6>
            <span
              class="black--text font-weight-bold"
            >
              Extratos
            </span>
          </v-flex>
          <v-flex xs6>
            <span class="display-1 black--text"> {{ EXTRATOS_LENGTH }} </span>
          </v-flex>
        </v-layout >
        <v-layout class="hidden-sm-and-down" column wrap>
          ...
        </v-layout>
      </v-card>
    </v-flex>

    <v-flex xs12 pa-1>

      <v-tabs-items
        v-model="tabs"
      >
        <v-tab-item>
          <h3 class="ml-2 mt-3 mb-2">Cotas</h3>
          <v-card style="border-radius: 10px;" light>
              <v-list two-line>
                <v-list-tile
                  v-for="cota in COTAS"
                  :key="cota.id"
                >
                  <v-list-tile-avatar>
                    <v-icon
                      color="green"
                      size="30"
                    >
                      monetization_on
                    </v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ cota.quantidade }} Cota(s)
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      vence em: {{ cota.ultimo_recebimento | momento }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <h3 class="ml-2 mt-3 mb-2">Meus Rendimentos</h3>
          <v-card style="border-radius: 10px;" light>
            <v-card
              class="mx-auto text-xs-center"
              color="white"
              dark
            >
              <v-card-text>
                <v-sheet color="white">
                  <v-sparkline
                    :value="EXTRATOS_PORC"
                    color="rgba(0, 0, 0, .7)"
                    height="50"
                    line-width="1"
                    padding="16"
                  >
                    <template v-slot:label="item">
                      R$ {{ item.value }}
                    </template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>
            </v-card>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <h3 class="ml-2 mt-3 mb-2">Extratos</h3>
          <v-card style="border-radius: 10px;" light>
            <v-list two-line>
              <v-list-tile
                ripple
                v-for="(extrato, index) in EXTRATOS"
                :key="index"
              >
                <v-list-tile-action>
                  <v-icon>
                    description
                  </v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ extrato.descricao }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <span>{{ extrato.data }}</span> - 
                    <span style="background-color: #00B0FF; border-radius: 8px; border: 1px solid #76FF03" class="pl-1 pr-1 white--text">R$ {{ extrato.valor | moeda }}</span> - 
                    <span style="background-color: #7CB342; border-radius: 8px; border: 1px solid #76FF03" v-if="extrato.porcentagem === undefined ? false : true" class="pl-1 pr-1 white--text">{{ extrato.porcentagem }}%</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>

      </v-tabs-items>
    </v-flex>
  </div>
</template>

<script>
import Moment from 'moment'
import 'moment/locale/pt-br'
import { auth, db } from '../../services/Firebase.js'

export default {
  data () {
    return {
      tabs: 0,
      usuario: {},
      rendimentoDoDia: {
        valor: 0,
        porcentagem: 0
      }
    }
  },
  computed: {
    EXTRATOS_LENGTH () {
      return this.$store.getters.EXTRATOS_LENGTH
    },
    EXTRATOS () {
      return this.$store.getters.EXTRATOS.reverse()
    },
    EXTRATOS_PORC () {
      let ganhos = this.$store.getters.EXTRATOS
      let ganhosFinal = []
      ganhos.map(item => {
        if(item.saldo_novo !== undefined) {
          const fixado = parseInt(item.saldo_novo)
          ganhosFinal.push(fixado)
        }
      })
      return ganhosFinal
    },
    COTAS () {
      return this.$store.getters.GET_FULL_PERFIL.cotas
    },
    COTAS_LENGTH () {
      return this.$store.getters.COTAS_LENGTH
    },
  },
  filters: {
    moeda (val) {
      if(!val) return ''
      var valor = val
      return valor.toFixed(2)
    },
    momento: function (value) {
      if (!value) return ''
      var valor = value
      var DMY = Moment(valor, 'DD-MM-YYYY').isValid()
      var X = Moment(valor, 'X').isValid()

      if(DMY) {
        return value
      }

      if(X) {
        var dayParse = Moment(value, 'X').format('L')
        return dayParse
      }
    }
  },
  methods: {
    logadoOuN () {
      auth.onAuthStateChanged(user => {
        if(user) {
          var usuarioA = auth.currentUser.uid 
          this.pegaUsuario(usuarioA)
        } else {
          return this.$router.push('/login')
        }
      })
    },
    //passo 1
    pegaUsuario(usuarioA) {
      var query = db.ref('usuarios/' + usuarioA)
      query.on('value', async snapshot => {
        var atualUsuario = await snapshot.val()
        this.usuario = atualUsuario
        this.$store.dispatch('SET_PERFIL', atualUsuario)
        this.pegaRendimentos(atualUsuario)
      })
    },
    //passo 2
    pegaRendimentos (us) {
      const extratos = us.extratos
      var rendimentos = []

      extratos.map(e => rendimentos.push(e))

      var diaDeHoje = Moment().locale('pt-br').format('L')
      rendimentos.map(rendimentoDia => {
        if( rendimentoDia.data === diaDeHoje ) {
          this.rendimentoDoDia = rendimentoDia
        } 
      })
    }
  },
  created () {
    this.logadoOuN()
  }
}
</script>

<style>
  .home {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-direction: row;
  }

  .cardAdmin {
    min-width: 100%;
    max-height: 100px;
    display: flex;
    flex-wrap: wrap;
    border-radius: 10px;
  }

</style>

