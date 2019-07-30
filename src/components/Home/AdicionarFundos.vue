<template>
  <div class="home">
      <v-snackbar
        v-model="sucesso"
        color="green"
      >
        {{ sucessoMessage }}
        <v-btn
        color="pink"
        flat
        @click="sucesso = false"
      >
        Fechar
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
        @click="erro = false"
      >
        Fechar
      </v-btn>
      </v-snackbar>
      <v-dialog
        width="350"
        v-model="recompra"
        persistent
      >
        <v-card
          dark=""
          height="370"
          class="pa-2 ma-2"
        >
          <v-flex xs12>
            <v-toolbar class="elevation-0 ml-0 pl-0" color="transparent">
              <v-spacer></v-spacer>
              <v-btn @click="recompra = false" outline color="yellow darken-3">
                cancelar
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-flex xs12>
              <v-card light class="ma-3 ml-3 mr-3 mt-0">
                <div class="home" style="flex-direction: column">
                  <span class="subtitle">Valor</span>
                  <span class=" mt-2 mb-2 display-2 font-weight-light">R$ {{ valorDaRecompra }},00</span>

                  <v-divider></v-divider>

                  <v-chip color="grey darken-4" class="ma-2 mb-0 elevation-1 pr-0 pl-0 pa-2" text-color="white">
                    <v-btn color="red darken-3" @click="recompraCotasQuantidade -= 1" icon>
                      <v-icon color="white">remove</v-icon>
                    </v-btn>
                    <span class="title font-weight-bold mr-3 ml-3 white--text">{{ recompraCotasQuantidade }}</span>
                    <v-btn color="green darken-3" @click="recompraCotasQuantidade += 1" icon>
                      <v-icon color="white">add</v-icon>
                    </v-btn>
                  </v-chip>
                  <h3>Quantidade</h3>
                </div>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-toolbar class="elevation-0 ml-0 pl-0" color="transparent">
                <v-btn :disabled="temSaldoPraComprar" block class="ml-0 white--text" @click="antesDeFinalizaRecompra" large color="yellow darken-3"> <span v-if="!temSaldoPraComprar">Finalizar Compra</span> <span v-if="temSaldoPraComprar">Saldo Insuficiente</span> <v-icon size="15" class="ml-2 mb-1">check</v-icon> <v-progress-circular indeterminate v-if="carregandoCompra" size="20" /></v-btn>
              </v-toolbar>
            </v-flex>
          </v-flex>
        </v-card>
      </v-dialog>
<!-- V-DIALOG RECOMPRA ACABA AQUI -->
<!-- V-DIALOG com uma forma de compra existente começa AQUI -->
      <v-dialog
        persistent
        v-model="abreForma"
        width="400"
      >
        <v-card style="border-radius: 10px;">
          <div class="pa-2" style="display: flex; flex-direction: row; width: 100%">
            <img style="border-radius: 8px;" height="40" :src="formaDePagamento !== null ? formaDePagamento.imagemUrl : 'n'" alt="logoBanco"/>
            <v-spacer></v-spacer>
            <v-btn style="border-radius: 10px;" class="ma-0" outline color="yellow darken-3" @click="fechaForma">Cancelar <v-icon class="ml-2" size="10">close</v-icon></v-btn>
          </div>
          <v-flex class="pa-2">
              <h3 class="font-weight-light text-xs-center">Informações da Conta Para Transferência de Fundos</h3>
            <v-card
              light
              class="pa-2"
            >
              <v-flex class="mt-1" xs12>
                <v-flex class="mt-2" xs12>
                  <span class="subtitle ma-1">
                    <span class="font-weight-bold">Banco:</span> {{ formaDePagamento !== null ? formaDePagamento.banco : 'Não necessário' }}
                  </span>
                </v-flex>
                <v-flex class="mt-2" xs12>
                  <span class="subtitle ma-1">
                    <span class="font-weight-bold">Agência:</span> {{ formaDePagamento !== null ? formaDePagamento.agencia : 'Não necessário' }}
                  </span>
                </v-flex>
                <v-flex class="mt-2" xs12>
                  <span class="subtitle ma-1">
                    <span class="font-weight-bold">Conta:</span> {{ formaDePagamento !== null ? formaDePagamento.conta : 'Não necessário' }}
                  </span>
                </v-flex>
                <v-flex class="mt-2" xs12>
                  <span class="subtitle ma-1">
                    <span class="font-weight-bold">Tipo:</span> {{ formaDePagamento !== null ? formaDePagamento.tipo : 'Não necessário' }}
                  </span>
                </v-flex>
                <v-flex class="mt-2" xs12>
                  <span class="subtitle ma-1">
                    <span class="font-weight-bold">Titular:</span> {{ formaDePagamento !== null ? formaDePagamento.titular : 'Não necessário' }}
                  </span>
                </v-flex>
              </v-flex>
              <div class="mb-2 mt-3 pb-2" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%">
                <label for="enviaArquivo" class="mb-3" style="cursor: pointer; border: 1px solid #666; background-color: #0277BD; border-radius: 2px; text-color: #fff, padding: 10px;"><span class="white--text ma-4 font-weight-light">Carregar Foto do Comprovante</span></label>
                <input id="enviaArquivo" style="display: none; color = blue" @change="onFileSelected" type="file" name="images" accept="image/jpeg,image/jpg,image/png">
                <v-progress-circular v-if="uploadEmAndamento" class="ml-2" color="yellow darken-3" :value="porcentagemUpload"></v-progress-circular>
                <img height="200" style="border-radius: 10px;" v-show="imagemComprovante.length > 0" :src="this.imagemComprovante" alt="imagemBanco" />
              </div>
            </v-card>
            <v-btn @click="beforeEnviaParaAnalise" :disabled="imagemComprovante.length > 0 ? false : true" block color="yellow darken-3">
              
              <v-progress-circular v-if="envioEmAndamento" class="ml-2" color="black" indeterminate></v-progress-circular>
              <span v-else>Enviar Para Análise</span>
            </v-btn>
          </v-flex>
        </v-card>
      </v-dialog>
