<template>
  <div class="cliente">
    <v-snackbar
      v-model="sucess"
      color="green darken-3"
    >
      {{ sucessMessage }}

      <v-btn flat color="yellow darken-3" @click="sucess = false">Fechar</v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="erro"
      color="red darken-3"
    >
      {{ erroMessage }}

      <v-btn flat color="yellow darken-3" @click="erro = false">Fechar</v-btn>
    </v-snackbar>
    <v-text-field
      append-icon="search"
      placeholder="Pesquise um cliente"
      :persistent-hint="true"
      :hint="users.length + ' encontrados'"
      solo
      class="ma-2 mb-0 white--text"
      v-model="pesquisa"
      color="yellow darken-3"
    ></v-text-field>
    <h4 class="ml-3">Clientes</h4>
    <v-list light  style="border-radius: 5px;" class="mt-0 ma-2" two-line>
      <v-list-tile
        v-for="user in users"
        :key="user.key"
        @click.prevent="abreUser(user)"
      >
        <v-list-tile-avatar>
          <v-avatar class="elevation-1">
            <v-icon color="yellow darken-3">person</v-icon>
          </v-avatar>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>
            <span class="subtitle">{{ user.nome }}</span>
          </v-list-tile-title>
          <v-list-tile-sub-title>
            <span>Saldo: {{user.saldo_disponivel}}</span>
          </v-list-tile-sub-title>
          <v-list-tile-sub-title class="pa-0 ma-0">
            <v-divider></v-divider>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-dialog
      fullscreen
      v-model="dialogUser"
    >
      <v-card dark style="border-radius: 10px;">
        <v-flex xs12>
          <v-toolbar color="grey darken-4">
            <v-avatar color="white">
              <v-icon color="yellow darken-3">person</v-icon>
            </v-avatar>
            <v-toolbar-title>
              <span class="white--text">{{ userSelected.nome }}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
              <v-btn icon @click="dialogUser = false, userSelected = {}">
                <v-icon color="white">close</v-icon>
              </v-btn>
          </v-toolbar>
        </v-flex>
        <div class="contentUser">
        <v-flex xs12 md4>
          <v-card
            light
            class="pa-3 ma-3 cardInfoPessoais"
          >
            <v-flex xs12>
              <h3 class="black--text text-xs-center">Dados da Conta</h3>
              <v-divider class="mb-3 mt-3" dark></v-divider>
              <v-text-field box hint="rendimentos do cliente" label="Saldo Disponível" color="yellow darken-3" v-model="userSelected.saldo_disponivel" />
              <v-text-field box label="Agencia" color="yellow darken-3" v-model="userSelected.agencia" />
              <v-text-field box label="Banco" color="yellow darken-3" v-model="userSelected.banco" />
              <v-text-field box hint="ex: corrente, poupança, etc..." label="Tipo" color="yellow darken-3" v-model="userSelected.tipo" />
              <v-text-field box label="Titular" color="yellow darken-3" v-model="userSelected.titular" />
              <v-text-field box label="Cotas Ativas" disabled color="yellow darken-3" v-model="userSelected.cotasLength" />
            </v-flex>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card
            light
            style="border-radius: 10px;"
            class="pa-3 ma-3 cardInfoPessoais"
          >
            <v-flex xs12>
              <h3 class="black--text text-xs-center">Dados Pessoais</h3>
              <v-divider class="mb-3 mt-3" dark></v-divider>
              <v-text-field box hint="" label="Data do cadastro" color="yellow darken-3" disabled v-model="userSelected.data_cadastro" />
              <v-text-field box hint="nome do cliente" label="Nome" color="yellow darken-3" v-model="userSelected.nome" />
              <v-text-field box hint="email do cliente" label="Email" color="yellow darken-3" v-model="userSelected.email" />
              <v-text-field box hint="celular do cliente" label="Celular" color="yellow darken-3" v-model="userSelected.celular" />
              <v-text-field box hint="cpf do cliente" label="CPF" color="yellow darken-3" v-model="userSelected.cpf" />

            </v-flex>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card
            light
            style="border-radius: 10px;"
            class="pa-3 ma-3 cardInfoPessoais"
          >
            <v-flex xs12>
              <h3 class="black--text text-xs-center">Ações</h3>
              <v-divider class="mb-3 mt-3" light></v-divider>
              <v-btn @click="salvarAlteracoes" color="yellow darken-3" round class="white--text mb-2" block>
                Salvar Alterações Feitas
                <v-progress-circular
                  indeterminate
                  v-show="carregando"
                  color="white"
                >
                </v-progress-circular>
              </v-btn>

            </v-flex>
          </v-card>
        </v-flex>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {db} from '../../services/Firebase.js'
export default {
  data () {
    return {
      pesquisa: '',
      carregando: false,
      sucess: false,
      sucessMessage: '',
      erro: false,
      erroMessage: '',
      usuarios: [],
      dialogUser: false,
      userSelected: {},
      users: [],
      usersBkp: []
    }
  },
  watch: {
    pesquisa() {
    const filtro = this.pesquisa

    if(this.pesquisa === '') {
      this.users = this.usersBkp
    } else {
      const filtroTotal = this.usersBkp
      var filtrados = []

      var filtroUpperCase = filtro.toUpperCase()
      filtroTotal.map(item => {
        var dadoUpperCase = item.nome.toUpperCase()
        if (dadoUpperCase.match(filtroUpperCase)) {
          filtrados.push(item)
          this.users = filtrados
        }
      })
    }
    }
  },
  filters: {
    moeda (val) {
      if(!val) return ''
      var valor = val
      return valor.toFixed(2)
    }
  },
  methods: {
    getUsers () {
      const users = this.$store.getters.GET_USERS
      this.users = users
      this.usersBkp = users
      return users
    },
    abreUser (user) {
      var u = {}
      u = user
      var cotasLength = 0
      if(u.cotas === undefined) {
        cotasLength = 0
      } else {
        let cots = []
        cots = u.cotas
        cots.map(cota => cotasLength += parseInt(cota.quantidade))
      }
      u.cotasLength = cotasLength
      this.dialogUser = true
      this.userSelected = u
    },
    salvarAlteracoes() {
      this.carregando = true
      const usuarioSeraAtualizado = this.userSelected
      db.ref('usuarios/' + usuarioSeraAtualizado.uid).update(usuarioSeraAtualizado)
        .then(
          () => {
            this.carregando = false
            this.sucess = true
            this.sucessMessage = 'Alterações salvas com Sucesso'
          }
        )
        .catch((error) => {
          this.carregando = false
          this.erro = true
          this.erroMessage = 'Aconteceu um erro' + error.message
        })
    }
  },
  created() {
    this.getUsers()
  }
}
</script>

<style>
  .cliente {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .progressCircular {
    display: flex;
    width: 100%;
    height: 50vh;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .contentUser {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    flex-direction: row;
  }
</style>

