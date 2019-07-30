<template>
  <div class="principal">
    <div style="display: flex; width: 100%; justify-content: center; align-items: center" class="mb-4">
      <span v-show="error">Erro: {{ errorMessage }} </span>
      <img height="20" width="20" class="mr-2 mb-1" src="https://firebasestorage.googleapis.com/v0/b/investfacil-d1f3d.appspot.com/o/logo.png?alt=media&token=ff5da0ed-e347-4095-a9d7-8173f7431087"/>      
      <span class="headline white--text text-xs-center text-uppercase">Invest</span>
      <span class="headline white--text font-weight-thin text-xs-center text-uppercase">Fácil</span>
    </div>
    <span class="text-xs-center title font-weight-thin white--text mb-3"> Um sms com o código foi enviado para o número {{ celular }}. </span>
    <v-card
      class="loginForm2"
    >
      <v-progress-circular
        v-show="entrando"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <v-flex xs12 ma-3
      >
        <v-text-field
          color="yellow darken-3"
          label="Insira o código aqui"
          v-model="codigoDeConfirmação"
        ></v-text-field>
        <v-btn
          block
          class="yellow darken-3"
          round
          @click="loginNumber"
        >Verificar</v-btn>
      </v-flex>
      <div id="firebaseui-auth-container">
      </div>
    <div>
      <span class="subtitle"> v0.46 </span>
    </div>
    </v-card>
    <v-dialog
      width="250"
      v-model="selecionaPaisDialog"
      persistent
    >
      <v-card
        style="display: flex; flex-direction: column;"
        class="pa-3"
      >
        <h4>Selecione o código do seu país</h4>
        <v-autocomplete
          v-model="pais"
          :items="items"
          :hint="`${pais.nome}, ${pais.codigo}`"
          hide-no-data
          box
          chips
          color="yellow darken-3"
          label="País"
          item-text="nome"
          item-value="codigo"
          persistent-hint
          return-object
          single-line
        />
          <v-text-field
            v-model="celular"
            box
            color="yellow darken-3"
            hint="celular"
            persistent-hint
          >

          </v-text-field>
          <v-btn
            v-show="pais.btn"
            round
            block
            class="mt-3"
            color="yellow darken-3"
            @click="confirmaPais"
          >
            Enviar
          </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { auth, db } from '../services/Firebase.js'
import firebase from 'firebase'
import firebaseui from 'firebaseui'

