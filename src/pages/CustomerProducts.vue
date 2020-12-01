<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-btn icon="arrow_back" class="bg-white q-mr-sm" outline style="color: grey;" to="/customers"></q-btn>
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
          label="Фильтры"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Фильтр 1</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Фильтр 2</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Фильтр 3</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!-- <q-input class="float-right q-mt-sm q-mr-sm bg-white" v-model="search" label="Search here" outlined dense
                 style="width: 35%">
          <template v-slot:append>
            <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer"/>
            <q-icon name="search"/>
          </template>
        </q-input> -->
      </div>
    </div>

      <div class="col-12 q-ma-sm">
      <q-list bordered separator dense class="bg-white text-green-9 text-subtitle1">
        <q-item>
          <q-item-section>
            <div>
              <span>Ф.И.О: </span> 
              <span class="text-black text-weight-regular">{{getCustomerInfo[0].name}}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div>
              <span>Номер телефона: </span> 
              <span class="text-black text-weight-regular">{{getCustomerInfo[0].phone}}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div>
              <span>Название компании: </span> 
              <span class="text-black text-weight-regular">{{getCustomerInfo[0].companyName}}</span>
            </div>
          </q-item-section>
        </q-item>
         <q-item>
          <q-item-section>
            <div>
              <span>Оплачено всего: </span> 
              <span class="text-black text-weight-regular">{{payedTotal}} сум</span>
            </div>
          </q-item-section>
        </q-item>
         <q-item>
          <q-item-section>
            <div>
              <span>Неоплачено всего: </span> 
              <span class="text-black text-weight-regular">{{unPayedTotal}} сум</span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
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
            <q-btn dense round flat color="grey" icon="info"></q-btn> 
             <!-- :to="{ name: 'producer-product-detail', params: { product_id: props.row._id, uid: uid }}" -->
            <q-btn dense round flat color="grey" @click="returnRow(props.row)" icon="assignment_return"></q-btn>

            <q-btn dense round flat color="grey" @click="deleteRow(props.row)" icon="delete"></q-btn>
          </q-td>
      </template>
    
      <template v-slot:top="props">
        <q-icon name="local_grocery_store" class="text-grey-7 text-h4"></q-icon>
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
          <div class="text-h6 text-weight-bold q-pl-sm">Добавление товара</div>
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
                label="Товар"
                class="col-12 q-pa-sm"
            >
                <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                    No results
                    </q-item-section>
                </q-item>
                </template>
            </q-select>
            <q-input filled v-model="item.amount" type="number" label="Кол-во" class="col-6 q-pa-sm"
             :suffix="suffixReturn ? suffixReturn.toString() : ''" min="0" :max="item.maxAmount"/>
            <q-input filled v-model="item.buyPrice" label="Цена покупки" suffix="сум" class="col-6 q-pa-sm" />


            <q-input filled v-model="item.date" class="col-12 q-pa-sm">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="item.date" mask="DD-MM-YYYY HH:mm" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Применить" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="item.date" mask="DD-MM-YYYY HH:mm" now-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Применить" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model.lazy="item.payed" v-money="money" label="Оплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.unPayed" label="Неоплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.about" label="Описание" autogrow class="col-12 q-pa-sm"/>

            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="cleanItem" v-close-popup label="Отменить" color="primary"/>
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

    <q-dialog v-model="dialogEdit" persistent position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Редактирование товара</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-input filled v-model="item.barcode" disable label="Штрих код" class="col-6 q-pa-sm"/>
           
            <q-input filled v-model="item.date" disable class="col-6 q-pa-sm">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="item.date" mask="DD-MM-YYYY HH:mm" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Применить" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="item.date" mask="DD-MM-YYYY HH:mm" now-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Применить" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="item.name" disable label="Название" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.measure" disable label="Ед. Измерения" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.amount" disable type="number" min="0" label="Кол-во" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.buyPrice" label="Цена покупки" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model.lazy="item.payed" v-money="money" label="Оплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.unPayed" label="Неоплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.about" label="Описание" autogrow class="col-12 q-pa-sm"/>


            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="cleanItem" v-close-popup label="Отменить" color="primary"/>
              <q-btn
                @click="editProduct"
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

