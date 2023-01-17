<template>
  <v-container class="my4 md5">
    <v-card class="justify-center">
      <v-toolbar-title class="text-center" color="green"
        >Pendapatan</v-toolbar-title
      >
      <v-card-actions>
        <v-radio-group v-model="setpendapatan" mandatory>
          <v-radio label="Laporan Tahunan" value="1"></v-radio>
          <v-radio label="Laporan Bulanan" value="2"></v-radio>
        </v-radio-group>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="setpendapatan == 1">
          <v-divider></v-divider>

          <v-row>
            <v-col class="d-flex">
              <v-select
                v-model="pendapatanTahun"
                :items="listTahun"
                label="Tahun Mulai"
                dense
                solo
              />
              <p class="ma-4">TO</p>
              <v-select
                v-model="pendapatanTahun2"
                :items="listTahun"
                label="Tahun Selesai"
                dense
                solo
              />
            </v-col>
          </v-row>
          <v-btn @click="laporanPendapatan">Print</v-btn>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-show="setpendapatan == 2">
          <v-divider></v-divider>
          <v-row>
            <v-col class="d-flex">
              <v-select
                v-model="pendapatanTahun"
                :items="listTahun"
                label="Tahun"
                dense
                solo
              />
            </v-col>
          </v-row>
          <v-btn @click="laporanPendapatan">Print</v-btn>
        </div>
      </v-expand-transition>
    </v-card>

    <v-spacer></v-spacer>

    <v-card class="justify-center my-6">
      <v-toolbar-title class="text-center" color="green"
        >Pengeluaran</v-toolbar-title
      >
      <v-card-actions>
        <v-radio-group v-model="setpengeluaran" mandatory>
          <v-radio label="Laporan Tahunan" value="1"></v-radio>
          <v-radio label="Laporan Bulanan" value="2"></v-radio>
        </v-radio-group>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="setpengeluaran == 1">
          <v-divider></v-divider>

          <v-row>
            <v-col class="d-flex">
              <v-select
                v-model="pengeluaranTahun"
                :items="listTahun"
                label="Tahun Mulai"
                dense
                solo
              />
              <p class="ma-4">TO</p>
              <v-select
                v-model="pengeluaranTahun2"
                :items="listTahun"
                label="Tahun Selesai"
                dense
                solo
              />
            </v-col>
          </v-row>
          <v-btn @click="laporanPengeluaran">Print</v-btn>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-show="setpengeluaran == 2">
          <v-divider></v-divider>

          <v-row>
            <v-col class="d-flex">
              <v-select
                v-model="pengeluaranTahun"
                :items="listTahun"
                label="Tahun"
                dense
                solo
              />
            </v-col>
          </v-row>
          <v-btn @click="laporanPengeluaran">Print</v-btn>
        </div>
      </v-expand-transition>
    </v-card>
    <v-spacer></v-spacer>

    <v-card class="justify-center">
      <v-toolbar-title class="text-center" color="green"
        >Laporan Stok</v-toolbar-title
      >
      <v-card-actions>
        <v-radio-group v-model="setstok" mandatory>
          <v-radio label="Laporan Tahunan" value="1"></v-radio>
          <v-radio label="Laporan Bulanan" value="2"></v-radio>
        </v-radio-group>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="setstok == 1">
          <v-row>
            <v-col>
              <v-text-field v-model="stockTgl1" type="date"></v-text-field>
            </v-col>
            TO
            <v-col>
              <v-text-field v-model="stockTgl2" type="date"></v-text-field>
            </v-col>
          </v-row>
          <v-btn @click="laporanStok">PRINT</v-btn>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        

        <div v-show="setstok == 2">
          <v-divider></v-divider>

          <v-row>
            <v-col>
              <v-select
                v-model="stockChoosenBahan"
                :items="listBahan"
                label="PILIH BAHAN"
                item-value="id_bahan"
                item-text="nama_bahan"
                return-object
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="stockTahun"
                :items="listTahun"
                label="Tahun"
                dense
                solo
              />
            </v-col>
            <v-col>
              <v-select
                label="Bulan"
                dense solo
                v-model="stockBulan"
                :items="listBulan"
                item-text="nama"
                item-value="index"
                return-object
              />
            </v-col>
          </v-row>

          <v-btn @click="laporanStok">PRINT</v-btn>
        </div>
      </v-expand-transition>
      <v-card-actions> </v-card-actions>
    </v-card>
    <v-spacer></v-spacer>

    <v-card class="justify-center my-6">
      <v-toolbar-title class="text-center" color="green"
        >Laporan Penjualan</v-toolbar-title
      >
      <v-card-actions>
        <v-radio-group v-model="setpenjualan" mandatory>
          <v-radio label="Laporan Tahunan" value="1"></v-radio>
          <v-radio label="Laporan Bulanan" value="2"></v-radio>
        </v-radio-group>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="setpenjualan == 1">
          <v-divider></v-divider>
          <v-row>
            <v-col class="d-flex">
              <v-select
                v-model="penjualanTahun"
                :items="listTahun"
                label="Tahun"
                dense
                solo
              />
            </v-col>
          </v-row>
          <v-btn @click="laporanPenjualan">Print</v-btn>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-show="setpenjualan == 2">
          <v-divider></v-divider>

          <v-row>
            <v-col class="d-flex">
              <v-select
                v-model="penjualanTahun"
                :items="listTahun"
                label="Tahun"
                dense
                solo
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex">
              <v-select
                label="Bulan"
                v-model="penjualanBulan"
                :items="listBulan"
                item-text="nama"
                item-value="index"
                return-object
              />
            </v-col>
          </v-row>
          <v-btn @click="laporanPenjualan">Print</v-btn>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    show: false,
    setpendapatan: null,
    setpengeluaran: null,
    setstok: null,
    setpenjualan: null,
    listTahun: [2018, 2019, 2020, 2021, 2022],
    listBulan: [
      {
        index: 1,
        nama: "January",
      },
      {
        index: 2,
        nama: "February",
      },
      {
        index: 3,
        nama: "Maret",
      },
      {
        index: 4,
        nama: "April",
      },
      {
        index: 5,
        nama: "Mei",
      },
      {
        index: 6,
        nama: "Juni",
      },
      {
        index: 7,
        nama: "Juli",
      },
      {
        index: 8,
        nama: "Agustus",
      },
      {
        index: 9,
        nama: "September",
      },
      {
        index: 10,
        nama: "Oktober",
      },
      {
        index: 11,
        nama: "November",
      },
      {
        index: 12,
        nama: "Desember",
      },
    ],
    listBahan: [],
    base_url: "http://192.168.100.3:6969/api/",
    pendapatanTahun: null,
    pendapatanTahun2: null,
    pengeluaranTahun: null,
    pengeluaranTahun2: null,
    penjualanTahun: null,
    penjualanBulan: { index: "" },
    stockChoosenBahan: {id_bahan: "", nama_bahan: ""},
    stockTahun: null,
    stockBulan: { index: "", nama: "" },
    stockTgl1: null,
    stockTgl2:null,
  }),

  methods: {
    async laporanPendapatan() {
      try {
        const url =
          this.setpendapatan == 1
            ? `${this.base_url}laporan/pendapatan/tahunan`
            : `${this.base_url}laporan/pendapatan/bulanan`;

        const res = await this.$http.post(url, {
          tahun: this.pendapatanTahun,
          tahun2: this.pendapatanTahun2,
        });
        const newWindow = window.open("", "response", "resizable=yes");
        newWindow.document.write(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async laporanPengeluaran() {
      try {
        const url =
          this.setpengeluaran == 1
            ? `${this.base_url}laporan/pengeluaran/tahunan`
            : `${this.base_url}laporan/pengeluaran/bulanan`;
        const res = await this.$http.post(url, {
          tahun: this.pengeluaranTahun,
          tahun2: this.pengeluaranTahun2,
        });
        const newWindow = window.open("", "response", "resizable=yes");
        newWindow.document.write(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async laporanPenjualan() {
      try {
        const url =
          this.setpenjualan == 1
            ? `${this.base_url}laporan/pejualan/tahunan`
            : `${this.base_url}laporan/pejualan/bulanan`;
        const res = await this.$http.post(url, {
          tahun: this.penjualanTahun,
          bulan: this.penjualanBulan.index,
        });
        const newWindow = window.open("", "response", "resizable=yes");
        newWindow.document.write(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async laporanStok() {
      try {
        const url =
          this.setstok == 1
            ? `${this.base_url}laporan/stok/tahunan`
            : `${this.base_url}laporan/stok/bulanan`;
        const res = await this.$http.post(url, {
          tahun: this.stockTahun,
          bulan: this.stockBulan.index,
          id_bahan: this.stockChoosenBahan.id_bahan,
          tgl1: this.stockTgl1,
          tgl2: this.stockTgl2
        });
        const newWindow = window.open("", "response", "resizable=yes");
        newWindow.document.write(res.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    try {
      const url = `${this.base_url}bahan/tampil`;

      const res = await this.$http.get(url);
      this.listBahan = res.data.data.map(x => {
        const {id, nama_bahan} = x;
        return {id_bahan: id, nama_bahan}
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>