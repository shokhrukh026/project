<template>
  <q-page>
    <div class="row">
      <div class="col-12 row items-center">
        <div class="row q-ma-sm col-8">
        <q-select
            outlined
            v-model="item.name"
            use-input
            dense
            hide-selected
            fill-input
            input-debounce="300"
            :options="options"
            @filter="filterFn"
            class="col-4 bg-white q-mr-sm"
        >
            <template v-slot:no-option>
            <q-item>
                <q-item-section class="text-grey">
                No results
                </q-item-section>
            </q-item>
            </template>
        </q-select>
        <q-input outlined v-model="item.amount" dense type="number" min="0" class="col-2 q-mr-sm bg-white"/>
        <q-input outlined v-model="item.buyPrice" dense suffix="сум" class="col-3 q-mr-sm bg-white"/>
        <!-- <q-input outlined v-model="text" class="bg-white col-6" dense label="Штрих-код" /> -->
          <q-btn
            v-if="$q.screen.gt.xs"
            outline
            color="green"
            label="Добавить"
            class="q-ml-xs bg-white text-weight-bold"
            @click="addItem"
            :disable="item.amount == 0"
          ></q-btn>
        </div>
        <q-space/>
        <div class="q-ma-sm">
           <q-btn-dropdown
          outline
          dense
          color="primary"
          icon="filter_list"
          class="bg-white"
          label="Add Filter"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Filter 1</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        </div>
        <!-- <q-input class="float-right q-mt-sm q-mr-sm bg-white" v-model="search" label="Search here" outlined dense
                 style="width: 35%">
          <template v-slot:append>
            <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer"/>
            <q-icon name="search"/>
          </template>
        </q-input> -->
      </div>
    </div>
    <div class="col-3 q-px-xs">
      <div class="q-pa-xs">
        <!-- <q-item style="background-color: #5e5e5e;border-top-left-radius: 4px;border-top-right-radius: 4px;"
                class="q-pa-none text-white q-pa-sm">
          <q-item-section avatar style="min-width:25px">
            <q-icon name="assignment" class="q-pa-none q-ma-none"/>
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bolder">Продукты</q-item-section>
          

          <q-item-section avatar>
            <q-icon name="more_vert" class="cursor-pointer">
              <q-menu transition-show="rotate" transition-hide="rotate">
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>Mark all as completed</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Mark all as in progress</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Mark all as hold</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </q-item> -->
        <q-item style="background-color: #5e5e5e;border-top-left-radius: 4px;border-top-right-radius: 4px;"
                class="text-white q-pa-sm col-12">
          <q-item-section class="text-subtitle text-weight-bolder col-2 text-center">
            <div>
              <q-icon name="assignment" class="text-h6 items-center"/>
            Штрих-код
            </div>
          </q-item-section>
          <!-- <q-item-section class="text-subtitle text-weight-bolder col-2 text-center">Дата</q-item-section> -->
          <q-item-section class="text-subtitle text-weight-bolder col-2 text-center">Название</q-item-section>
          <q-item-section class="text-subtitle text-weight-bolder col-2 text-center">Кол-во</q-item-section>
          <q-item-section class="text-subtitle text-weight-bolder col-2 text-center">Ед. Измерения</q-item-section>
          <q-item-section class="text-subtitle text-weight-bolder col-2 text-center">Цена покупки</q-item-section>
          <!-- <q-item-section class="text-subtitle text-weight-bolder">Описание</q-item-section> -->
          <q-item-section class="text-subtitle text-weight-bolder col-2 text-center">Действия</q-item-section>

        </q-item>
        <draggable
          class="list-group"
          :list="task_list"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <q-list v-for="(element, index) in items" :key="index" bordered class="rounded-borders cursor-move"
                 >
                  <!-- :class="task_class[element.type]" -->
            <q-item class="bg-white col-12">
              <!-- <q-item-section avatar>
                <q-icon :name="task_icon[element.type]" color="black" size="34px"/>
              </q-item-section> -->
              <q-item-section style="font-size: 14px;" class="text-grey-9 col-2 text-center">
                {{element.barcode}}
              </q-item-section>
              <!-- <q-item-section style="font-size: 14px;" class="text-grey-9 col-2 text-center">
                {{element.date}}
              </q-item-section> -->
              <q-item-section style="font-size: 14px;" class="text-grey-9 col-2 text-center">
                {{element.name}}
              </q-item-section>
              <q-item-section style="font-size: 14px;" class="text-grey-9 col-2 text-center">
                {{element.amount}}
              </q-item-section>
              <q-item-section style="font-size: 14px;" class="text-grey-9 col-2 text-center">
                {{element.measure}}
              </q-item-section>
              <q-item-section style="font-size: 14px;" class="text-grey-9 col-2 text-center">
                {{element.buyPrice}} сум
              </q-item-section>
              <q-item-section style="font-size: 14px;" class="text-grey-9 col-2 text-center">
                <div>
                  <q-btn size="12px" color="green" flat dense round icon="edit" @click="editItem(index)"/>
                  <q-btn size="12px" color="red" flat dense round icon="delete" @click="removeItem(index)"/>
                  <!-- <q-btn size="12px" flat dense round icon="more_vert"/> -->
                </div>
              </q-item-section>

              <!-- <q-item-section class="col-1">
                <q-avatar size="md">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png"/>
                </q-avatar>
              </q-item-section> -->
              <!-- <q-item-section class="col-2">
                <div class="q-pa-sm q-gutter-md">
                  <q-badge
                    filled
                    class="q-pa-sm text-bold"
                    v-bind:key="index"
                    v-for="(tag, index) in element.tags"
                    :color="tag.color"
                    style="font-size: 15px"
                  >{{tag.name}}
                  </q-badge>
                </div>
              </q-item-section> -->
