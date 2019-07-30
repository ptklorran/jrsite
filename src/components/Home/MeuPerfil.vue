<template>
    <div class="meuPerfil">
      <v-card style="border-radius: 10px;" light class="meuPerfil pa-3 pt-4 wrap">
      <v-snackbar
      v-model="sucesso"
      color="green"
    >
      {{ sucessoMessage }}
      <v-btn
        color="black"
        flat
        @click="snackbar = false"
      >
        Close
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
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
      <v-flex xs12>
        <v-layout>
          <v-spacer></v-spacer>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-toolbar color="transparent elevation-0">
          <v-spacer></v-spacer>
          <v-chip color="yellow darken-3" class="mb-4 pa-1" text-color="white">
            <v-avatar>
              <v-icon color="black">account_circle</v-icon>
            </v-avatar>
            <span class="title font-weight-light black--text">Edite Seus Dados</span>
          </v-chip>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-flex xs12>
          <v-text-field
            label="Nome"
            append-icon="person"
            v-model="perfil.nome"
            hint="Clique no botão salvar para salvar qualquer alteração feita"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            label="Nascimento"
            v-model="perfil.nascimento"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12 >
          <v-text-field
            label="CPF"
            v-model="perfil.cpf"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12 >
          <v-text-field
            label="celular"
            v-model="perfil.celular"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
      </v-flex>
      </v-card>

      <v-card style="border-radius: 10px;" light class="meuPerfil mt-4 pa-3 pt-5">
      <v-flex xs12>
        <v-toolbar color="transparent" class="elevation-0">
          <v-spacer></v-spacer>
          <v-chip color="yellow darken-3" class="mb-5 pa-1" text-color="white">
            <v-avatar>
              <v-icon color="black">attach_money</v-icon>
            </v-avatar>
            <span class="title font-weight-light black--text">Dados Bancários</span>
          </v-chip>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-flex xs12 >
          <v-text-field
            label="Agencia"
            v-model="perfil.agencia"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12 >
          <v-text-field
            label="Banco"
            v-model="perfil.banco"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12 >
          <v-text-field
            label="Conta"
            v-model="perfil.conta"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            label="Tipo da Conta"
            v-model="perfil.tipo_conta"
            hint="ex: corrente ou poupança"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12 >
          <v-text-field
            label="Titular da Conta"
            v-model="perfil.titular"
            color="yellow darken-3"
            box
          >
          </v-text-field>
        </v-flex>
      </v-flex>
    </v-card>
    <v-toolbar class="elevation-0" color="transparent">
      <v-btn round block class="mt-2" color="yellow darken-3" @click="atualizarPerfil">Salvar <v-progress-circular color="black" v-if="carregandoNovoPerfil" indeterminate></v-progress-circular> </v-btn>
    </v-toolbar>
    <v-toolbar class="elevation-0" color="transparent">
      <v-btn round block class="mt-2" color="yellow darken-3" @click="atualizaEmailDialog=true">Alterar Email <v-progress-circular color="black" v-if="carregandoNovoPerfil" indeterminate></v-progress-circular> </v-btn>
    </v-toolbar>
    <v-toolbar class="elevation-0" color="transparent">
      <v-btn round block class="mt-2" color="yellow darken-3" @click="atualizaSenhaDialog=true">Alterar Senha <v-progress-circular color="black" v-if="carregandoNovoPerfil" indeterminate></v-progress-circular> </v-btn>
    </v-toolbar>
    <v-dialog
      v-model="atualizaEmailDialog"
    >
      <v-card
        class="pa-3"
        light
      >
        <v-text-field color="yellow darken-3" label="Novo email" v-model="novoEmail" box></v-text-field>
        <v-card-actions>
          <v-btn color="yellow darken-3" round @click="atualizarEmail">Confirmar troca
            <v-progress-circular v-if="carregando" color="black" indeterminate></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="atualizaSenhaDialog"
    >
      <v-card
        class="pa-3"
        light
      >
        <v-text-field type="password" color="yellow darken-3" label="Nova Senha" v-model="novaSenha" box></v-text-field>
        <v-text-field type="password" color="yellow darken-3" label="Confirmação de Nova Senha" v-model="cNovaSenha" box></v-text-field>
        <v-card-actions>
          <v-btn color="yellow darken-3" round @click="atualizarSenha">Confirmar Alteração
            <v-progress-circular v-if="carregando" color="black" indeterminate></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
