<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      <v-card>
        <h1 class="text-center">Reservasi</h1>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table :headers="headers" :items="reservasis" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editReservasi(item)">
              Detail Reservasi
            </v-btn>
            <v-btn small class="mr-2" @click="deleteHandler(item.id)">
              Delete
            </v-btn>
            <v-btn small class="mr-2" @click="printqrHandler(item)"> Print QR </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="print" persistent max-width="800px">
        <v-card>
          <v-card-title justify="center">
            <h1 class="text-center">Scan Disini</h1>
          </v-card-title>
          <qr-code class="justify-center" :text="idreservasi.toString()" size="300" error-level="L">
          </qr-code>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-orange" text @click="cancel">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <h1>Reservasi</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-autocomplete
                :items="array_meja"
                item-text="id"
                item-value="id"
                v-model="form.meja"
                label="Meja"
                required
              >
              </v-autocomplete>

              <v-text-field
                type="time"
                v-model="form.sesi"
                label="Sesi jam"
                required
              >
              </v-text-field>

              <v-text-field
                type="date"
                v-model="form.tanggal"
                label="Tanggal"
                required
              >
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
      <v-dialog v-model="dialogreservasi" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <h1 class="text-center">Reservasi</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="form.nama_pelanggan"
                label="Nama Pelanggan"
                disabled
              >
              </v-text-field>

              <v-text-field
                v-model="form.no_pelanggan"
                label="Nomor Telepon"
                disabled
              >
              </v-text-field>

              <v-text-field
                v-model="form.email_pelanggan"
                label="Email"
                disabled
              >
              </v-text-field>
              <v-autocomplete
                :items="array_meja"
                item-text="id"
                item-value="id"
                v-model="form.meja"
                label="Meja"
                required
              >
              </v-autocomplete>

              <v-text-field
                type="time"
                v-model="form.sesi"
                label="Sesi jam"
                required
              >
              </v-text-field>

              <v-text-field
                type="date"
                v-model="form.tanggal"
                label="Tanggal"
                required
              >
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
      print: false,
      dialogreservasi: false,
      idreservasi: -1,
      status: false,
      dialogConfirm: false,
      array_meja: [],
      headers: [
        {
          text: "Nama Pelanggan",
          align: "start",
          sortable: true,
          value: "nama_pelanggan",
        },
        { text: "Meja", value: "id_meja" },
        { text: "Sesi", value: "sesi" },
        { text: "Tanggal", value: "tanggal" },
        { text: "", value: "actions" },
      ],

      reservasi: new FormData(),
      reservasis: [],
      pelanggans: [],

      form: {
        meja: null,
        sesi: null,
        tanggal: null,
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
          console.log(this.reservasis);
        });
    },

    save() {
      this.reservasi.append("id_meja", this.form.meja);
      this.reservasi.append("sesi", this.form.sesi);
      this.reservasi.append("tanggal", this.form.tanggal);
      var url = this.$api + "/reservasi/tambah/";
      this.load = true;
      this.$http
        .post(url, this.reservasi, {
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
          this.readReservasi();
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
    editReservasi(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_pelanggan = item.nama_pelanggan;
      this.form.no_pelanggan = item.no_pelanggan;
      this.form.email_pelanggan = item.email_pelanggan;
      this.form.meja = item.meja;
      this.form.tanggal = item.tanggal;
      this.form.sesi = item.sesi;
      this.dialogreservasi = true;
    },
    //update
    update() {
      let newData = {
        id_meja: this.form.meja,
        sesi: this.form.sesi,
        tanggal: this.form.tanggal,
      };
      var url = this.$api + "/reservasi/update/" + this.editId;
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
          this.readReservasi();
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
    deleteData() {
      //menghapus data
      var url = this.$api + "/reservasi/hapus/" + this.deleteId;
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
          this.readReservasi(); //mengambil data
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
    printqrHandler(item) {
      this.print = true;
      this.idreservasi = item.id;
      console.log(this.idreservasi);
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
      this.deleteId = item;
      this.deleteData();
    },

    close() {
      this.dialogreservasi = false;
      this.inputType = "Tambah";
      this.status = false;
      this.form = {};
    },

    cancel() {
      this.dialog = false;
      this.dialogreservasi = false;
      this.print = false;
      this.resetForm = {
        meja: null,
        tanggal: null,
        sesi: null,
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readReservasi();
    this.getMeja();
  },
};
</script>