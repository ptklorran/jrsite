<template>
  <div class="HomePublicBG">
    <div class="HomePublic">
      <v-flex xs12>
        <v-toolbar height="70" class="elevation-1 transparent">
          <v-toolbar-side-icon
            class="hidden-sm-and-up"
            @click="drawer = !drawer"
          >
            <v-icon color='white'>menu</v-icon>
            <v-spacer class="hidden-sm-and-up"></v-spacer>
          </v-toolbar-side-icon>
          <v-toolbar-title class=" hidden-sm-and-up">
           </v-toolbar-title>
          <div class="toolbardiv hidden-sm-and-down">
          <v-toolbar-side-icon>
              <img height="35" class="mb-2 mr-0" src="http://jrsistemasweb.com.br/img/jr_logo.png"/>
          </v-toolbar-side-icon>
            <v-spacer></v-spacer>
            <v-btn @click="active = 0" round class="yellow--text" flat>Início</v-btn>
            <v-btn @click="active = 1" round class="yellow--text" flat>Serviços</v-btn>
            <v-btn @click="active = 2" round class="yellow--text" flat>Hospedagem</v-btn>
            <v-btn @click="active = 3" round class="yellow--text" flat>Clientes</v-btn>
            <v-btn @click="active = 4" round class="yellow--text" flat>Contato</v-btn>
            <v-spacer></v-spacer>
            <v-btn outline color="blue" round><span class="white--text">Login</span></v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn outline round class="yellow darken-3 hidden-sm-and-up white--text" to="/login">Login</v-btn>
        </v-toolbar>
        <v-flex xs12>
          <v-tabs-items v-model="active">
            <v-tab-item>
              <HomeTab/>
            </v-tab-item>
            
            <v-tab-item>
              <Servicos/>
            </v-tab-item>
            
            <v-tab-item>
              <Hospedagem/>
            </v-tab-item>
            
            <v-tab-item>
              <Clientes/>
            </v-tab-item>
            
            <v-tab-item>
              <Contato/>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-flex>
      <v-navigation-drawer app v-model="drawer">
        <v-list>
          <v-list-tile to="/login">
            Login
          </v-list-tile>
          <v-list-tile to="/cadastro/null">
            Cadastre-se
          </v-list-tile>
          <v-list-tile @click="(active = 0, drawer = !drawer)">
            Home
          </v-list-tile>
          <v-list-tile @click="(active = 1, drawer = !drawer)">
            Sobre
          </v-list-tile>
          <v-list-tile @click="(active = 2, drawer = !drawer)">
            Serviços
          </v-list-tile>
          <v-list-tile @click="(active = 3, drawer = !drawer)">
            Planos
          </v-list-tile>
          <v-list-tile @click="(active = 4, drawer = !drawer)">
            Contato
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script>
import HomeTab from '../components/HomePublic/home'
import Clientes from '../components/HomePublic/clientes'
import Contato from '../components/HomePublic/contato'
import Hospedagem from '../components/HomePublic/hospedagem'
import Servicos from '../components/HomePublic/servicos'

import { auth, db } from '../services/Firebase.js'
export default {
  components: {
    HomeTab,
    Clientes,
    Contato,
    Hospedagem,
    Servicos
  },
  data() {
    return {
      active: 0,
      drawer: false
    }
  }
}
</script>
 
<style>
  .HomePublic{
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: rgb(221, 217, 217)
  }
  .toolbardiv {
    display: flex;
    width: 100%;
  }
</style>
 