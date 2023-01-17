<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      <v-container>
        <h1 class="text-center">Menu</h1>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="menus" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <div v-if="item.hapus == 1">
              <v-btn small class="mr-2" @click="editHandler(item)">
                Detail
              </v-btn>
            </div>
            <v-btn small @click="deleteHandler(item)"> delete </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" persistent max-width="800px">
          <v-card>
            <v-card-title>
              <h1>Menu</h1>
            </v-card-title>
            <v-card-text>
              <v-container>
                <!-- <v-img width="400px" :src="url" />
                <v-file-input
                  class="text-center"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an avatar"
                  prepend-icon="mdi-camera"
                  label="Foto"
                  v-model="form.gambar"
                ></v-file-input> -->
                <v-text-field
                  v-model="form.nama_menu"
                  label="Nama Menu"
                  required
                >
                </v-text-field>
                <v-text-field
                  v-model="form.deskripsi_menu"
                  label="Deskripsi"
                  required
                >
                </v-text-field>
                <v-select
                  v-model="form.kategori"
                  label="Kategori"
                  :items="kategori"
                  required
                >
                </v-select>
                <v-text-field v-model="form.harga" label="Harga" required>
                </v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="deep-orange" text @click="cancel">Cancel</v-btn>
              <v-btn color="deep-orange" text @click="setForm">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{
          error_message
        }}</v-snackbar>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "menu",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      status: false,
      dialogConfirm: false,
      kategori: ["Makanan", "Sidedish", "Minuman"],

      headers: [
        {
          text: "Nama Menu",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },
        { text: "Keterangan", value: "deskripsi_menu" },
        { text: "Kategori", value: "kategori" },
        { text: "Harga", value: "harga" },
        { text: "", value: "actions" },
      ],

      menu: new FormData(),
      menus: [],
      form: {
        nama_menu: null,
        deskripsi_menu: null,
        kategori: null,
        harga: null,
        //gambar: null,
      },
      deleteId: "",
      editId: "",
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data
    readData() {
      var url = this.$api + "/menu/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.menus = response.data.data;
        });
    },

    save() {
      this.menu.append("nama_menu", this.form.nama_menu);
      this.menu.append("deskripsi_menu", this.form.deskripsi_menu);
      this.menu.append("kategori", this.form.kategori);
      this.menu.append("harga", this.form.harga);
      //this.menu.append("gambar", this.form.gambar);
      var url = this.$api + "/menu/tambah/";
      this.load = true;
      this.$http
        .post(url, this.menu, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response);
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          (this.load = false), this.close();
          this.readData();
          this.resetForm();
        })
        .catch((error) => {
          console.log(error);
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    //update
    update() {
      let newData = {
        nama_menu: this.form.nama_menu,
        deskripsi_menu: this.form.deskripsi_menu,
        kategori: this.form.kategori,
        harga: this.form.harga,
        //gambar: this.form.gambar,
      };
      console.table(newData);
      var url = this.$api + "/menu/update/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    //hapus
    deleteData() {
      //menghapus data
      var url = this.$api + "/menu/hapus/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetFrom();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_menu = item.nama_menu;
      this.form.deskripsi_menu = item.deskripsi_menu;
      this.form.kategori = item.kategori;
      this.form.harga = item.harga;
      //this.form.gambar = item.gambar;
      this.dialog = true;
      this.status = true;
    },
    deleteHandler(item) {
      this.deleteId = item.id;
      if (item.hapus == 1) {
        this.deleteData();
      } else {
        this.aktifData();
      }
      this.dialogConfirm = true;
    },

    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.status = false;
      this.form = {};
    },

    cancel() {
      this.dialog = false;
      this.resetForm = {
        nama_menu: null,
        deskripsi_menu: null,
        kategori: null,
        harga: null,
        //gambar: null,
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
    url() {
      if (!this.form.gambar) return;
      return URL.createObjectURL(this.form.gambar);
    },
  },
  mounted() {
    this.readData();
  },
};
</script>