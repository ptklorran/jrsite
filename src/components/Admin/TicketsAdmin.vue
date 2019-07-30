<template >
  <div style="display: flex; width: 100%; flex-direction: row; align-items: flex-start; flex-wrap: wrap">
    <v-flex xs6>
      <v-card style="border-radius: 10px;" color="blue lighten-1" @click="tabs=0" class="ma-2 pa-2" light>
        <h2 class="white--text font-weight-light">Pendentes</h2>
      </v-card>
    </v-flex>
    <v-flex xs6>
      <v-card style="border-radius: 10px;" color="green" @click="tabs=1" class="ma-2 pa-2" light>
        <h2 class="white--text font-weight-light">Atendidos</h2>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-tabs-items
        v-model="tabs"
      >
        <v-tab-item>
          <span class="title ma-2 pl-1" >Pendentes</span>
          <v-flex xs12 md4 v-for="ticket in tickets" v-show="ticket.status === 'pendente' ? true : false" :key="ticket.key">
            <v-card
              light
              class="ma-2"
              style="border-radius: 10px;"
            >
              <div style="flex-direction: column; display: flex, align-items: center; justify-content: center; width:100%; flex-wrap: wrap">
                <v-avatar class="text-xs-center">
                  <v-icon>
                    description
                  </v-icon>
                </v-avatar>
                <h4 class="text-xs-center ma-2 mt-0 mb-4">Cliente: <span style="background-color: #90CAF9; border: 1px solid #344333; border-radius: 5px; padding: 5px;">{{ ticket.nomeDoUsuario }}</span></h4>
                <h4 class="text-xs-center ma-2 mt-0 mb-4">Data: <span style="background-color: #90CAF9; border: 1px solid #344333; border-radius: 5px; padding: 5px;">{{ ticket.data }}</span></h4>
              </div>

              <v-card-actions>
                <v-btn @click="analiseDialog=true" block round color="yellow darken-3">ver</v-btn>
              </v-card-actions>
              
            </v-card>
          </v-flex>
        </v-tab-item>

        <v-tab-item>
          <v-flex xs12>
            
          </v-flex>
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
    <v-dialog
      fullscreen
      v-model="analiseDialog"
    >
      <div style="display: flex; width: 100%; height: 100vh">
        <v-flex xs12>
          {{  }}
        </v-flex>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { db, auth } from '../../services/Firebase.js'
import Moment from 'moment'
import 'moment/locale/pt-br'

export default {
  data() {
    return {
      analiseDialog: false,
      analiseContent: {},
      tickets: [],
      tabs: null
    }
  },
  methods: {
    abreAnalise () {

    },
    pegaTickets () {
      var query = db.ref('tickets')
      query.on('value', async snapshot => {
        var tickets = []
        snapshot.forEach(item => {
          let ticket = item.val() 
          ticket.key = item.key 
          tickets.push(ticket)
        });
        this.tickets = tickets
      })
    },
  },
  created() {
    this.pegaTickets()
  }
}
</script>