<q-dialog v-model="dialogReturn" persistent position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Возврат товара</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-input filled v-model="item.barcode" disable label="Штрих код" class="col-6 q-pa-sm"/>
           
            <q-input filled v-model="item.name" disable label="Название" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.measure" disable label="Ед. Измерения" class="col-6 q-pa-sm"/>
         
            <!-- <q-input filled v-model.lazy="item.payed" v-money="money" label="Оплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.unPayed" label="Неоплачено" suffix="сум" class="col-6 q-pa-sm"/> -->
               <q-input filled v-model="item.returnDate" class="col-6 q-pa-sm">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="item.date" mask="DD-MM-YYYY HH:mm" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Применить" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="item.returnDate" mask="DD-MM-YYYY HH:mm" now-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Применить" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="item.amount" type="number" min="0" :suffix="totalReturnAmount" label="Кол-во" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.buyPrice" label="Цена покупки" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.returnReason" label="Описание" autogrow class="col-12 q-pa-sm"/>


            <div class="col-12 row justify-end q-pa-sm">
              <q-btn v-close-popup @click="cleanItem"  label="Отменить" color="primary"/>
              <q-btn
                @click="returnProduct"
                class="q-ml-sm"
                label="Возвратить"
                type="submit"
                color="green"
                :disable="(item.amount == 0) || (item.returnReason == '') || (totalReturnAmount=='0') "
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
    <!-- {{getAllProducts}} -->
    {{data}}
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {VMoney} from 'v-money'

