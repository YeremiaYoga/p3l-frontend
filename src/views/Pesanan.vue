<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      <v-card>
        <h1 class="text-center">Pesanan</h1>
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
        <v-data-table :headers="headers" :items="pesanans" :search="search">
          <template v-slot:[`item.status`]="{ item }">
            <v-btn
              rounded
              v-if="item.hapus == 1"
              color="red"
              small
              class="mr-2 white--text"
            >
              Menunggu
            </v-btn>
            <v-btn
              rounded
              v-if="item.hapus == 0"
              color="green"
              small
              class="mr-2 white--text"
            >
              Selesai
            </v-btn>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandler(item)">
              Detail Pesanan
            </v-btn>
            <v-btn
              small
              v-if="item.hapus == 1"
              class="mr-2"
              @click="deleteHandler(item)"
            >
              Selesai
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="800px">
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
  name: "pesanan",
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
      headers: [
        {
          text: "No Reservasi",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Total Pesanan", value: "total_jumlah" },
        { text: "Jumlah Pesanan", value: "total_pesanan" },
        { text: "Status", value: "status" },
        { text: "", value: "actions" },
      ],

      pesanan: new FormData(),
      pesanans: [],
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
    readPesanan() {
      var url = this.$api + "/pesanan/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanans = response.data.data;
          console.log(this.pesanans);
        });
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
      var url = this.$api + "/pesanan/hapus/" + this.deleteId;
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
          this.readPesanan(); //mengambil data
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
      this.form.meja = item.meja;
      this.form.tanggal = item.tanggal;
      this.form.sesi = item.sesi;
      this.dialog = true;
    },
    deleteHandler({ id }) {
      this.deleteId = id;
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
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readPesanan();
    this.getMeja();
  },
};
</script>