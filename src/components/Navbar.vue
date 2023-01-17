<template>
<div>
  <v-card >
    <v-app-bar
      color="white"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="green"></v-app-bar-nav-icon>

      <v-toolbar-title class="d-flex justify-center" >Atma BBQ</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon color="green">mdi-account</v-icon>
      </v-btn>

    </v-app-bar>
  </v-card>
  <v-navigation-drawer
      v-model="drawer"
      app
      RGB="#FF8C00"

    >
      <v-list-item
      nav
      dense
      >
        <v-list-item-avatar>
          <v-img src="../assets/logo.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Atma BBQ</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      <v-list-group
        :value="false"
        prepend-icon="mdi-cog"
        color="grey--text"
        
      >
        <template v-slot:activator>
          <v-list-item-title>Kelola</v-list-item-title>
        </template>

        <v-list-item
          v-for="item in admins"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item
          v-for="item in about"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>
    </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout" block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-spacer></v-spacer>

    <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
    </v-main>
  </div>
</template>

<script>
  export default {
    data: () => ({
      drawer: false,
      group: null,
      show: true,
      items: [
          {path: '/', title: 'Home', icon: 'mdi-home' },
          {path: '/pelanggan', title: 'Pelanggan', icon: 'mdi-account' },
          {path: '/reservasi', title: 'Reservasi', icon: 'mdi-book-open-blank-variant' },
          {path: '/meja', title: 'Meja', icon: 'mdi-table' },
          {path: '/pesanan', title: 'Pesanan', icon: 'mdi-food' },
          {path: '/detailpesanan', title: 'DetailPesanan', icon: 'mdi-clipboard-text' },
          
        ],
      admins: [
        {path: '/karyawan', title: 'Karyawan', icon: 'mdi-account-multiple' },
        {path: '/menuedit', title: 'Menu', icon: 'mdi-food' },
        {path: '/bahan', title: 'Bahan', icon: 'mdi-food-steak' },
        {path: '/stokmasuk', title: 'Stok Masuk', icon: 'mdi-format-list-numbered' },
        {path: '/stokkeluar', title: 'Stok Keluar', icon: 'mdi-format-list-numbered' },
        {path: '/laporan', title: 'Laporan', icon: 'mdi-format-list-numbered' },
      ],
      about: [
        {path: '/about', title: 'About', icon: 'mdi-help-circle' },
      ],
    }),

    watch: {
      group () {
        this.drawer = false
      },
    },
    methods: {
      logout() {
      localStorage.clear()
      delete this.$http.defaults.headers.common["Authorization"];
      this.$router.push({
        path: "/login",
      });
    },
    }
  }
</script>