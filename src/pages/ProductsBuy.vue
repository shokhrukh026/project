<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-btn icon="arrow_back" class="bg-white" outline style="color: grey;" to="/customers"></q-btn>
        <q-btn
          v-if="$q.screen.gt.xs"
          outline
          dense
          icon="add"
          color="green"
          label="Добавить"
          class="bg-white q-pr-sm text-weight-bold"
          @click="add_new = !add_new"
        ></q-btn>
        <q-btn-dropdown
          outline
          dense
          color="primary"
          icon="filter_list"
          class="bg-white q-ml-sm text-weight-bold"
          label="Add Filter"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Filter 1</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Filter 2</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Filter 3</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-input class="float-right q-mt-sm q-mr-sm bg-white" v-model="search" label="Search here" outlined dense
                 style="width: 35%">
          <template v-slot:append>
            <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer"/>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
    </div>
    <div class="col-12 q-ma-sm">
       <!-- :filter="filter" -->
      <!-- :loading="loading" -->
      <q-table
      dense
      separator="cell"
      row-key="index"  
      :data="data" 
      :columns="columns"
      :filter="filter"
      :rows-per-page-options="[0]"
      :pagination="pagination"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber"
      >
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat color="grey" @click="editRow(props.row)" icon="edit"></q-btn>
            <q-btn dense round flat color="grey" @click="deleteRow(props.row)" icon="delete"></q-btn>
          </q-td>
      </template>
    
      <template v-slot:top="props">
        <q-icon name="shopping_basket" class="text-grey-7 text-h4"></q-icon>
        <span class="text-h6 q-ml-sm text-grey-9 text-weight-bold">Продукты</span>
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter"
         placeholder="Искать" style="border: 1px solid silver; padding: 0 10px; border-radius: 5px;">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
      </q-table>
    </div>
   
    <q-dialog v-model="add_new" position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Добавить товар</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-select
                filled
                v-model="item.name"
                use-input
                hide-selected
                fill-input
                input-debounce="300"
                :options="options"
                @filter="filterFn"
                hint="Товар"
                class="col-6 q-pa-sm q-mb-xl"
            >
                <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                    No results
                    </q-item-section>
                </q-item>
                </template>
            </q-select>
            <q-input filled v-model="item.amount" type="number" hint="Кол-во" label="Кол-во" class="col-6 q-pa-sm q-mb-xl" :suffix="item.maxAmount.toString()" min="0" :max="item.maxAmount"/>
            <!-- <q-input filled v-model="item.barcode" type="number" label="Штрих код" class="col-12 q-pa-sm"/>
            <q-input filled v-model="item.name" label="Название" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.amount" type="number" label="Кол-во" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.buyPrice" type="number" label="Цена покупки" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.sellPrice" type="number" label="Цена продажи" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.description" label="Описание" autogrow class="col-12 q-pa-sm"/> -->

            
            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="add_new=!add_new" label="Отменить" color="primary"/>
              <q-btn
                @click="addProduct"
                class="q-ml-sm"
                label="Добавить"
                type="submit"
                color="green"
                :disable="item.amount == 0"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogEdit" position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Редактировать товар</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-input filled v-model="item.barcode" type="number" label="Штрих код" class="col-12 q-pa-sm"/>
            <q-input filled v-model="item.name" label="Название" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.amount" type="number" label="Кол-во" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.buyPrice" type="number" label="Цена покупки" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.sellPrice" type="number" label="Цена продажи" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.description" label="Описание" autogrow class="col-12 q-pa-sm"/>

            
            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="dialogEdit=!dialogEdit" label="Отменить" color="primary"/>
              <q-btn
                @click="editProduct"
                class="q-ml-sm"
                label="Добавить"
                type="submit"
                color="green"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogDelete" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-negative text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Удаление!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Вы уверены что хотите удалить?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Нет" v-close-popup />
          <q-btn flat label="Да" v-close-popup @click="deleteProduct"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    {{options}}
    {{id}}
    {{getAllProducts}}
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    props:{
      id: [String, Number]
    },
    data() {
        return {
          search: '',
          filter: '',
          pagination: {
            page: 1,
            rowsPerPage: 5
          },
          add_new: false,
          dialogEdit: false,
          dialogDelete: false,
          item: {barcode: null, name: '', amount: 0, buyPrice: null, sellPrice: null, description: '', maxAmount: 0},
          options: [],
          products: [],
          columns: [
            { name: 'index', align: 'center', label: 'No#', field: 'index', sortable: true },
            { name: 'barcode', align: 'center', label: 'Штрих-код', field: 'barcode', sortable: true },
            { name: 'name', align: 'center', label: 'Название', field: 'name', sortable: true },
            { name: 'amount', align: 'center', label: 'Кол-во', field: 'amount', sortable: true },
            { name: 'buyPrice', align: 'center', label: 'Цена покупки', field: 'buyPrice', sortable: true },
            { name: 'sellPrice', align: 'center', label: 'Цена продажи', field: 'sellPrice', sortable: true },
            { name: 'description', align: 'center', label: 'Описание', field: 'description', sortable: true },
            { name: 'actions', label: 'Действия', field: '', align:'center' },
          ],
          data: [],
            
        };
    },
    async mounted() {
      await this.refresh();
    },
    watch: {
      'item.name':{
        handler(value){
          if(value != ''){
            let chosenProduct = this.products.filter((element) => element.name == value)
            this.item.maxAmount = chosenProduct[0].amount;
          }
        },deep: true
      },
      'item.amount':{
        handler(value){
          if(value > this.item.maxAmount){
            this.item.amount = 0;
          }
        },deep: true
      },

    },
    computed: {
        ...mapGetters([
          'getAllProducts', 'getProductsOfCustomers'
        ])
    },
    methods: {
      ...mapActions([
          'GET_ALL_PRODUCTS', 'ADD_CUSTOMER_PRODUCT', 'DELETE_PRODUCT', 'EDIT_PRODUCT', 'FILTER_PRODUCTS_BY_NAME', 'GET_PRODUCTS_OF_CUSTOMERS'
      ]),
      filterFn (val, update, abort) {
          update(async () => {
              // const needle = val.toLowerCase()
              if(val.length > 2){
                this.products = await this.FILTER_PRODUCTS_BY_NAME(val)
                console.log(this.products)
                this.options = this.products.map((element) => element.name)
              }
              // this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
          })
      },
      async refresh(){
        await this.GET_PRODUCTS_OF_CUSTOMERS(this.id);
        this.data = await this.getProductsOfCustomers

        // await this.GET_ALL_PRODUCTS();
        // this.options = await this.getAllProducts.map(element => {
        //     return element.name
        // });
      },
      async addProduct() {
        let product = this.item;
        product.id = this.id
        await this.ADD_CUSTOMER_PRODUCT(product)
        await this.refresh();
        Object.assign(this.item, {barcode: null, name: '', amount: null, buyPrice: null, sellPrice: null, description: ''})
      },
      async editRow(props){
        this.dialogEdit = !this.dialogEdit
        this.item = {};
        Object.assign(this.item, {
          barcode: props.barcode,
          name: props.name,
          amount: props.amount,
          buyPrice: props.buyPrice,
          sellPrice: props.sellPrice,
          description: props.description,
          pid: props._id,
          id: this.id
        })
      },
      async editProduct(){
        await this.EDIT_PRODUCT(this.item)
        await this.refresh();
        this.dialogEdit = !this.dialogEdit
      },
      async deleteRow(props){
        this.dialogDelete = !this.dialogDelete
        this.item = {};
        Object.assign(this.item, { pid: props._id, id: this.id})
      },
      async deleteProduct(){
        await this.DELETE_PRODUCT(this.item)
        await this.refresh();
        
      },
    }
};
</script>

<style scoped>
 
</style>
