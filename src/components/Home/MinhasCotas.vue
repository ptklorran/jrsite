<template>
  <div class="home">
    <v-flex xs12 pa-1>
      <v-card
        hover
        v-ripple
        class="cardAdmin blue darken-3"
        @click="tabs = 0"
      >
        <span class="display-2 white--text"> {{ MINHAS_COTAS }} </span>
        <h5
          class="title white--text text-xs-center font-weight-thin"
        >
          Cotas
        </h5>
      </v-card>
    </v-flex>

    <v-flex xs12 pa-1>

      <v-tabs-items
        v-model="tabs"
      >
        <v-tab-item>
          <h3 class="mt-3 mb-2">Cotas</h3>
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
                      Quantidade: {{ cota.quantidade }}
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
          <h3 class="mt-3 mb-2">Saques</h3>
          <v-card style="border-radius: 10px;" light>
              <v-list>
                <v-list-tile
                  v-for="saque in SAQUES"
                  :key="saque.id"
                >
                  <v-list-tile-title>
                    {{ saque }}
                  </v-list-tile-title>
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
export default {
  data () {
    return {
      tabs: 0
    }
  },
  computed: {
    MINHAS_COTAS () {
      return this.$store.getters.COTAS_LENGTH
    },
    COTAS () {
      return this.$store.getters.COTAS
    },
    MEUS_SAQUES_LENGTH () {
      var saquesLength = this.$store.getters.GET_FULL_PERFIL.saques
      if(saquesLength === undefined) {
        return "Não Há"
      } else {
        return saquesLength.length
      }
    },
    SAQUES () {
      return this.$store.getters.SAQUES
    }
  },
  filters: {
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
  }
}
</script>

<style>
  .home {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    padding: 8px;
  }

  .cardAdmin {
    min-width: 100%;
    height: 150px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

</style>

