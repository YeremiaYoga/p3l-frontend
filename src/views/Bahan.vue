<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      <v-card>
        <h1 class="text-center">Bahan</h1>
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
        <v-data-table :headers="headers" :items="listBahan" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <div v-if="item.hapus == 1">
              <v-btn small class="mr-2" @click="editHandler(item)">
                Detail
              </v-btn>
            </div>
            <v-switch
              small
              @click="deleteHandler(item)"
              inset
              value
              input-value="true"
            >
              delete
            </v-switch>
          </template>
          <template v-slot:[`item.ukuran`]="{ item }">
            <span>{{ `${item.ukuran_penyajian} ${item.unit}` }}</span>
          </template>
          <template v-slot:[`item.jumlah`]="{ item }">
            <span>{{ `${item.jumlah_bahan} ${item.unit}` }}</span>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <h1>Bahan</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Nama bahaN"
                    v-model="form.nama_bahan"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="form.ukuran_penyajian"
                    outlined
                    label="Ukuran Penyajian"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="form.unit"
                    outlined
                    label="Unit Bahan"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    v-model="choosenMenu"
                    :items="listMenu"
                    item-value="id"
                    item-text="nama_menu"
                    return-object
                    label="Untuk Menu"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-text-field
                  label="Jumlah Bahan"
                  v-model="form.jumlah_bahan"
                  outlined
                />
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
      headers: [
        {
          text: "ID Bahan",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Nama Bahan", value: "nama_bahan" },
        { text: "Stock Tersisa", value: "jumlah" },
        { text: "Ukuran Penyajian", value: "ukuran" },
        { text: "Untuk Menu", value: "nama_menu" },
        { text: "", value: "actions" },
      ],

      bahan: new FormData(),
      listBahan: [],
      listMenu: [],
      choosenMenu: null,
      form: {
        nama_bahan: null,
        jumlah_bahan: null,
        ukuran_penyajian: null,
        unit: null,
        id_menu: null,
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
      var url = this.$api + "/bahan/tampil/";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.listBahan = response.data.data;
        });
    },

    save() {
      this.bahan.append("nama_bahan", this.form.nama_bahan);
      this.bahan.append("jumlah_bahan", this.form.jumlah_bahan);
      this.bahan.append("ukuran_penyajian", this.form.ukuran_penyajian);
      this.bahan.append("unit", this.form.unit);
      this.bahan.append("id_menu", this.choosenMenu.id_menu);

      var url = this.$api + "/bahan/tambah/";
      this.load = true;
      this.$http
        .post(url, this.bahan, {
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
        nama_bahan: this.form.nama_bahan,
        jumlah_bahan: this.form.jumlah_bahan,
        ukuran_penyajian: this.form.ukuran_penyajian,
        unit: this.form.unit,
        id_menu: this.choosenMenu.id_menu,
      };

      var url = this.$api + "/bahan/update/" + this.editId;
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
      var url = this.$api + "/bahan/hapus/" + this.deleteId;
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

      const { id_menu, nama_menu } = { ...item };

      this.form = { ...item };
      this.choosenMenu = { id_menu, nama_menu };

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
        nama_bahan: null,
        jumlah_bahan: null,
        ukuran_penyajian: null,
        unit: null,
        id_menu: null,
      };
    },
  },
  async created() {
    try {
      const url = this.$api + "/menu/tampil/";
      const res = await this.$http.get(url, {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("token"),
        },
      });

      this.listMenu = res.data.data.map((x) => {
        const { id, nama_menu } = { ...x };

        return { id_menu: id, nama_menu };
      });
      console.log(this.listMenu);
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
  },
};
</script>