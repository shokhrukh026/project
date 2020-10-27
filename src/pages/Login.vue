<template>
  <q-page>
    <div class="column">
    <div class="section row justify-center items-center">
      <!-- <div class="q-px-lg">
        <h5 class="text-h5 text-white">Company & Co</h5>
      </div> -->
      <div class="row">
        <q-card
          square
          bordered
          class="q-pa-lg shadow-1" 
        >
        <div class="text-h5 row justify-center text-green col-12 q-pa-md">Assalomu alaykum!</div>
          <q-card-section>
            <q-form class="column">
              <q-input
                square
                filled
                clearable
                v-model="email"
                type="email"
                label="E-mail"
                class="q-mb-sm"
              />
              <q-input
                square
                filled
                clearable
                v-model="password"
                type="password"
                label="Password"
                class="q-mb-sm"
              />
              <q-btn
                unelevated
                color="light-green-7"
                size="lg"
                class="full-width"
                label="Kirish"
                @click="signIn"
              />
            </q-form>
          </q-card-section>
          <!-- <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Systemada muammo bormi? tel: +998998442431</p>
          </q-card-section> -->
        </q-card>
        
      </div>
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
    </div>
    </div>
  </q-page>
</template>

<script>
import router from '../router/index'

export default {
  data () {
    return {
      email: 'shokhrukh024@gmail.com',
      password: '7777'
    }
  },
  async mounted(){
  },
  methods:{
    async signIn() {
      try {
        await this.$store.dispatch('SIGNIN', {
          email: this.email,
          password: this.password,
          router: this.$router
        })
      } catch (e) {
        console.log('error')
      }
    },

   
  }
}
</script>

<style scoped>
.q-card {
  width: 360px;
}
/* Wave styles */

/* *{
  margin: 0;
  padding: 0;
} */
.section{
  position: relative;
  width: 100%;
  height: 100vh;
  background: #87ceeb;
  overflow: hidden;
}
.section .wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: url('/statics/login/wave.png');
  background-size: 1000px 100px;
}
.section .wave.wave1{
  animation: animate 30s linear infinite;
  z-index: 1000;
  opacity: 1;
  animation-delay: 0s;
  bottom: 0;
}
.section .wave.wave2{
  animation: animate2 15s linear infinite;
  z-index: 999;
  opacity: 0.5;
  animation-delay: -5s;
  bottom: 10px;
}
.section .wave.wave3{
  animation: animate3 30s linear infinite;
  z-index: 998;
  opacity: 0.2;
  animation-delay: -2s;
  bottom: 15;
}
.section .wave.wave4{
  animation: animate2 5s linear infinite;
  z-index: 997;
  opacity: 0.7;
  animation-delay: -5s;
  bottom: 20px;
}
@keyframes animate {
  0%{
    background-position-x: 0;
  }
  100%{
    background-position-x: 1000px;
  }
}
@keyframes animate2 {
  0%{
    background-position-x: 0;
  }
  100%{
    background-position-x: -1000px;
  }
}
</style>