export default {
  data () {
    return {
      selecionaPaisDialog: false,
      verificaRobo: false,
      pais: {nome: '', codigo: '', btn: false},
      items: [
        {
          "nome": "Afeganistão",
          "codigo": "+93",
          "btn": true
        },
        {
          "nome": "Albânia",
          "codigo": "+355",
          "btn": true
        },
        {
          "nome": "Algéria",
          "codigo": "+213",
          "btn": true
        },
        {
          "nome": "Samoa Americana",
          "codigo": "+1684",
          "btn": true
        },
        {
          "nome": "Andorra",
          "codigo": "+376",
          "btn": true
        },
        {
          "nome": "Angola",
          "codigo": "+244",
          "btn": true
        },
        {
          "nome": "Anguilla",
          "codigo": "+1264",
          "btn": true
        },
        {
          "nome": "Antártida",
          "codigo": "+672",
          "btn": true
        },
        {
          "nome": "Antigua e Barbuda",
          "codigo": "+1268",
          "btn": true
        },
        {
          "nome": "Argentina",
          "codigo": "+54",
          "btn": true
        },
        {
          "nome": "Armênia",
          "codigo": "+374",
          "btn": true
        },
        {
          "nome": "Aruba",
          "codigo": "+297",
          "btn": true
        },
        {
          "nome": "Austrália",
          "codigo": "+61",
          "btn": true
        },
        {
          "nome": "Áustria",
          "codigo": "+43",
          "btn": true
        },
        {
          "nome": "Azerbaijão",
          "codigo": "+994",
          "btn": true
        },
        {
          "nome": "Bahamas",
          "codigo": "+1242",
          "btn": true
        },
        {
          "nome": "Bahrein",
          "codigo": "+973",
          "btn": true
        },
        {
          "nome": "Bangladesh",
          "codigo": "+880",
          "btn": true
        },
        {
          "nome": "Barbados",
          "codigo": "+246",
          "btn": true
        },
        {
          "nome": "Bielorrússia",
          "codigo": "+375",
          "btn": true
        },
        {
          "nome": "Bélgica",
          "codigo": "+32",
          "btn": true
        },
        {
          "nome": "Belize",
          "codigo": "+501",
          "btn": true
        },
        {
          "nome": "Benin",
          "codigo": "+229",
          "btn": true
        },
        {
          "nome": "Bermuda",
          "codigo": "+1441",
          "btn": true
        },
        {
          "nome": "Butão",
          "codigo": "+975",
          "btn": true
        },
        {
          "nome": "Bolívia",
          "codigo": "+591",
          "btn": true
        },
        {
          "nome": "Bósnia e Herzegovina",
          "codigo": "+387",
          "btn": true
        },
        {
          "nome": "Botswana",
          "codigo": "+267",
          "btn": true
        },
        {
          "nome": "Ilha Bouvet",
          "codigo": "+47",
          "btn": true
        },
        {
          "nome": "Brasil",
          "codigo": "+55",
          "btn": true
        },
        {
          "nome": "Território Britânico do Oceano Índico",
          "codigo": "+246",
          "btn": true
        },
        {
          "nome": "Brunei",
          "codigo": "+673",
          "btn": true
        },
        {
          "nome": "Bulgária",
          "codigo": "+359",
          "btn": true
        },
        {
          "nome": "Burkina Faso",
          "codigo": "+226",
          "btn": true
        },
        {
          "nome": "Burundi",
          "codigo": "+257",
          "btn": true
        },
        {
          "nome": "Camboja",
          "codigo": "+855",
          "btn": true
        },
        {
          "nome": "Camarões",
          "codigo": "+237",
          "btn": true
        },
        {
          "nome": "Cabo Verde",
          "codigo": "+238",
          "btn": true
        },
        {
          "nome": "Ilhas Cayman",
          "codigo": "+1345",
          "btn": true
        },
        {
          "nome": "República Centro-Africana",
          "codigo": "+236",
          "btn": true
        },
        {
          "nome": "Chade",
          "codigo": "+235",
          "btn": true
        },
        {
          "nome": "Chile",
          "codigo": "+56",
          "btn": true
        },
        {
          "nome": "China",
          "codigo": "+86",
          "btn": true
        },
        {
          "nome": "Ilha Christmas",
          "codigo": "+61",
          "btn": true
        },
        {
          "nome": "Ilhas Cocos (Keeling)",
          "codigo": "+672",
          "btn": true
        },
        {
          "nome": "Colômbia",
          "codigo": "+57",
          "btn": true
        },
        {
          "nome": "Comores",
          "codigo": "+269",
          "btn": true
        },
        {
          "nome": "Congo",
          "codigo": "+242",
          "btn": true
        },
        {
          "nome": "Congo (DR)",
          "codigo": "+242",
          "btn": true
        },
        {
          "nome": "Ilhas Cook",
          "codigo": "+682",
          "btn": true
        },
        {
          "nome": "Costa Rica",
          "codigo": "+506",
          "btn": true
        },
        {
          "nome": "Costa do Marfim",
          "codigo": "+225",
          "btn": true
        },
        {
          "nome": "Croácia",
          "codigo": "+385",
          "btn": true
        },
        {
          "nome": "Cuba",
          "codigo": "+53",
          "btn": true
        },
        {
          "nome": "Chipre",
          "codigo": "+357",
          "btn": true
        },
        {
          "nome": "República Tcheca",
          "codigo": "+420",
          "btn": true
        },
        {
          "nome": "Dinamarca",
          "codigo": "+45",
          "btn": true
        },
        {
          "nome": "Djibuti",
          "codigo": "+253",
          "btn": true
        },
        {
          "nome": "Dominica",
          "codigo": "+1767",
          "btn": true
        },
        {
          "nome": "República Dominicana",
          "codigo": "+1809",
          "btn": true
        },
        {
          "nome": "Equador",
          "codigo": "+593",
          "btn": true
        },
        {
          "nome": "Estados Unidos",
          "codigo": "+1",
          "btn": true
        },
        {
          "nome": "Egito",
          "codigo": "+20",
          "btn": true
        },
        {
          "nome": "El Salvador",
          "codigo": "+503",
          "btn": true
        },
        {
          "nome": "Guiné Equatorial",
          "codigo": "+240",
          "btn": true
        },
        {
          "nome": "Eritreia",
          "codigo": "+291",
          "btn": true
        },
        {
          "nome": "Estônia",
          "codigo": "+372",
          "btn": true
        },
        {
          "nome": "Etiópia",
          "codigo": "+251",
          "btn": true
        },
        {
          "nome": "Ilhas Malvinas",
          "codigo": "+500",
          "btn": true
        },
        {
          "nome": "Ilhas Faroe",
          "codigo": "+298",
          "btn": true
        },
        {
          "nome": "Fiji",
          "codigo": "+679",
          "btn": true
        },
        {
          "nome": "Finlândia",
          "codigo": "+358",
          "btn": true
        },
        {
          "nome": "França",
          "codigo": "+33",
          "btn": true
        },
        {
          "nome": "Guiana Francesa",
          "codigo": "+594",
          "btn": true
        },
        {
          "nome": "Polinésia Francesa",
          "codigo": "+689",
          "btn": true
        },
        {
          "nome": "Terras Austrais e Antárticas Francesas",
          "codigo": "+33",
          "btn": true
        },
        {
          "nome": "Gabão",
          "codigo": "+241",
          "btn": true
        },
        {
          "nome": "Gâmbia",
          "codigo": "+220",
          "btn": true
        },
        {
          "nome": "Geórgia",
          "codigo": "+995",
          "btn": true
        },
        {
          "nome": "Alemanha",
          "codigo": "+49",
          "btn": true
        },
        {
          "nome": "Gana",
          "codigo": "+233",
          "btn": true
        },
        {
          "nome": "Gibraltar",
          "codigo": "+350",
          "btn": true
        },
        {
          "nome": "Grécia",
          "codigo": "+30",
          "btn": true
        },
        {
          "nome": "Groelândia",
          "codigo": "+299",
          "btn": true
        },
        {
          "nome": "Granada",
          "codigo": "+1473",
          "btn": true
        },
        {
          "nome": "Guadalupe",
          "codigo": "+590",
          "btn": true
        },
        {
          "nome": "Guão",
          "codigo": "+1671",
          "btn": true
        },
        {
          "nome": "Guatemala",
          "codigo": "+502",
          "btn": true
        },
        {
          "nome": "Guiné",
          "codigo": "+224",
          "btn": true
        },
        {
          "nome": "Guiné-Bissau",
          "codigo": "+245",
          "btn": true
        },
        {
          "nome": "Guiana",
          "codigo": "+592",
          "btn": true
        },
        {
          "nome": "Haiti",
          "codigo": "+509",
          "btn": true
        },
        {
          "nome": "Ilhas Heard e McDonald",
          "codigo": "+672",
          "btn": true
        },
        {
          "nome": "Vaticano",
          "codigo": "+39",
          "btn": true
        },
        {
          "nome": "Honduras",
          "codigo": "+504",
          "btn": true
        },
        {
          "nome": "Hong Kong",
          "codigo": "+852",
          "btn": true
        },
        {
          "nome": "Hungria",
          "codigo": "+36",
          "btn": true
        },
        {
          "nome": "Islândia",
          "codigo": "+354",
          "btn": true
        },
        {
          "nome": "Índia",
          "codigo": "+91",
          "btn": true
        },
        {
          "nome": "Indonésia",
          "codigo": "+62",
          "btn": true
        },
        {
          "nome": "Iran",
          "codigo": "+98",
          "btn": true
        },
        {
          "nome": "Iraque",
          "codigo": "+964",
          "btn": true
        },
        {
          "nome": "Irlanda",
          "codigo": "+353",
          "btn": true
        },
        {
          "nome": "Israel",
          "codigo": "+972",
          "btn": true
        },
        {
          "nome": "Italia",
          "codigo": "+39",
          "btn": true
        },
        {
          "nome": "Jamaica",
          "codigo": "+1876",
          "btn": true
        },
        {
          "nome": "Japão",
          "codigo": "+81",
          "btn": true
        },
        {
          "nome": "Jornânia",
          "codigo": "+962",
          "btn": true
        },
        {
          "nome": "Cazaquistão",
          "codigo": "+7",
          "btn": true
        },
        {
          "nome": "Quênia",
          "codigo": "+254",
          "btn": true
        },
        {
          "nome": "Kiribati",
          "codigo": "+686",
          "btn": true
        },
        {
          "nome": "Coreia do Norte",
          "codigo": "+850",
          "btn": true
        },
        {
          "nome": "Coreia do Sul",
          "codigo": "+82",
          "btn": true
        },
        {
          "nome": "Kuwait",
          "codigo": "+965",
          "btn": true
        },
        {
          "nome": "Quirguistão",
          "codigo": "+996",
          "btn": true
        },
        {
          "nome": "Laos",
          "codigo": "+856",
          "btn": true
        },
        {
          "nome": "Letônia",
          "codigo": "+371",
          "btn": true
        },
        {
          "nome": "Líbano",
          "codigo": "+961",
          "btn": true
        },
        {
          "nome": "Lesoto",
          "codigo": "+266",
          "btn": true
        },
        {
          "nome": "Libéria",
          "codigo": "+231",
          "btn": true
        },
        {
          "nome": "Líbia",
          "codigo": "+218",
          "btn": true
        },
        {
          "nome": "Liechtenstein",
          "codigo": "+423",
          "btn": true
        },
        {
          "nome": "Lituânia",
          "codigo": "+370",
          "btn": true
        },
        {
          "nome": "Luxemburgo",
          "codigo": "+352",
          "btn": true
        },
        {
          "nome": "Macao",
          "codigo": "+853",
          "btn": true
        },
        {
          "nome": "Macedônia",
          "codigo": "+389",
          "btn": true
        },
        {
          "nome": "Madagascar",
          "codigo": "+261",
          "btn": true
        },
        {
          "nome": "Malawi",
          "codigo": "+265",
          "btn": true
        },
        {
          "nome": "Malásia",
          "codigo": "+60",
          "btn": true
        },
        {
          "nome": "Maldivas",
          "codigo": "+960",
          "btn": true
        },
        {
          "nome": "Mali",
          "codigo": "+223",
          "btn": true
        },
        {
          "nome": "Malta",
          "codigo": "+356",
          "btn": true
        },
        {
          "nome": "Ilhas Marshall",
          "codigo": "+692",
          "btn": true
        },
        {
          "nome": "Martinica",
          "codigo": "+596",
          "btn": true
        },
        {
          "nome": "Mauritânia",
          "codigo": "+222",
          "btn": true
        },
        {
          "nome": "Maurício",
          "codigo": "+230",
          "btn": true
        },
        {
          "nome": "Mayotte",
          "codigo": "+269",
          "btn": true
        },
        {
          "nome": "México",
          "codigo": "+52",
          "btn": true
        },
        {
          "nome": "Micronésia",
          "codigo": "+691",
          "btn": true
        },
        {
          "nome": "Moldova",
          "codigo": "+373",
          "btn": true
        },
        {
          "nome": "Mônaco",
          "codigo": "+377",
          "btn": true
        },
        {
          "nome": "Mongólia",
          "codigo": "+976",
          "btn": true
        },
        {
          "nome": "Montserrat",
          "codigo": "+1664",
          "btn": true
        },
        {
          "nome": "Marrocos",
          "codigo": "+212",
          "btn": true
        },
        {
          "nome": "Moçambique",
          "codigo": "+258",
          "btn": true
        },
        {
          "nome": "Birmânia",
          "codigo": "+95",
          "btn": true
        },
        {
          "nome": "Namíbia",
          "codigo": "+264",
          "btn": true
        },
        {
          "nome": "Nauru",
          "codigo": "+674",
          "btn": true
        },
        {
          "nome": "Nepal",
          "codigo": "+977",
          "btn": true
        },
        {
          "nome": "Holanda",
          "codigo": "+31",
          "btn": true
        },
        {
          "nome": "Antilhas Holandesas",
          "codigo": "+599",
          "btn": true
        },
        {
          "nome": "Nova Caledônia",
          "codigo": "+687",
          "btn": true
        },
        {
          "nome": "Nova Zelândia",
          "codigo": "+64",
          "btn": true
        },
        {
          "nome": "Nicarágua",
          "codigo": "+505",
          "btn": true
        },
        {
          "nome": "Niger",
          "codigo": "+227",
          "btn": true
        },
        {
          "nome": "Nigéria",
          "codigo": "+234",
          "btn": true
        },
        {
          "nome": "Niue",
          "codigo": "+683",
          "btn": true
        },
        {
          "nome": "Ilha Norfolk",
          "codigo": "+672",
          "btn": true
        },
        {
          "nome": "Ilhas Marianas do Norte",
          "codigo": "+1670",
          "btn": true
        },
        {
          "nome": "Noruega",
          "codigo": "+47",
          "btn": true
        },
        {
          "nome": "Omã",
          "codigo": "+968",
          "btn": true
        },
        {
          "nome": "Paquistão",
          "codigo": "+92",
          "btn": true
        },
        {
          "nome": "Palau",
          "codigo": "+680",
          "btn": true
        },
        {
          "nome": "Palestina",
          "codigo": "+970",
          "btn": true
        },
        {
          "nome": "Panamá",
          "codigo": "+507",
          "btn": true
        },
        {
          "nome": "Papua-Nova Guiné",
          "codigo": "+675",
          "btn": true
        },
        {
          "nome": "Paraguai",
          "codigo": "+595",
          "btn": true
        },
        {
          "nome": "Peru",
          "codigo": "+51",
          "btn": true
        },
        {
          "nome": "Filipinas",
          "codigo": "+63",
          "btn": true
        },
        {
          "nome": "Ilhas Picárnia",
          "codigo": "+672",
          "btn": true
        },
        {
          "nome": "Polônia",
          "codigo": "+48",
          "btn": true
        },
        {
          "nome": "Portugal",
          "codigo": "+351",
          "btn": true
        },
        {
          "nome": "Porto Rico",
          "codigo": "+1787",
          "btn": true
        },
        {
          "nome": "Catar",
          "codigo": "+974",
          "btn": true
        },
        {
          "nome": "Reunião",
          "codigo": "+262",
          "btn": true
        },
        {
          "nome": "Romênia",
          "codigo": "+40",
          "btn": true
        },
        {
          "nome": "Rússia",
          "codigo": "+70",
          "btn": true
        },
        {
          "nome": "Ruanda",
          "codigo": "+250",
          "btn": true
        },
        {
          "nome": "Santa Helena",
          "codigo": "+290",
          "btn": true
        },
        {
          "nome": "São Cristóvão",
          "codigo": "+1869",
          "btn": true
        },
        {
          "nome": "Santa Lúcia",
          "codigo": "+1758",
          "btn": true
        },
        {
          "nome": "São Pedro e Miquelon",
          "codigo": "+508",
          "btn": true
        },
        {
          "nome": "São Vicente e Granadinas",
          "codigo": "+1784",
          "btn": true
        },
        {
          "nome": "Samoa",
          "codigo": "+684",
          "btn": true
        },
        {
          "nome": "São Marino",
          "codigo": "+378",
          "btn": true
        },
        {
          "nome": "Sao Tomé e Príncipe",
          "codigo": "+239",
          "btn": true
        },
        {
          "nome": "Arábia Saudita",
          "codigo": "+966",
          "btn": true
        },
        {
          "nome": "Senegal",
          "codigo": "+221",
          "btn": true
        },
        {
          "nome": "Sérvia e Montenegro",
          "codigo": "+381",
          "btn": true
        },
        {
          "nome": "Seicheles",
          "codigo": "+248",
          "btn": true
        },
        {
          "nome": "República da Serra Leoa",
          "codigo": "+232",
          "btn": true
        },
        {
          "nome": "Singapura",
          "codigo": "+65",
          "btn": true
        },
        {
          "nome": "Eslováquia",
          "codigo": "+421",
          "btn": true
        },
        {
          "nome": "Eslovênia",
          "codigo": "+386",
          "btn": true
        },
        {
          "nome": "Ilhas Salomão",
          "codigo": "+677",
          "btn": true
        },
        {
          "nome": "Somália",
          "codigo": "+252",
          "btn": true
        },
        {
          "nome": "África do Sul",
          "codigo": "+27",
          "btn": true
        },
        {
          "nome": "Ilhas Geórgia do Sul e Sandwich do Sul",
          "codigo": "+500",
          "btn": true
        },
        {
          "nome": "Espanha",
          "codigo": "+34",
          "btn": true
        },
        {
          "nome": "Sri Lanka",
          "codigo": "+94",
          "btn": true
        },
        {
          "nome": "Sudão",
          "codigo": "+249",
          "btn": true
        },
        {
          "nome": "Suriname",
          "codigo": "+597",
          "btn": true
        },
        {
          "nome": "Esvalbarde",
          "codigo": "+47",
          "btn": true
        },
        {
          "nome": "Suazilândia",
          "codigo": "+268",
          "btn": true
        },
        {
          "nome": "Suécia",
          "codigo": "+46",
          "btn": true
        },
        {
          "nome": "Suiça",
          "codigo": "+41",
          "btn": true
        },
        {
          "nome": "Síria",
          "codigo": "+963",
          "btn": true
        },
        {
          "nome": "Taiwan",
          "codigo": "+886",
          "btn": true
        },
        {
          "nome": "Tajiquistão",
          "codigo": "+992",
          "btn": true
        },
        {
          "nome": "Tanzânia",
          "codigo": "+255",
          "btn": true
        },
        {
          "nome": "Tailândia",
          "codigo": "+66",
          "btn": true
        },
        {
          "nome": "Timor-Leste",
          "codigo": "+670",
          "btn": true
        },
        {
          "nome": "Togo",
          "codigo": "+228",
          "btn": true
        },
        {
          "nome": "Toquelau",
          "codigo": "+690",
          "btn": true
        },
        {
          "nome": "Tonga",
          "codigo": "+676",
          "btn": true
        },
        {
          "nome": "Trinidad e Tobago",
          "codigo": "+1868",
          "btn": true
        },
        {
          "nome": "Tunísia",
          "codigo": "+216",
          "btn": true
        },
        {
          "nome": "Turquia",
          "codigo": "+90",
          "btn": true
        },
        {
          "nome": "Turcomenistão",
          "codigo": "+7370",
          "btn": true
        },
        {
          "nome": "Ilhas Turks e Caicos",
          "codigo": "+1649",
          "btn": true
        },
        {
          "nome": "Tuvalu",
          "codigo": "+688",
          "btn": true
        },
        {
          "nome": "Uganda",
          "codigo": "+256",
          "btn": true
        },
        {
          "nome": "Ucrânia",
          "codigo": "+380",
          "btn": true
        },
        {
          "nome": "Emirados Árabes",
          "codigo": "+971",
          "btn": true
        },
        {
          "nome": "Reino Unido",
          "codigo": "+44",
          "btn": true
        },
        {
          "nome": "Uruguai",
          "codigo": "+598",
          "btn": true
        },
        {
          "nome": "Uzbequistão",
          "codigo": "+998",
          "btn": true
        },
        {
          "nome": "Vanuatu",
          "codigo": "+678",
          "btn": true
        },
        {
          "nome": "Venezuela",
          "codigo": "+58",
          "btn": true
        },
        {
          "nome": "Vietnam",
          "codigo": "+84",
          "btn": true
        },
        {
          "nome": "Ilhas Virgens Inglesas",
          "codigo": "+1284",
          "btn": true
        },
        {
          "nome": "Ilhas Virgens (USA)",
          "codigo": "+1340",
          "btn": true
        },
        {
          "nome": "Wallis e Futuna",
          "codigo": "+681",
          "btn": true
        },
        {
          "nome": "Saara Ocidental",
          "codigo": "+212",
          "btn": true
        },
        {
          "nome": "Iêmen",
          "codigo": "+967",
          "btn": true
        },
        {
          "nome": "Zâmbia",
          "codigo": "+260",
          "btn": true
        },
        {
          "nome": "Zimbábue",
          "codigo": "+263",
          "btn": true
        }
      ],
      celular: '',
      entrando: false,
      error: false,
      errorMessage: '',
      codigoDeConfirmação: '',
    }
  },
  computed: {
    GET_CELULAR_PERFIL () {
      return this.$store.getters.GET_CELULAR_PERFIL
    },
    GET_USERS () {
      return this.$store.getters.GET_USERS
    },
    GET_FULL_PERFIL () {
      return this.$store.getters.GET_FULL_PERFIL
    }
  },
  methods: {
    //passo 0
    logadoOuN() {
      auth.onAuthStateChanged(user => {
        if(user) {
          var usuarioUid = sessionStorage.usuarioUid
          this.pegaNumeroDeCelular(usuarioUid)
        }else {
          this.$router.push('/login')
        }
      })
    },
    //passo 1
    pegaNumeroDeCelular(usuarioUid) {
      var query = db.ref('usuarios/'+ usuarioUid + '/celular')
      query.on('value', (snapshot) => {
        const numero = snapshot.val()
        this.celular = numero
        this.selecionaPaisDialog = true
      })
    },
    //passo 1.1
    confirmaPais() {
      const numeroCelular = this.celular
      const codigoPais = this.pais.codigo
      const numeroPego = `${codigoPais}${numeroCelular}`
      this.celular = numeroPego
      this.selecionaPaisDialog = false
      this.logarViaCelular(numeroPego)
    },
    //passo 2
    logarViaCelular (numeroPego) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('firebaseui-auth-container', {
        'size': 'invisible'
      })
      var appVerifier = window.recaptchaVerifier
      auth.signInWithPhoneNumber(numeroPego, appVerifier)
        .then(
          confirmationResult => window.confirmationResult = confirmationResult 
        ).catch(
          error => {
            this.error = true,
            this.errorMessage = error.message
          }
        )
    },
    //passo 3
    loginNumber () {
      this.entrando = true
      window.confirmationResult.confirm(this.codigoDeConfirmação)
        .then(result => {
          var e = this.$store.getters.E
          var s = this.$store.getters.S
          auth.signInWithEmailAndPassword(e, s).then(
            us => {
              if(us) {
                this.$router.push('/home')
              }
            }
          )
        })
        .catch(error => {
          this.erro = true
          this.entrando = true
          this.errorMessage = error.message
        })   
    }
  },
  mounted () {
    this.logadoOuN()
    //this.getInfos()
    /*var self = this
    var uiConfig = {
        signInSuccessUrl: '/middle',
        signInOptions: [

          {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            defaultCountry: 'BR',
            defaultNationalNumber: this.telefone,
            loginHint: `+55${this.telefone}`
          }
        ]
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
      */
  }
}
</script>


<style>
  .loginForm2 {
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    opacity: 0.9;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
</style>
