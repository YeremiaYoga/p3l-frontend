<template>
<v-container class="my4 md5">
  <v-card class="justify-center">
    <v-toolbar-title class="text-center" color="green">Selamat Datang</v-toolbar-title>
      <v-card-actions>
        <v-btn 
          color="orange accent-4"
          text
          >
          Explore
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
        icon
        @click="show = !show"
        >
          <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>
        <v-expand-transition>
          <div v-show="show">
          <v-divider></v-divider>

            <v-card-text>
              Selamat datang pelanggan 
            </v-card-text>
          </div>
        </v-expand-transition>
  </v-card>
</v-container>
 
</template>

<script>
  export default {
    data: () => ({
      show: false,
    }),
  }
</script>