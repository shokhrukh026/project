// import something here
import money from 'v-money'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ app, router, Vue}) => {
  // something to do
  Vue.use(money, {precision: 4})
}
