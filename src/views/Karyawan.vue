<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      
      <v-card>
        <h1 class="text-center">Karyawan</h1>
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
        <v-data-table :headers="headers" :items="karyawans" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <div
            v-if="item.hapus==1">
              <v-btn small class="mr-2" @click="editHandler(item) "> Detail </v-btn>
            </div>
            <v-switch small @click="deleteHandler(item)"
            inset
            value
            :input-value="item.hapus"> delete </v-switch>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <h1>Karyawan</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="form.nama_karyawan"
                label="Nama Karyawan"
                required
              >
              </v-text-field>

              <v-text-field
                v-model="form.no_telepon"
                label="Nomor Telepon"
                required
              >
              </v-text-field>

              <v-select
                v-model="form.jabatan"
                label="Jabatan"
                :items="jabatan"
                required
              >
              </v-select>

              <v-text-field
                v-model="form.email_karyawan"
                label="Email"
                required
              >
              </v-text-field>

              <v-text-field v-show="!status" v-model="form.password" label="Password" required>
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
  name: "karyawan",
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
      jabatan: ["Manager", "Kasir", "Waiter", "Chef"],

      headers: [
        {
          text: "Nama Karyawan",
          align: "start",
          sortable: true,
          value: "nama_karyawan",
        },
        { text: "Nomor Telepon", value: "no_telepon" },
        { text: "Jabatan", value: "jabatan" },
        { text: "Email", value: "email_karyawan" },
        { text: '', value: 'actions'},
      ],

      karyawan: new FormData(),
      karyawans: [],
      form: {
        nama_karyawan: null,
        no_telepon: null,
        jabatan: null,
        email_karyawan: null,
        password: null,
      },
      deleteId: "",
      editId: "",
    };
  },

  watch:{
    dialog(val) {
      val || this.close()
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
      var url = this.$api + "/karyawan/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.karyawans = response.data.data;
        });
    },

    save() {
      this.karyawan.append("nama_karyawan", this.form.nama_karyawan);
      this.karyawan.append("no_telepon", this.form.no_telepon);
      this.karyawan.append("jabatan", this.form.jabatan);
      this.karyawan.append("email_karyawan", this.form.email_karyawan);
      this.karyawan.append("password", this.form.password);
      var url = this.$api + "/karyawan/tambah/";
      this.load = true;
      this.$http
        .post(url, this.karyawan, {
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
        nama_karyawan: this.form.nama_karyawan,
        no_telepon: this.form.no_telepon,
        jabatan: this.form.jabatan,
        email_karyawan: this.form.email_karyawan,
      };
      var url = this.$api + "/karyawan/update/" + this.editId;
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
    aktifData() {
      //menghapus data
      var url = this.$api + "/karyawan/aktif/" + this.deleteId;
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
      this.form.nama_karyawan = item.nama_karyawan;
      this.form.no_telepon = item.no_telepon;
      this.form.jabatan = item.jabatan;
      this.form.email_karyawan = item.email_karyawan;
      this.dialog = true;
      this.status = true;
    },
    deleteHandler(item) {
      this.deleteId = item.id;
      if(item.hapus == 1){
        this.deleteData();
      }
      else{
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
        nama_karyawan: null,
        no_telepon: null,
        jabatan: null,
        email_karyawan: null,
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