import { db, auth } from '../../services/Firebase.js'
export default {
  data () {
    return {
      carregando: false,
      perfil: {},
      sucesso: false,
      sucessoMessage: '',
      erro: '',
      erroMessage: '',
      carregandoNovoPerfil: false,
      cu: '',
      novoPerfil: '',
      novaSenha: '',
      cNovaSenha: '',
      novoEmail: '',
      atualizaEmailDialog: false,
      atualizaSenhaDialog: false
    }
  },
  computed: {
    GET_FULL_PERFIL () {
      return this.$store.getters.GET_FULL_PERFIL
    }
  },
  methods: {
    async atualizarPerfil () {
      this.carregandoNovoPerfil = true
      const perfilAtualizado = {
        cpf: this.perfil.cpf === '' ? null : this.perfil.cpf,
        nascimento: this.perfil.nascimento === '' ? null : this.perfil.nascimento,
        nome: this.perfil.nome === '' ? null : this.perfil.nome,
        celular: this.perfil.celular === '' ? null : this.perfil.celular,
        agencia: this.perfil.agencia === '' ? null : this.perfil.agencia,
        banco: this.perfil.banco === '' ? null : this.perfil.banco,
        conta: this.perfil.conta === '' ? null : this.perfil.conta,
        tipo_conta: this.perfil.tipo_conta === '' ? null : this.perfil.tipo_conta,
        titular: this.perfil.titular === '' ? null : this.perfil.titular
      }
      const uid = await auth.currentUser.uid
      this.enviaAtualizacoesParaOFire(perfilAtualizado, uid)
    },
    enviaAtualizacoesParaOFire(novoPerfil, uid) {
      db.ref('usuarios/' + uid).update(novoPerfil)
        .then(() => {
          this.sucesso = true
          this.sucessoMessage = "Seu Perfil foi Atualizado"
        })
        .catch((error) => {
          this.erro = true
          this.erroMessage = "Tivemos um problema" + error.message
        })
        .finally(() => {
          this.carregandoNovoPerfil = false
        })
    },
    atualizarEmail () {
      this.carregando = true
      const user = auth.currentUser
      const novoEmail = this.novoEmail
      if (novoEmail === '') {
        this.erro = true
        this.erroMessage = 'Coloque um email válido'
      } else {
        user.updateEmail(novoEmail)
          .then(() => {
            this.sucesso = true
            this.sucessoMessage = 'Email Atualizado com Sucesso'
          })
          .catch(error => {
            this.erro = true
            this.erroMessage = 'Erro: ' + error.message
          })
          .then(() => {
            this.atualizaEmailDialog=false
            this.carregando = false
          })
      }
    },
    atualizarSenha () {
      this.carregando = true
      const user = auth.currentUser
      const novaSenha = this.novaSenha
      const cNovaSenha = this.cNovaSenha
      if (novaSenha === '' || novaSenha !== cNovaSenha) {
        this.erro = true
        this.erroMessage = 'Senha não bate'
      } else {
        user.updatePassword(novaSenha)
          .then(() => {
            this.sucesso = true
            this.sucessoMessage = 'Senha Atualizada com Sucesso'
          })
          .catch(error => {
            this.erro = true
            this.erroMessage = 'Erro: ' + error.message
          })
          .then(() => {
            this.atualizaSenhaDialog=false
            this.carregando = false
          })
      }
    }
  },
  created () {
    this.perfil = this.$store.getters.GET_FULL_PERFIL
  }
}
</script>

<style>
  .meuPerfil {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
</style>