export default {
    props:{
      uid: [String, Number]
    },
    directives: {money: VMoney},
    data() {
        return {
          search: '',
          filter: '',
          pagination: {
            page: 1,
            rowsPerPage: 10,
            sortBy: 'date',
            descending: true,
          },
          money: {
            decimal: '',
            thousands: ',',
            prefix: '',
            suffix: '',
            precision: 0,
            masked: false
          },
          add_new: false,
          dialogEdit: false,
          dialogDelete: false,
          dialogReturn: false,
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
          products: [],
          columns: [
            { name: 'index', align: 'center', label: 'No#', field: 'index', sortable: true },
            { name: 'barcode', align: 'center', label: 'Штрих-код', field: 'barcode', sortable: true },
            { name: 'date', align: 'center', label: 'Дата', field: 'date', sortable: true },
            { name: 'name', align: 'center', label: 'Название', field: 'name', sortable: true },
            { name: 'amount', align: 'center', label: 'Кол-во', field: 'amount', sortable: true },
            { name: 'measure', align: 'center', label: 'Ед. Измерения', field: 'measure', sortable: true },
            { name: 'buyPrice', align: 'center', label: 'Цена покупки', field: 'buyPrice', sortable: true },
            { name: 'payed', align: 'center', label: 'Оплачено', field: 'payed', sortable: true },
            { name: 'unPayed', align: 'center', label: 'Неоплачено', field: 'unPayed', sortable: true },
            { name: 'about', align: 'center', label: 'Описание', field: 'about', sortable: true },
            { name: 'actions', label: 'Действия', field: '', align:'center' },
          ],
          data: [],
          itemOldName: '',
          totalReturnAmount: '',
        };
    },
    async mounted() {
      await this.refresh();
    },
    watch: {
      'item.name':{
        async handler(value){
          if((this.products.length != 0) && (this.itemOldName != value) && (this.add_new == true)){
            this.itemOldName = value
            let chosenProduct = await this.products.filter((element) => element.name == value)
            await this.GET_PRODUCTS_DETAIL_OF_PRODUCER(chosenProduct[0]._id);
            let remained = await this.totalAmountRemained

            console.log(chosenProduct[0]);

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
    computed: {
        ...mapGetters([
          'getAllProducts', 'getProductsOfCustomers', 'getProductDetailOfProducer', 'getCustomers'
        ]),
        suffixReturn(){
          if(this.item.maxAmount != 0){
            let suffix = this.item.maxAmount
            return suffix
          }else{
            return ''
          }
        },
        // buyPriceReturn(){
        //   let suffix = this.item.maxAmount.toString()
        //   return suffix
        // },
        totalAmountRemained(){
          let total_amount_remained = 0;
          for(let i = 0; i < this.getProductDetailOfProducer.length; i++){
            let amountLeft = parseInt(this.getProductDetailOfProducer[i].amountLeft);
            total_amount_remained = total_amount_remained + amountLeft
          }
          return total_amount_remained
        },
        getCustomerInfo(){
          return (this.getCustomers.filter(e => e._id == this.uid));
        },
        payedTotal(){
          let totalPayed = 0;
          for(let i = 0; i < this.getProductsOfCustomers.length; i++){
            let payed = parseInt(this.getProductsOfCustomers[i].payed.replace(/[^0-9]/g,''));
            totalPayed = totalPayed + payed
          }
          totalPayed = totalPayed.toString()
          totalPayed = totalPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          return totalPayed
        },
        unPayedTotal(){
          let totalUnPayed = 0;
          for(let i = 0; i < this.getProductsOfCustomers.length; i++){
            let unPayed = parseInt(this.getProductsOfCustomers[i].unPayed.replace(/[^0-9]/g,''));
            totalUnPayed = totalUnPayed + unPayed
          }
          totalUnPayed = totalUnPayed.toString()
          totalUnPayed = totalUnPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          return totalUnPayed
        },
        getNowDateAndTime(){
            let currentdate = new Date(); 
            let getDate = currentdate.getDate()
            let getMonth = currentdate.getMonth()+1
            let getHours = currentdate.getHours()
            let getMinutes = currentdate.getMinutes()
            
            if(getDate < 10){
              getDate = "0" + getDate
            }
            if(getMonth < 10){
              getMonth = "0" + getMonth
            }
            if(getHours < 10){
              getHours = "0" + getHours
            }
            if(getMinutes < 10){
              getMinutes = "0" + getMinutes
            }
            let datetime = getDate + "-"
                            + getMonth  + "-" 
                            + currentdate.getFullYear() + " "  
                            + getHours + ":"  
                            + getMinutes;
                            //+ currentdate.getSeconds()
            return datetime
        }
    },
    methods: {
      ...mapActions([
          'GET_ALL_PRODUCTS', 'ADD_CUSTOMER_PRODUCT', 'DELETE_PRODUCT_OF_CUSTOMERS', 'EDIT_PRODUCT_OF_CUSTOMER', 
          'FILTER_PRODUCTS_OF_PRODUCERS_BY_NAME', 'GET_PRODUCTS_OF_CUSTOMERS', 'GET_PRODUCTS_DETAIL_OF_PRODUCER',
          'RETURN_PRODUCT_OF_CUSTOMER'
      ]),
      filterFn (val, update, abort) {
          update(async () => {
              // const needle = val.toLowerCase()
              if(val.length > 2){
                this.products = await this.FILTER_PRODUCTS_OF_PRODUCERS_BY_NAME(val)
                this.options = this.products.map((element) => element.name)
              }
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
      async refresh(){
        await this.GET_PRODUCTS_OF_CUSTOMERS(this.uid);
        this.data = await this.getProductsOfCustomers

        // await this.GET_ALL_PRODUCTS();
        // this.options = await this.getAllProducts.map(element => {
        //     return element.name
        // });
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
      async addProduct() {
        let product = this.item;
        product.id = this.uid
        await this.ADD_CUSTOMER_PRODUCT(product)
        await this.refresh();
        await this.cleanItem();
      },
      async editRow(props){
        this.dialogEdit = !this.dialogEdit
        this.item = {};
        this.item = Object.assign({
          barcode: props.barcode,
          name: props.name,
          amount: props.amount,
          measure: props.measure,
          buyPrice: props.buyPrice,
          date: props.date,
          payed: props.payed,
          unPayed: props.unPayed,
          // sellPrice: props.sellPrice,
          about: props.about,
          pid: props._id,
          id: this.uid
        })
      },
      async editProduct(){
        await this.EDIT_PRODUCT_OF_CUSTOMER(this.item)
        await this.refresh();
        this.dialogEdit = !this.dialogEdit
        await this.cleanItem();
      },
      async returnRow(props){
        this.dialogReturn = !this.dialogReturn
        this.item = {};
        this.item = Object.assign({
          barcode: props.barcode,
          name: props.name,
          amount: 1,
          measure: props.measure,
          buyPrice: props.buyPrice,
          date: props.date,
          payed: props.payed,
          unPayed: props.unPayed,
          // sellPrice: props.sellPrice,
          about: props.about,
          returnDate: this.getNowDateAndTime,
          returnReason: '',
          status: 'Непринято',
          pid: props._id,
          ppid: props.product_id,
          cid: this.uid
        })
        this.totalReturnAmount = props.amount.toString();
      },
      async returnProduct(){
        await this.RETURN_PRODUCT_OF_CUSTOMER(this.item)
        this.dialogReturn = !this.dialogReturn
        await this.refresh();
        await this.cleanItem();
      },
      async deleteRow(props){
        this.dialogDelete = !this.dialogDelete
        this.item = {};
        this.item = Object.assign({ pid: props._id, id: this.uid})
      },
      async deleteProduct(){
        await this.DELETE_PRODUCT_OF_CUSTOMERS(this.item)
        await this.refresh();
        await this.cleanItem();        
      },
    }
};
</script>

<style scoped>
 
</style>