<!-- 
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn class="q-mr-sm" size="12px" dense filled round color="blue" icon="message"/>
                  <q-btn class="q-mr-sm" size="12px" dense filled round color="orange" icon="flag"/>
                  <q-btn class="q-mr-lg" size="12px" dense filled round color="grey" icon="attachment"/>
                  <span style="width:125px" class="inline-block text-grey-9"><span v-if="element.due_date">Due {{element.due_date}}</span></span>
                  <q-btn size="12px" color="red" flat dense round icon="delete"/>
                  <q-btn size="12px" color="green" flat dense round icon="done"/>
                  <q-btn size="12px" flat dense round icon="more_vert"/>
                </div>
              </q-item-section> -->
            </q-item>
           
          </q-list>
        </draggable>
      </div>
      <div class="q-pa-xs">
        <q-list>
           <q-item style="background-color: #5e5e5e;"
                class="text-white q-pa-sm col-12">
              <!-- <q-item-section class="text-subtitle text-weight-bolder col-4 text-center">
                Оплачено: {{payedTotal}} сум
              </q-item-section> -->
              <q-item-section class="text-subtitle text-weight-bolder col-4 text-center">
                Неоплачено: {{unPayedTotal}} сум
              </q-item-section>
              <q-item-section class="text-subtitle text-weight-bolder col-4 text-center">
                Всего к оплате: {{totalToPay}} сум
              </q-item-section>
              <q-item-section class="text-subtitle text-weight-bolder col-3 row items-end">
                <q-btn
                  v-if="items.length != 0"
                  outline
                  color="green"
                  label="Оплатить"
                  class="bg-white text-weight-bold"
                  @click="addItem"
                ></q-btn>
              </q-item-section>
            </q-item>
        </q-list>
      </div>
    </div>

    <q-dialog v-model="dialogEdit" persistent position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Редактирование товара</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-input filled v-model="item.amount" disable type="number" min="0" label="Кол-во" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.buyPrice" label="Цена покупки" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.payed" label="Оплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.unPayed" label="Неоплачено" suffix="сум" class="col-6 q-pa-sm"/>

            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="cleanItem" v-close-popup label="Отменить" color="primary"/>
              <q-btn
                class="q-ml-sm"
                label="Изменить"
                type="submit"
                color="green"
                :disable="item.amount == 0"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    {{item}}
    {{items}}
  </q-page>
</template>

