import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    textoDrawer: 'Principais Crypto Cotações',
    divHome: true,
    usuarios: [],
    perfil: {},
    s: null
  },
  mutations: {
    MUDA_TEXTO_TOOLBAR (state, texto) {
      state.divHome = false
      state.textoDrawer = texto
    },
    SET_CURRENT_USER (state, currentUser) {
      state.user = currentUser
    },
    S (state, s) {
      state.s = s
    },
    E (state, e) {
      state.e = e
    },
    SET_PERFIL (state, dadosDoPerfil) {
      state.perfil = dadosDoPerfil
    },
    SET_USERS (state, users) {
      state.usuarios = users
    },
    ATIVA_COTACAO_BTC (state) {
      state.divHome = true
      state.textoDrawer = 'Principais Crypto Cotações'
    }
  },
  actions: {
    ATIVA_COTACAO_BTC (state) {
      state.commit('ATIVA_COTACAO_BTC')
    },
    MUDA_TEXTO_TOOLBAR (state, texto) {
      state.commit('MUDA_TEXTO_TOOLBAR', texto)
    },
    SET_CURRENT_USER (state, currentUser) {
      state.commit('SET_CURRENT_USER', currentUser)
    },
    S (state, s) {
      state.commit('S', s)
    },
    E (state, e) {
      state.commit('E', e)
    },
    SET_PERFIL (state, dadosDoPerfil) {
      state.commit('SET_PERFIL', dadosDoPerfil)
    },
    SET_USERS (state, users) {
      state.commit('SET_USERS', users)
    }
  },
  getters: {
    DIV_HOME (state) {
      return state.divHome
    },
    TEXTO_DRAWER (state) {
      return state.textoDrawer
    },
    S (state) {
      return state.s
    },
    E (state) {
      return state.e
    },
    GET_CELULAR_PERFIL (state) {
      return state.perfil.celular
    },
    GET_FULL_PERFIL (state) {
      return state.perfil
    },
    GET_USERS (state) {
      return state.usuarios
    },
    SALDO (state) {
      return state.perfil.saldo_disponivel
    },
    COTAS (state) {
      return state.perfil.cotas
    },
    SAQUES (state) {
      return state.perfil.saques
    },
    SAQUES_LENGTH (state) {
      if(state.perfil.saques === undefined) {
        return 'Não há'
      } else {
        return state.perfil.saques.length
      }
    },
    COTAS_LENGTH (state) {
      if(state.perfil.cotas === undefined) {
        const naoHa = '...'
        return naoHa
      } else {
        var cotasCruas = state.perfil.cotas
        var qtdTotal = 0
        cotasCruas.map(cota => {
          var qtdParcial = parseInt(cota.quantidade)
          qtdTotal += qtdParcial
          return qtdTotal
        })   
      }
      return qtdTotal
    },
    EXTRATOS_LENGTH (state) {
      if(state.perfil.extratos === undefined) {
        return '...'
      } else {
        var extratos = state.perfil.extratos
        var extratosLength = []
        extratos.map(e => extratosLength.push(e))
        var qtdTotal = extratosLength.length
      }
      return qtdTotal
    },
    EXTRATOS (state) {
      var todosExtratos = state.perfil.extratos
      var extratos = []
      todosExtratos.map(e => extratos.push(e))
      return extratos 
    }
  }
})