<!-- V-DIALOG com uma forma de compra existente termina AQUI -->
      <v-flex xs12 md4>
        <v-card
          dark
          class="ma-2"
          height="300"
        >
          <v-img
            height="150"
            src="https://cdn-images-1.medium.com/max/1600/1*X_1EgzcfJgbtI-eF7PQm2Q.png"
          ></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 text-xs-center">Valor: R$150,00</h3>
              <div>Comprar com Coinbase</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn color="yellow darken-3" block  target="blank">Comprar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card
          class="ma-2"
          dark
          height="300"
        >
          <v-img
            height="150"
            src="https://png.pngtree.com/element_origin_min_pic/16/12/31/229a54ebcd45168ecfbfd9550f46a971.jpg"
          ></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 text-xs-center">Valor: R$150,00</h3>
              <div>Comprar com Rendimentos</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn @click="recompra = true" color="yellow darken-3" block  target="blank">Comprar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4
        v-for="forma in formasDePagamento"
        :key="forma.key"
      >
        <v-card
          class="ma-2"
          dark
          height="300"
        >
          <v-img
            style="height: 150px;"
            :src="forma.imagemUrl"
          ></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 text-xs-center">Valor: R$ 150,00</h3>
              <div>Comprar com {{ forma.banco }}</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn @click.prevent="abreFormaDePagamento(forma)" color="yellow darken-3" block  target="blank">Comprar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      
  </div>
</template>

<script>
//href="https://commerce.coinbase.com/checkout/af297bb8-7b1b-40a3-b409-fb13cebd011a"
import { db, auth, storage } from '../../services/Firebase.js'
import Moment from 'moment'
import 'moment/locale/pt-br'

