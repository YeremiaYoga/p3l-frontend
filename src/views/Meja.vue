<template>
  <v-container>
    <v-card class="mb-10">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="save()"> Tambah </v-btn>
      </v-card-title>
    </v-card>
    <div class="row align-center" margin-top="100px">
      <div
        :key="item.id"
        v-for="item in array_meja"
        class="col-md-3 col-sm-6 col-xs-12"
      >
        <v-card v-if="item.status == 0" width="300px" class="justify-center">
          <p class="text-center">{{ item.id }}</p>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-btn color="orange lighten-2" text @click="printqrHandler(item)">
              Detail
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn color="red" text @click="printqrHandler(item)">
              Bayar
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>
<script>
export default {
  name: "meja",
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
      array_meja: [],
      reservasis: [],

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
      var url = this.$api + "/meja/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.array_meja = response.data.data;
        });
    },

    readReservasi() {
      var url = this.$api + "/reservasi/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.reservasis = response.data.data;
        });
    },

    save() {
      var url = this.$api + "/meja/tambah/";
      this.load = true;
      this.$http
        .post(url, {
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
        nama_pelanggan: this.form.nama_pelanggan,
        no_pelanggan: this.form.no_pelanggan,
        email_pelanggan: this.form.email_pelanggan,
      };
      var url = this.$api + "/pelanggan/update/" + this.editId;
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
      var url = this.$api + "/karyawan/hapus/" + this.deleteId;
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
      this.form.nama_pelanggan = item.nama_pelanggan;
      this.form.no_pelanggan = item.no_pelanggan;
      this.form.email_pelanggan = item.email_pelanggan;
      this.dialog = true;
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
        nama_pelanggan: null,
        no_pelanggan: null,
        email_pelanggan: null,
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>