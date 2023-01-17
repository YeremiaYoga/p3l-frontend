<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      <v-card>
        <h1 class="text-center">Pelanggan</h1>
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
        <v-data-table :headers="headers" :items="pelanggans" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandler(item)">
              Detail
            </v-btn>
            <v-btn small class="mr-2" @click="reservasiHandler(item)">
              Reservasi
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <h1>Pelanggan</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="form.nama_pelanggan"
                label="Nama Pelanggan"
                required
              >
              </v-text-field>

              <v-text-field
                v-model="form.no_pelanggan"
                label="Nomor Telepon"
                required
              >
              </v-text-field>

              <v-text-field
                v-model="form.email_pelanggan"
                label="Email"
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
            <v-btn color="deep-orange" text @click="saveReservasi()">Save</v-btn>
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
      array_meja: [],
      headers: [

        {
          text: "Nama Pelanggan",
          align: "start",
          sortable: true,
          value: "nama_pelanggan",
        },
        { text: "Nomor Telepon", value: "no_pelanggan" },
        { text: "Email", value: "email_pelanggan" },
        { text: "Id", value: "id"},
        { text: "", value: "actions" },
      ],
      pelanggan: new FormData(),
      reservasi: new FormData(),
      reservasis: [],
      pelanggans: [],

      form: {
        nama_pelanggan: null,
        no_pelanggan: null,
        email_pelanggan: null,
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
    readData() {
      var url = this.$api + "/pelanggan/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pelanggans = response.data.data;
        });
    },
    readReservasi(){
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
      this.pelanggan.append("nama_pelanggan", this.form.nama_pelanggan);
      this.pelanggan.append("no_pelanggan", this.form.no_pelanggan);
      this.pelanggan.append("email_pelanggan", this.form.email_pelanggan);
      var url = this.$api + "/pelanggan/tambah/";
      this.load = true;
      this.$http
        .post(url, this.pelanggan, {
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
    saveReservasi() {
      this.reservasi.append("id_pelanggan", this.id_pelanggan);
      this.reservasi.append("id_karyawan", localStorage.getItem("id"));
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
      this.form.meja = item.meja;
      this.form.tanggal = item.tanggal;
      this.form.sesi = item.sesi;
      this.dialogreservasi = true;
    },
    
    reservasiHandler(item){
      console.table(item);
      this.dialogreservasi = true;
      this.id_pelanggan = item.id;
      
    },
    
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