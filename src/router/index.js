import Vue from 'vue'
import VueRouter from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Pelanggan from '../views/Pelanggan.vue'
import Reservasi from '../views/Reservasi.vue'
import Meja from '../views/Meja.vue'
import Menu from '../views/Menu.vue'
import Pesanan from '../views/Pesanan.vue'
import DetailPesanan from '../views/DetailPesanan.vue'
import MenuEdit from '../views/MenuEdit.vue'
import Karyawan from '../views/Karyawan.vue'
import Bahan from '../views/Bahan.vue'
import Laporan from '../views/Laporan.vue'
import StokMasuk from '../views/StokMasuk.vue'
import StokKeluar from '../views/StokKeluar.vue'
import About from '../views/About.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Navbar,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/pelanggan',
        name: 'pelanggan',
        component: Pelanggan,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/reservasi',
        name: 'reservasi',
        component: Reservasi,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/meja',
        name: 'meja',
        component: Meja,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/about',
        name: 'about',
        component: About,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/pesanan',
        name: 'pesanan',
        component: Pesanan,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/detailpesanan',
        name: 'detailpesanan',
        component: DetailPesanan,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: Menu,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/menuedit',
        name: 'menuedit',
        component: MenuEdit,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/karyawan',
        name: 'karyawan',
        component: Karyawan,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/bahan',
        name: 'bahan',
        component: Bahan,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/laporan',
        name: 'laporan',
        component: Laporan,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/stokmasuk',
        name: 'stokmasuk',
        component: StokMasuk,
        meta : {
          requiresAuth : true
        }
      },
      {
        path: '/stokkeluar',
        name: 'stokkeluar',
        component: StokKeluar,
        meta : {
          requiresAuth : true
        }
      },
      
      


    ],
    

  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta : {
      requiresAuth : false
    }
  },
  {
    path:'',
    redirect: '/login'
  }
  

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (!token && to.meta.requiresAuth)  next('/login')
  else next()
})
export default router