<script>
    import Vue from "vue";
    import { mapGetters, mapActions } from 'vuex';
    import draggable from "vuedraggable";
    import {Notify} from "quasar";

    Vue.component("draggable", draggable);

    export default {
        name: "PageIndex",
        data() {
            return {
              dialogEdit: false,
              itemOldName: '',
              items: [],
              item: {
                barcode: '',
                name: '',
                amount: 0,
                measure: '',
                buyPrice: '',
                date: '',
                payed: '',
                unPayed: '',
                total: '',
                about: '',
                maxAmount: 0
              },
              options: [],
              drag: false,
            };
        },
        watch:{
          'item.name':{
            async handler(value){
              if((this.products.length != 0) && (this.itemOldName != value)){
                this.itemOldName = value
                let chosenProduct = await this.products.filter((element) => element.name == value)
                await this.GET_PRODUCTS_DETAIL_OF_PRODUCER(chosenProduct[0]._id);
                let remained = await this.totalAmountRemained
                this.item = Object.assign({barcode: chosenProduct[0].barcode, name: chosenProduct[0].name, amount: 1,
                measure: chosenProduct[0].measure, buyPrice: chosenProduct[0].sellPrice, product_id: chosenProduct[0]._id,
                date: this.getNowDateAndTime, about: chosenProduct[0].about, maxAmount: remained})
              } 
            },deep: true
          },
          'item.buyPrice': {
            async handler(value){
              if(value != '' && this.dialogDelete != true){
                let buyPrice = this.item.buyPrice.replace(/[^0-9]/g,'');
                buyPrice = buyPrice.toString()
                buyPrice = buyPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                this.item.buyPrice = buyPrice

                await this.dialogInputsChange();
              }
            },deep: true
          },
          'item.amount':{
            async handler(value){
              if((value != 0) && (value > this.item.maxAmount)){
                this.item.amount = 0;
              }
              if(this.item.buyPrice != ''){
                await this.dialogInputsChange();
              }
            },deep: true
          },
          'item.payed': {
            async handler(value){
              if(value != null){
                if(this.item.buyPrice != ''){
                  await this.dialogInputsChange();
                }
              }
            },deep: true
          },
        },
        async mounted(){
          
        },
        computed: {
          ...mapGetters([
            'getAllProducts', 'getProductsOfCustomers', 'getProductDetailOfProducer', 'getCustomers'
          ]),
          dragOptions() {
              return {
                  animation: 200,
                  group: "description",
                  disabled: false,
                  ghostClass: "ghost"
              };
          },
          // payedTotal(){
          //   let totalPayed = 0;
          //   for(let i = 0; i < this.items.length; i++){
          //     let payed = parseInt(this.items[i].payed.replace(/[^0-9]/g,''));
          //     totalPayed = totalPayed + payed
          //   }
          //   totalPayed = totalPayed.toString()
          //   totalPayed = totalPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          //   return totalPayed
          // },
          unPayedTotal(){
            let totalUnPayed = 0;
            for(let i = 0; i < this.items.length; i++){
              let buyPrice = parseInt(this.items[i].buyPrice.replace(/[^0-9]/g,''));
              totalUnPayed = totalUnPayed + (this.items[i].amount * buyPrice)
            }
            totalUnPayed = totalUnPayed.toString()
            totalUnPayed = totalUnPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            return totalUnPayed
          },
          totalToPay(){
            let totalUnPayed = 0;
            for(let i = 0; i < this.items.length; i++){
              let buyPrice = parseInt(this.items[i].buyPrice.replace(/[^0-9]/g,''));
              totalUnPayed = totalUnPayed + (this.items[i].amount * buyPrice)
            }
            totalUnPayed = totalUnPayed.toString()
            totalUnPayed = totalUnPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            return totalUnPayed
          },

        },
        methods: {
           ...mapActions([
                'FILTER_PRODUCTS_OF_PRODUCERS_BY_NAME', 'GET_PRODUCTS_DETAIL_OF_PRODUCER'
            ]),
           filterFn (val, update, abort) {
                update(async () => {
                    if(val.length > 2){
                      this.products = await this.FILTER_PRODUCTS_OF_PRODUCERS_BY_NAME(val)
                      this.options = this.products.map((element) => element.name)
                    }
                })
            },
            cleanItem() {
              this.item = Object.assign({
                barcode: '',
                name: '',
                amount: 0,
                measure: '',
                buyPrice: '',
                date: '',
                payed: '',
                unPayed: '',
                total: '',
                about: '',
                maxAmount: 0
              })
            },
            async addItem(){
              await this.$set(this.items, this.items.length, this.item);
              await this.cleanItem();
            },
            async removeItem(index){
              await this.items.splice(index, 1);
              await this.cleanItem();
            },
            editItem(index){
              this.dialogEdit = !this.dialogEdit
              this.item = {};
              this.item = Object.assign({
                barcode: this.items[index].barcode,
                name: this.items[index].name,
                amount: this.items[index].amount,
                measure: this.items[index].measure,
                buyPrice: this.items[index].buyPrice,
                date: this.items[index].date,
                payed: this.items[index].payed,
                unPayed: this.items[index].unPayed,
                // sellPrice: props.sellPrice,
                about: this.items[index].about,
              })
            },
            dialogInputsChange(){
                let buyPrice = this.item.buyPrice.replace(/[^0-9]/g,'');
                let payed = this.item.payed.replace(/[^0-9]/g,'');
                this.item.total = buyPrice * this.item.amount
                this.item.unPayed = (this.item.total - payed)
                let unPayed = this.item.unPayed
                unPayed = unPayed.toString()
                unPayed = unPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                this.item.unPayed = unPayed
            },
            // this.$q.notify({
            //         type: "positive",
            //         message: `The new task is added successfully.`
            //     });
            deleteTask(task_lane, index) {
                this[task_lane].splice(index, 1);
            },
        }
    };
</script>

<style scoped>
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .cursor-move {
    cursor: move;
  }
</style>
