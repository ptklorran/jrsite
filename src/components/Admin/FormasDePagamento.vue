<template>
  <div class="formasDePagamento">
    <v-dialog
      v-model="dialog"
      fullscreen
    >
    <v-card>
      <v-flex xs12> 
        <v-toolbar color="grey darken-4">
            <v-avatar color="white" class="elevation-1">
              <v-icon color="yellow darken-3">attach_money</v-icon>
            </v-avatar>
          <v-toolbar-title>
            <span class="font-weight-light white--text">Adicionar nova forma de pagamento</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog=false"><v-icon color="white">close</v-icon></v-btn>
        </v-toolbar>
        <v-flex xs12 class="centralizaTudo">
          <v-flex md6 mt-1>
            <v-snackbar
              color="green"
              v-model="sucesso"
            >
              {{ mensagemSucesso }}
              <v-btn
                color="pink"
                flat
                @click="sucesso = false"
              >
                Fechar
              </v-btn>
            </v-snackbar>
            <v-snackbar
              color="red"
              v-model="erro"
            >
              {{ mensagemErro }}
              <v-btn
                color="pink"
                flat
                @click="erro = false"
              >
                Fechar
              </v-btn>
            </v-snackbar>
            <v-card
              light
              class="pa-3"
              width="600"
            >
              <h3 class="text-xs-center mb-3">Dados do método de pagamento</h3>
              <v-text-field color="yellow darken-3" v-model="banco" box label="Banco">Banco</v-text-field>
              <v-text-field color="yellow darken-3" v-model="agencia" box  label="Agência"></v-text-field>
              <v-text-field color="yellow darken-3" v-model="tipo" box  label="Tipo" hint="Ex: corrente, poupança, etc..."></v-text-field>
              <v-text-field color="yellow darken-3" v-model="conta" box label="Conta"></v-text-field>
              <v-text-field color="yellow darken-3" v-model="titular" box label="titular"></v-text-field>
              <div class="mb-2 pb-2" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%">
                <label for="enviaArquivo" class="mb-3" style="border: 1px solid #666; background-color: #F9A825; border-radius: 2px; color: #fff, padding: 10px;">Carregar Foto do Banco</label>
                <input id="enviaArquivo" style="display: none; color = blue" @change="onFileSelected" type="file" name="images" accept="image/jpeg,image/jpg,image/png">
                <v-progress-circular v-if="uploadEmAndamento" class="ml-2" color="yellow darken-3" :value="porcentagemUpload"></v-progress-circular>
                <img height="200" style="border-radius: 10px;" v-show="imagemUrl.length > 0" :src="this.imagemUrl" alt="imagemBanco" />
              </div>
              <v-btn color="yellow darken-3" block @click="addFormasDePagamento">Adicionar</v-btn>
            </v-card>
          </v-flex>
        </v-flex>
        
      </v-flex>
    </v-card>
    </v-dialog>
    <v-flex xs12>
      <v-flex xs12 md3>
        <v-card
          height="250"
          light
          class="centralizaTudo"
        >
          <v-btn 
            @click="dialog=true"
            icon>
            <v-icon>add</v-icon>
          </v-btn>
          <h3 class="text-xs-center">Adicionar Nova Forma De Pagamento</h3>
        </v-card>
      </v-flex>
    </v-flex>
  </div>
</template>

<script>
import { db, storage } from '../../services/Firebase.js'
import Moment from 'moment'
import 'moment/locale/pt-br'

export default {
  data () {
    return {
      dialog: false,
      sucesso: false,
      mensagemSucesso: '',
      erro: false,
      mensagemErro: '',
      banco: null,
      agencia: null,
      tipo: null,
      conta: null,
      titular: null,
      imagemUrl: '',
      fileSelected: null,
      porcentagemUpload: 0,
      uploadEmAndamento: false,
      formasDePagamento: []
    }
  },
  methods: {
    // pega arquivo
    onFileSelected(event) {
      this.fileSelected = event.target.files[0]
      this.enviaImagemProFirebase()
    },
    enviaImagemProFirebase() {
      const storageFire = storage.ref('formasDePagamento/' + this.fileSelected.name)
      const task = storageFire.put(this.fileSelected)
      task.on('state_changed', snapshot => {
        this.uploadEmAndamento = true
        let porcentagem = (snapshot.bytesTransferred/snapshot.totalBytes) * 100
        this.porcentagemUpload = porcentagem
      },
      (error) => {
        this.uploadEmAndamento = false
        this.erro = true
        this.mensagemSucesso = 'Erro ao enviar: ' + error.message
      },
      () => {
        task.snapshot.ref.getDownloadURL().then(url => this.imagemUrl = url)
        this.porcentagemUpload = 100
        this.uploadEmAndamento = false
        this.sucesso = true
        this.mensagemSucesso = "Arquivo enviado com sucesso"
      }
      
      )
    },
    //passo0
    pegaFormasDePagamento () {
      const query = db.ref('formasDePagamento')
      query.on('value', snapshot => {
        let allFormasDePagamento = []
        snapshot.forEach(item => {
          let it = item.val()
          it.key = item.key
          allFormasDePagamento.push(it)
        })
        this.formasDePagamento = allFormasDePagamento
      })
    },
    //passo1
    addFormasDePagamento() {
      var dados = {
        banco: this.banco,
        agencia: this.agencia,
        tipo: this.tipo,
        conta: this.conta,
        titular: this.titular,
        imagemUrl: this.imagemUrl
      }
      this.enviaFormaDePagamento(dados)
    },
    //passo2
    enviaFormaDePagamento(dados) {
      db.ref('formasDePagamento').push(dados)
        .then(() => {
          this.sucesso = true
          this.mensagemSucesso = "Seu novo método de pagamento foi cadastrado"
        })
        .catch(() => {
          this.erro = true
          this.mensagemErro = 'Falha no cadastro, tente novamente agora mesmo.'
        })
    }
    //enviaImagem e adiciona o endereço na variável this.imagemUrl para que seja enviada no método de pagamento
    //enviaImagem()
  },
  created () {
    this.pegaFormasDePagamento()
  }
}
</script>


<style>
  .formasDePagamento {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }

  .centralizaTudo {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
