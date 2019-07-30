import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Login2 from './views/Login2.vue'
import Cadastro from './views/Cadastro.vue'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'
import HomePublic from './views/HomePublic.vue'
import AdicionarFundos from './components/Home/AdicionarFundos.vue'
import Tickets from './components/Home/Tickets.vue'
import Dashboard from './components/Home/Dashboard.vue'
import MeuPerfil from './components/Home/MeuPerfil.vue'
import MinhasTransacoes from './components/Home/QueroSolicitarPagamento.vue'
import MinhasCotas from './components/Home/MinhasCotas.vue'
import DashboardAdmin from './components/Admin/DashboardAdmin.vue'
import TicketsAdmin from './components/Admin/TicketsAdmin.vue'
import Clientes from './components/Admin/Clientes.vue'
import AdicaoDeCotas from './components/Admin/SolicitacoesAdicaoDeCotas.vue'
import FormasDePagamento from './components/Admin/FormasDePagamento.vue'
import SolicitacoesPagamento from './components/Admin/SolicitacoesPagamento.vue'
import middle from './services/middle.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'homepublic',
      component: HomePublic
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/login2',
      name: 'login2',
      component: Login2
    },
    {
      path: '/middle',
      name: 'middle',
      component: middle
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path:'/home/adicionarfundos',
          name: 'adicionarfundos',
          component: AdicionarFundos
        },
        {
          path:'/home/tickets',
          name: 'tickets',
          component: Tickets
        },
        {
          path:'/home/minhascotas',
          name: 'cotas',
          component: MinhasCotas
        },
        {
          path:'/home/dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path:'/home/meuperfil',
          name: 'meu-perfil',
          component: MeuPerfil
        },
        {
          path:'/home/querosolicitarpagamento',
          name: 'Minhas Transações',
          component: MinhasTransacoes
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {
          path:'/admin/dashboard',
          name: 'dashboardadmin',
          component: DashboardAdmin
        },
        {
          path:'/admin/tickets',
          name: 'ticketsadmin',
          component: TicketsAdmin
        },
        {
          path:'/admin/clientes',
          name: 'clientes',
          component: Clientes
        },
        {
          path:'/admin/solitacoesdepagamento',
          name: 'solicitacoesdepagamento',
          component: SolicitacoesPagamento
        },
        {
          path:'/admin/solicitacoesadicaodecotas',
          name: 'solicitacoesadicaodecotas',
          component: AdicaoDeCotas
        },
        {
          path:'/admin/formasdepagamento',
          name: 'formasdepagamento',
          component: FormasDePagamento
        },
      ]
    },
    {
      path: '/cadastro/:id',
      name: 'cadastro',
      component: Cadastro,
      props: true
    }
  ]
})
