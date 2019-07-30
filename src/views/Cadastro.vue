<template>
  <v-app>
    <v-snackbar
      v-model="sucess"
      color="green"
    >
      {{ sucessMessage }}
      <v-btn flat class="white--text" to="/login" >
        Fazer Login
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="erro"
      color="red"
    >
      {{ erroMessage }}
      <v-btn flat class="white--text" to="/cadastro/null" >
        Tentar De Novo
      </v-btn>
    </v-snackbar>
    <div class="principal" style="background-color: #fff; padding: 10px">
      <div class="form-usuario">
        <v-card dark class="elevation-0 mt-1 transparent card-indicador">
          <v-btn to="/" icon>
            <v-icon color="black">
              keyboard_arrow_left
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-chip class="pa-2 elevation-1" color="yellow darken-3">
            <v-icon size="22" color="white">person</v-icon>
            <span class="headline ml-2 font-weight-light">Novo Membro</span>
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn icon></v-btn>
        </v-card>
      </div>
    
      <div class="form-usuario" >

        <v-card dark class="card-form">
          <span class="headline font-weight-thin text-xs-center pa-1 pt-4 pb-4">
            Precisamos de algumas informações sobre você.
          </span>


          <v-form
            v-model="valid"
            class="form pa-4"
          >

            <h3 class="ml-1 mb-1 text-xs-center" >Informações de Login</h3>

            <v-flex xs12 pa-1>
              <v-text-field required box color="yellow darken-3" v-model="email" label="Email"/>
            </v-flex>
            <v-flex xs12 pa-1>
              <v-text-field type="password" box color="yellow darken-3" v-model="senha" label="Senha"/>
            </v-flex>

            <h3 class="ml-1 mb-1 mt-3 text-xs-center">Pessoais</h3>

            <v-flex xs12 pa-1>
              <v-text-field 
                label="Nome"
                v-model="nome"
                box color="yellow darken-3"             
              />
            </v-flex>
            <v-flex xs12 md6 pa-1>
              <v-text-field
                v-model="cpf"
                mask="###.###.###-##"
                label="CPF"
                placeholder="123.456.789-10"
                box color="yellow darken-3"
                required
                />
            </v-flex>
            <v-flex xs12 md6 pa-1>
              <v-text-field
                v-model="celular"
                box color="yellow darken-3"
                label="Celular"
                />
            </v-flex>
            <v-flex xs12 md6 pa-1>
              <v-text-field
                v-model="nascimento"
                mask="##/##/####"
                box color="yellow darken-3"
                label="Nascimento"
                required
              />
            </v-flex>
            <v-flex xs12 md6 pa-1>
              <v-text-field
                v-model="endereco"
                box color="yellow darken-3" label="Endereço"/>
            </v-flex>
            <v-flex xs12 md6 pa-1>
              <v-text-field
                v-model="cidade"
                box color="yellow darken-3" label="Cidade"/>
            </v-flex>
          </v-form>

        </v-card>
      </div>
      <div class="form-usuario">
        <v-card class="card-indicador transparent elevation-0 pa-0 ma-0 mt-1">
          <v-btn
            :disabled="!valid"
            color=' yellow darken-3'
            block
            large
            class="transparent mb-1"
            @click="confirmarInscricao"
          >
            <span class="white--text mr-2">Confirmar Inscrição</span>
            <v-icon color="white" size='20'>check</v-icon>
          </v-btn>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<script>
import { db, auth } from '../services/Firebase.js'
export default {
  props: [
    'id'
  ],
  data () {
    return {
      valid: false,
      email: '',
      emailRules: '',
      senha: '',
      nome: '',
      cpf: '',
      celular: '',
      nascimento: '',
      endereco: '',
      cidade: '',
      sucess: false,
      sucessMessage: '',
      erro: false,
      erroMessage: ''
    }
  },
  methods: {
    confirmarInscricao () {
      var e = this.email
      var s = this.senha
      auth.signOut().then(
        () => console.log('saiu')
      )
      auth.createUserWithEmailAndPassword(e, s)
      .then(
        () => {
          console.log('criou')
          auth.signInWithEmailAndPassword(e, s)
            .then(
              () => this.criaFichaDoUsuario()      
            )
        })
    },
    async criaFichaDoUsuario () {
      const userUid = await auth.currentUser.uid
      const ficha = {
        nome: this.nome,
        cpf: this.cpf,
        endereco: this.endereco,
        cidade: this.cidade,
        celular: this.celular,
        nascimento: this.nascimento,
        termo: true,
        criadoEm: Date.now(),
        cotas: [],
        saques: [],
        extratos: [],
        tickets: [],
        block: 0,
        saldo_disponivel: 0,
        saldo_bloqueado: 0
      }
      console.log('user ui: ' + userUid)
      db.ref('usuarios/' + userUid).set(ficha)
        .then(() => {
          this.sucess = true
          this.sucessMessage = "Cadastro Pronto, Seja Bem Vindo(a)"
        })
        .catch((error) => {
          this.erro = true
          this.erroMessage = "Houve algum erro: " + error.message 
        })
    }
  }
}
</script>


<style>
  .principal {
    padding: 5px;
    display: flex;
    width: 100%;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .form-usuario {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .card-indicador {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-radius: 5px;
    width: 600px;
    padding: 5px;
    margin-bottom: 8px;
  }

  .card-form {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 600px;
    min-height: 300px;
    border-radius: 5px;
  }
  
  .form {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }
</style>
