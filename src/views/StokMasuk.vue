<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      <v-card>
        <h1 class="text-center">Stok Masuk</h1>
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
        <v-data-table :headers="headers" :items="stokmasuks" :search="search">
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <h1>Stok Masuk</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-select
                    v-model="choosenMenu"
                    :items="bahans"
                    item-value="id"
                    item-text="nama_bahan"
                    return-object
                    label="Untuk Menu"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Jumlah Bahan"
                    v-model="form.jumlah_masuk"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="form.harga_bahan"
                    outlined
                    label="Harga Bahan"
                  />
                </v-col>
              </v-row>
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
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "pelanggan",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogreservasi: false,
      status: false,
      dialogConfirm: false,
      id_pelanggan: null,
      choosenMenu:null,
      array_meja: [],
      headers: [
        {
          text: "ID Bahan",
          align: "start",
          sortable: true,
          value: "id_bahan",
        },
        { text: "Nama Bahan", value: "nama_bahan" },
        { text: "Jumlah Masuk", value: "jumlah_masuk" },
        { text: "Harga Bahan", value: "harga_bahan" },
        { text: "", value: "actions" },
      ],
      stokmasuk: new FormData(),
      stokmasuks: [],
      bahans:[],

      form: {
        jumlah_masuk: null,
        harga_bahan: null,
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
      var url = this.$api + "/stokmasuk/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.stokmasuks = response.data.data;
        });
    },

    save() {
      this.stokmasuk.append("jumlah_masuk", this.form.jumlah_masuk);
      this.stokmasuk.append("harga_bahan", this.form.harga_bahan);
      this.stokmasuk.append("id_bahan", this.choosenMenu.id_bahan);
      var url = this.$api + "/stokmasuk/tambah/";
      this.load = true;
      this.$http
        .post(url, this.stokmasuk, {
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

    getMeja() {
      var url = this.$api + "/meja/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.array_meja = response.data.data;
          console.log(this.array_meja);
        });
    },

    //hapus
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
      this.dialogreservasi = false;
      this.inputType = "Tambah";
      this.status = false;
      this.form = {};
    },

    cancel() {
      this.dialog = false;
      this.dialogreservasi = false;
      this.resetForm = {
        nama_pelanggan: null,
        no_pelanggan: null,
        email_pelanggan: null,
        meja: null,
        tanggal: null,
        sesi: null,
      };
    },
  },
  async created() {
    try {
      const url = this.$api + "/bahan/tampil/";
      const res = await this.$http.get(url, {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("token"),
        },
      });

      this.bahans = res.data.data.map((x) => {
        const { id, nama_bahan } = { ...x };

        return { id_bahan: id, nama_bahan };
      });
      console.log(this.bahans);
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.getMeja();
  },
};
</script>