<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated style="background: dimgray;">
      <!-- style="background: linear-gradient(145deg, #15503e 15%, #133154 70%);" -->
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">Quasar Scrum</q-toolbar-title>

        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat icon="apps">
            <q-tooltip>Customize</q-tooltip>
          </q-btn>
          <q-btn round dense flat icon="notifications">
            <q-badge color="red" text-color="white" floating>2</q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round dense flat icon="fas fa-sign-out-alt" to="/">
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen"
              show-if-above
              :mini="miniState"
              @mouseover="miniState = false"
              @mouseout="miniState = true"
              mini-to-overlay
              bordered
              content-class="bg-grey-3">
      <q-list class="text-black">
        <q-item v-for="(list,index) in drawerList" :key="index" active-class="tab-active" :to="list.link"
         exact class="q-ma-none navigation-item" clickable v-ripple>
          <q-item-section avatar>
            <q-icon :name="list.icon"/>
          </q-item-section>

          <q-item-section>
            {{list.name}}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container style="background-color:#f4f4f4">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
    import EssentialLink from "components/EssentialLink";

    export default {
        name: "MainLayout",
        data() {
            return {
                leftDrawerOpen: false,
                miniState: true,
                drawerList:[
                  { name: 'Главная', link: '/main', icon: 'home' },
                  { name: 'Покупка', link: '/accounting', icon: 'shopping_cart' },
                  { name: 'Продукты', link: '/products', icon: 'view_headline' },
                  { name: 'Поставщики', link: '/producers', icon: 'local_shipping' },
                  { name: 'Покупатели', link: '/customers', icon: 'groups' },
                  { name: 'Возвраты', link: '/return', icon: 'system_update_alt' },

                  { name: 'Dashboard - Grid', link: '/dashboard-grid', icon: 'dashboard' },
                ]
            };
        }
    };
</script>

<style>
  .tab-active {
    background-color: limegreen;
    color: white;
  }
</style>
