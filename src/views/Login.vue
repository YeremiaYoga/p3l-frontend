<template>
    <v-app>
        <v-content>
            <v-container class='fill-height' fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="8">
                    <v-card class="rounded-xl"  elevation="10" width="1500px">
                        <div>
                            <v-row>
                            <v-col align="center" justify="center">
                                <v-img src="@/assets/logo.png" width="100px"></v-img>
                            </v-col>
                                <v-col cols="12" md="6">
                                <v-card-text class="mt-14" >
                                    <h1 class="text-center deep-orange--text" >LOGIN</h1>
                                        <v-form v-model="valid" ref="form">
                                            <v-text-field 
                                            label="Email"
                                            type="text"
                                            color="deep-orange"
                                            prepend-icon="email"
                                            v-model="email_karyawan"
                                            :rules="emailRules"
                                            required></v-text-field>
                                            <v-text-field 
                                            label="Password"
                                            type="password"
                                            color="deep-orange"
                                            prepend-icon="lock"
                                            v-model="password"
                                            :rules="passwordRules"
                                            required></v-text-field>

                                            <div class="text-center mt-6">
                                                <v-btn 
                                                    class="mr-2" @click="submit"
                                                    rounded color="deep-orange accent-4 white--text"
                                                    :class=" { 'deep-orange  white--text' 
                                                    : valid, disabled: !valid }"
                                                >Login</v-btn>
                                            </div>
                                        </v-form>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        </div>
                        
                    </v-card>
                    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                    {{error_message}}
                    </v-snackbar>
                </v-col>
            </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
export default{
    name:"Login",
    data(){
        return{
            load:false,
            snackbar:false,
            color:'',
            error_message:'',
            nama_karyawan:'',
            no_telepon:'',
            email_karyawan:'',
            jabatan:'',
            password:'',
            valid:false,
            emailRules: [
                (v) => !!v || 'Email kosong',
            ],
            passwordRules: [
                (v) => !!v || 'Password kosong'
            ],

        };
    },
    methods: {
        submit(){
            if(this.$refs.form.validate()){
                this.load = true
                this.$http.post(this.$api + '/login', {//cek apakah data yang akan dikirim sudah valid
                    email_karyawan: this.email_karyawan,
                    password:this.password
                }).then((response) => {
                    localStorage.setItem('id', response.data.user.id);//menyimpan id user yang sedang login
                    localStorage.setItem('token', response.data.access_token);
                    localStorage.setItem('nama_karyawan', response.data.user.nama_karyawan);
                    localStorage.setItem('no_telepon', response.data.user.no_telepon);
                    localStorage.setItem('email_karyawan', response.data.user.email_karyawan);
                    localStorage.setItem('jabatan', response.data.user.jabatan);
                    this.error_message=response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    this.load = false;
                    console.log(response);
                    this.$router.replace({
                         name:'home'
                         })
                    //menyimpan auth token
                }).catch((error) => {
                    this.error_message = error.response.data.message;
                    console.log(error);
                    this.color="red"
                    this.snackbar=true;
                    localStorage.removeItem('token')
                    this.load = false;
                })
            }
        },
    }
}
</script>