export default {
  data () {
    return {
      abreForma: false,
      formaDePagamento: null,
      recompraCotasQuantidade: 0,
      valorDaRecompra: 0,
      formasDePagamento: [],
      tabs: null,
      recompra: false,
      sucesso: false,
      sucessoMessage: '',
      imagemComprovante: '',
      erro: false,
      erroMessage: '',
      temSaldoPraComprar: true,
      carregandoCompra: false,
      uploadEmAndamento: false,
      fileSelected: null,
      porcentagemUpload: '',
      envioEmAndamento: false
    }
  },
  watch: {
    recompraCotasQuantidade (val) {
      if(val <= 0) {
        this.valorDaRecompra = 0
        this.recompraCotasQuantidade = 0
      }
      var valorDaRecompra = val * 150
      if (valorDaRecompra > this.$store.getters.GET_FULL_PERFIL.saldo_disponivel) {
        this.temSaldoPraComprar = true
      } else {
        this.temSaldoPraComprar = false
      }
      this.valorDaRecompra = valorDaRecompra
    }
  },
  methods: {
    onFileSelected(event) {
      this.fileSelected = event.target.files[0]
      this.enviaImagemProFirebase()
    },
    async enviaImagemProFirebase() {
      const userId = await auth.currentUser.uid
      const storageFire = storage.ref('comprovantes/' + userId + '/' + this.fileSelected.name)
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
        task.snapshot.ref.getDownloadURL().then(url => this.imagemComprovante = url)
        this.porcentagemUpload = 100
        this.uploadEmAndamento = false
        this.sucesso = true
        this.sucessoMessage = "Arquivo enviado com sucesso"
      }
      
      )
    },
    abreFormaDePagamento (value) {
      const forma = value
      this.formaDePagamento = forma
      this.abreForma = true
    },
    fechaForma () {
      this.forma = null
      this.abreForma = false
    },
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
    antesDeFinalizaRecompra () {
      if(this.recompraCotasQuantidade <= 0) {
        this.erro = true
        this.erroMessage = 'A quantidade de cotas deve ser maior que zero'
      } else {
        this.finalizaRecompra()
      }
    },
    finalizaRecompra () {
      this.carregandoCompra = true      

      var posicaoCota = 0
      var temCotaOuNao = this.$store.getters.GET_FULL_PERFIL.cotas
      var saldoAtual = this.$store.getters.GET_FULL_PERFIL.saldo_disponivel
      var valorDaRecompra = this.valorDaRecompra
      var saldoDepoisDaCompra = saldoAtual - valorDaRecompra
      var dataAtual = Moment().locale('pt-br')
      var dataFinal = Moment().add(548, 'days').calendar()
      var quantidadeCotas = this.recompraCotasQuantidade
      var idUser = auth.currentUser.uid
      if(temCotaOuNao === undefined) {
        posicaoCota = 0
      } else {
        posicaoCota = temCotaOuNao.length
      }
      
      var dadosCota = {
        id_user: idUser,
        id: posicaoCota,
        primeiro_recebimento: dataAtual.toString(),
        ultimo_recebimento: dataFinal,
        status: '1',
        quantidade: quantidadeCotas,
        saldo_antes: saldoAtual,
        saldo_depois_da_compra: saldoDepoisDaCompra
      }

      this.atualizaFireComRecompra(dadosCota)
    },
    atualizaFireComRecompra(cota) {
      var updates = {}
      updates['usuarios/' + cota.id_user + '/cotas/' + cota.id] = cota
      updates['usuarios/' + cota.id_user + '/saldo_disponivel'] = cota.saldo_depois_da_compra
      db.ref().update(updates)
        .then(() => {
          this.sucesso = true
          this.sucessoMessage = 'Compra Realizada Com Sucesso'
        })
        .catch((error) => {
          this.erro = true
          this.erroMessage = error.message
        })
        .finally(() => {
          this.recompra = false
        })
    },
    async beforeEnviaParaAnalise () {
      this.envioEmAndamento = true
      const userUid = await auth.currentUser.uid
      const dataDeHoje = Moment().locale('pt-br').format('L')
      const nomeDoUsuario = this.$store.getters.GET_FULL_PERFIL.nome
      const cpfDoUsuario = this.$store.getters.GET_FULL_PERFIL.cpf
      const nomeBanco = this.formaDePagamento.banco
      const imagemBanco = this.formaDePagamento.imagemUrl
      const dados = {
        descricao: 'Análise De Comprovante',
        imagemComprovante: this.imagemComprovante,
        uid: userUid,
        data: dataDeHoje,
        nomeDoUsuario: nomeDoUsuario,
        cpfDoUsuario: cpfDoUsuario,
        nomeDoBanco: nomeBanco,
        imagemDoBanco: imagemBanco,
        status: 'pendente'
      }
      this.enviaParaAnalise(dados)
    },
    enviaParaAnalise (dados) {
      db.ref('comprovantesParaAnalise').push(dados)
        .then(() => {
          this.sucesso = true
          this.sucessoMessage = 'Enviado Para Análise'
        })
        .catch((error) => {
          this.erro = true
          this.erroMessage = "Erro inesperado" + error.message
        })
        .then(() => {
          this.envioEmAndamento = false
          this.fechaForma()
        })
    }
  },
  created () {
    this.pegaFormasDePagamento()
  }
}
</script>

<style>
.home {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

.recompraDialog {
  display: flex;
  height: 600px;
}
</style>

