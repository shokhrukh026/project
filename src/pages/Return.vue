<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <!-- <q-btn icon="arrow_back" class="bg-white q-mr-sm" outline style="color: grey;" :to="`/producer/products/${uid}`"></q-btn> -->
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

    <!-- <div class="col-12 q-ma-sm">
      <q-list bordered separator dense class="bg-white text-green-9 text-subtitle1">
        <q-item>
          <q-item-section>
            <div>
              <span>Штрих код: </span> 
              <span class="text-black text-weight-regular">{{product.barcode}}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div>
              <span>Название: </span> 
              <span class="text-black text-weight-regular">{{product.name}}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div>
              <span>Поставщик: </span> 
              <span class="text-black text-weight-regular">{{getProducerOfProducts[0].name}}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div>
              <span>Общее кол-во возврата: </span> 
              <span class="text-black text-weight-regular">{{totalAmountRemained}} {{product.measure}}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div>
              <span>Цена продажи: </span>
              <span class="text-black text-weight-regular">{{product.sellPrice}} сум</span>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div>
              <span>Ед. измерения: </span>
              <span class="text-black text-weight-regular">{{product.measure}}</span>
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
        <q-item>
          <q-item-section>
            <div>
              <span>Описание: </span>
              <span class="text-black text-weight-regular">{{product.description}}</span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div> -->

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
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div>
            <q-badge :color="props.value == 'Непринято' ? 'red' : 'green'" :label="props.value" />
          </div>
          <!-- <div class="my-table-details">
            {{ props.row.returnReason }}
          </div> -->
        </q-td>
      </template>
      <template v-slot:body-cell-returnReason="props">
        <q-td :props="props">
          <!-- <div>
            <q-badge color="red" :label="props.value" />
          </div> -->
          <div class="my-table-details">
            {{ props.row.returnReason }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat color="grey" @click="editRow(props.row)" icon="edit"></q-btn>
            <q-btn dense round flat color="grey" @click="dialogAccept = !dialogAccept" icon="library_add_check"></q-btn>
            <!-- <q-btn dense round flat color="grey" icon="info" ></q-btn>  -->
            <q-btn dense round flat color="grey" @click="deleteRow(props.row)" icon="delete"></q-btn>
          </q-td>
      </template>
    
      <template v-slot:top="props">
        <q-icon name="system_update_alt" class="text-grey-7 text-h4"></q-icon>
        <span class="text-h6 q-ml-sm text-grey-9 text-weight-bold">Возвраты</span>
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

   
    <!-- <q-dialog v-model="add_new" position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Добавление данных о товаре</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">

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
            <q-input filled v-model="item.amount" type="number" label="Кол-во" min="0" class="col-6 q-pa-sm"/>
            <q-input filled v-model.lazy="item.buyPrice" v-money="money" label="Цена покупки" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model.lazy="item.sellPrice" v-money="money" label="Цена продажи" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model.lazy="item.payed" v-money="money" label="Оплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.unPayed" label="Неоплачено" suffix="сум" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.about" label="Описание" autogrow class="col-12 q-pa-sm"/>
            
            <div class="col-12 row justify-end q-pa-sm">
              <q-btn v-close-popup @click="cleanItem" label="Отменить" color="primary"/>
              <q-btn
                @click="addProductToDB"
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


   

    <q-dialog v-model="error" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-negative text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ошибка!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Данные введены неверно!
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Ок" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->


    <q-dialog v-model="dialogEdit" position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Редактирование товара</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-input filled v-model="item.date" disable label="Дата покупки" class="col-6 q-pa-sm">
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

            <q-input filled v-model="item.returnDate" disable label="Дата возварата" class="col-6 q-pa-sm">
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
            <q-input filled v-model="item.name" disable label="Название" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.customerName" disable label="Покупатель" class="col-6 q-pa-sm"/>

            <q-input filled v-model="item.amount" type="number" label="Кол-во возврата" min="0" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.measure" label="Ед. Измерения" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.buyPrice" suffix="сум" label="Цена покупки" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.total" suffix="сум" disable label="Всего" class="col-6 q-pa-sm"/>

            <!-- <q-input filled v-model="item.payed" suffix="сум" label="Оплачено" class="col-6 q-pa-sm"/> -->
            <!-- <q-input filled v-model="item.unPayed" label="Неоплачено" suffix="сум" class="col-6 q-pa-sm"/> -->
            <q-input filled v-model="item.returnReason" label="Причина Возврата" autogrow class="col-12 q-pa-sm"/>

            
            <div class="col-12 row justify-end q-pa-sm">
              <q-btn v-close-popup @click="cleanItem" label="Отменить" color="primary"/>
              <q-btn
                @click="editProduct"
                class="q-ml-sm"
                label="Изменить"
                type="submit"
                color="green"
                :disable="item.total == '0'"
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

    <q-dialog v-model="dialogAccept" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-info text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Принять возврат?</div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Нет" v-close-popup />
          <q-btn flat label="Да" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    {{getReturnProducts}}
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {VMoney} from 'v-money'

export default {
    directives: {money: VMoney},
    data() {
        return {
          money: {
            decimal: '',
            thousands: ',',
            prefix: '',
            suffix: '',
            precision: 0,
            masked: false
          },
          search: '',
          filter: '',
          pagination: {
            page: 1,
            rowsPerPage: 10,
            sortBy: 'returnDate',
            descending: true,
          },
          add_new: false,
          dialogEdit: false,
          dialogDelete: false,
          error: false,
          dialogAccept: false,
          item: {
            date: '',
            returnDate: '',
            name: '',
            customerName: '',
            amount: 0,
            measure: '',
            buyPrice: '',
            // payed: '',
            // unPayed: '',
            total: '',
            returnReason: '',
            status: ''
          },
          columns: [
            { name: 'index', align: 'center', label: 'No#', field: 'index', sortable: true },
            { name: 'date', align: 'center', label: 'Дата покупки', field: 'date', sortable: true },
            { name: 'returnDate', align: 'center', label: 'Дата возврата', field: 'returnDate', sortable: true },
            { name: 'name', align: 'center', label: 'Название', field: 'name', sortable: true },
            { name: 'customerName', align: 'center', label: 'Покупатель', field: 'customerName', sortable: true },
            { name: 'producerName', align: 'center', label: 'Поставщик', field: 'producerName', sortable: true },
            { name: 'amount', align: 'center', label: 'Кол-во', field: 'amount', sortable: true },
            { name: 'measure', align: 'center', label: 'Ед. Измерения', field: 'measure', sortable: true },
            { name: 'buyPrice', align: 'center', label: 'Цена покупки', field: 'buyPrice', sortable: true },
            { name: 'total', align: 'center', label: 'Всего', field: 'total', sortable: true },

            // { name: 'sellPrice', align: 'center', label: 'Цена продажи', field: 'sellPrice', sortable: true },
            // { name: 'payed', align: 'center', label: 'Оплачено', field: 'payed', sortable: true },
            // { name: 'unPayed', align: 'center', label: 'Неоплачено', field: 'unPayed', sortable: true },
            { name: 'returnReason', align: 'center', label: 'Причина возврата', field: 'returnReason', sortable: true },
            { name: 'status', align: 'center', label: 'Статус', field: 'status', sortable: true },
            { name: 'actions', label: 'Действия', field: '', align:'center' },
          ],
          data: [],
        };
    },
    async mounted() {
      await this.refresh();
    },
    watch: {
      'item.buyPrice': {
        async handler(value){
          if(value != '' && this.dialogDelete != true){
            let buyPrice = this.item.buyPrice.replace(/[^0-9]/g,'');

            let total = this.item.amount * buyPrice
            total = total.toString()
            total = total.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            this.item.total = total

            buyPrice = buyPrice.toString()
            buyPrice = buyPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            this.item.buyPrice = buyPrice
          }
        },deep: true
      },
      'item.amount':{
        async handler(value){
          if(this.item.buyPrice != '' && this.dialogDelete != true){
            let buyPrice = this.item.buyPrice.replace(/[^0-9]/g,'');
            let total = value * buyPrice
            total = total.toString()
            total = total.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            this.item.total = total
          }
        },deep: true
      },
    },
    computed: {
        ...mapGetters([
          'getReturnProducts', 'getCustomers', 'getProducers'
        ]),
        // totalAmountRemained(){
        //   let total_amount_remained = 0;
        //   for(let i = 0; i < this.getProductDetailOfProducer.length; i++){
        //     let amountLeft = parseInt(this.getProductDetailOfProducer[i].amountLeft);
        //     total_amount_remained = total_amount_remained + amountLeft
        //   }
        //   return total_amount_remained
        // },
        // payedTotal(){
        //   let totalPayed = 0;
        //   for(let i = 0; i < this.getProductDetailOfProducer.length; i++){
        //     let payed = parseInt(this.getProductDetailOfProducer[i].payed.replace(/[^0-9]/g,''));
        //     totalPayed = totalPayed + payed
        //   }
        //   totalPayed = totalPayed.toString()
        //   totalPayed = totalPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        //   return totalPayed
        // },
        // unPayedTotal(){
        //   let totalUnPayed = 0;
        //   for(let i = 0; i < this.getProductDetailOfProducer.length; i++){
        //     let unPayed = parseInt(this.getProductDetailOfProducer[i].unPayed.replace(/[^0-9]/g,''));
        //     totalUnPayed = totalUnPayed + unPayed
        //   }
        //   totalUnPayed = totalUnPayed.toString()
        //   totalUnPayed = totalUnPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        //   return totalUnPayed
        // },

        // getCustomerOfProducts(){
        //   console.log(state.customers);
        //   let customer = state.customers.filter(e => e._id == element.cid)
        //   console.log(customer);
        //   return (this.getCustomers.filter(e => e._id == this.cid));
        // }
        
    },
    methods: {
      ...mapActions([
          'GET_RETURN_PRODUCTS', 'ADD_PRODUCER_PRODUCT_DETAIL', 'DELETE_RETURNED_PRODUCT', 'EDIT_RETURNED_PRODUCT', 
          'GET_CUSTOMERS', 'GET_PRODUCERS'
      ]),
      async refresh(){
        await this.GET_RETURN_PRODUCTS();
        if(this.getCustomers.length == 0){
          await this.GET_CUSTOMERS();
        }
        if(this.getProducers.length == 0){
          await this.GET_PRODUCERS();
        }
        this.data = await this.getReturnProducts
        let customer, producer; 
        let buyPrice;
        this.data.forEach((element, index) => {
          customer = this.getCustomers.filter(e => e._id == element.cid)
          if(customer.length != 0){
            element.customerName = customer[0].name 
          }

          //get producerName
          for(let i = 0; i < this.getProducers.length; i++){
            producer = this.getProducers[i].productArr.filter(e => e == element.ppid)
            if(producer.length != 0){
              element.producerName = this.getProducers[i].name
            }
          }

          buyPrice = parseInt(element.buyPrice.replace(/[^0-9]/g,''));
          element.total = element.amount * buyPrice
          element.total = element.total.toString()
          element.total = element.total.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        });
      },
      // dialogInputsChange(){
      //     let buyPrice = this.item.buyPrice.replace(/[^0-9]/g,'');
      //     let payed = this.item.payed.replace(/[^0-9]/g,'');
      //     this.item.total = buyPrice * this.item.amount
      //     this.item.unPayed = (this.item.total - payed)
      //     let unPayed = this.item.unPayed
      //     unPayed = unPayed.toString()
      //     unPayed = unPayed.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      //     this.item.unPayed = unPayed
      // },
      cleanItem(){
        this.item = Object.assign({
          date: '',
          returnDate: '',
          name: '',
          customerName: '',
          amount: 0,
          measure: '',
          buyPrice: '',
          // payed: '',
          // unPayed: '',
          total: '',
          returnReason: '',
          status: ''
         })
      },
      // async addProductToDB() {
      //   if(this.item.date == '' || this.item.amount == 0 || this.item.buyPrice == '' || //this.item.sellPrice == ''
      //     this.item.payed == '' || this.item.unPayed == ''){
      //     this.error = !this.error
      //   }else{
      //     let payed = this.item.payed.replace(/[^0-9]/g,'');
      //     if((payed < this.item.total)){
      //       let product = this.item;
      //       product.product_id = this.product._id
      //       await this.ADD_PRODUCER_PRODUCT_DETAIL(product)
      //       await this.refresh();
      //       await this.cleanItem();
      //     }else{
      //       this.error = !this.error
      //     }
      //   }
      // },
      async editRow(props){
        this.dialogEdit = !this.dialogEdit
        await this.cleanItem();
        this.item = Object.assign({
          date: props.date,
          returnDate: props.returnDate,
          name: props.name,
          customerName: props.customerName,
          amount: props.amount,
          measure: props.measure,
          buyPrice: props.buyPrice,
          returnReason: props.returnReason,
          // payed: '',
          // unPayed: '',
          total: props.total,
          status: props.status,
          id: props._id,
        })
      },
      async editProduct(){
        await this.EDIT_RETURNED_PRODUCT(this.item)
        await this.refresh();
        this.dialogEdit = !this.dialogEdit
      },
      async deleteRow(props){
        this.dialogDelete = !this.dialogDelete
        this.item = {};
        this.item = Object.assign({ id: props._id})
      },
      async deleteProduct(){
        await this.DELETE_RETURNED_PRODUCT(this.item)
        await this.refresh();
        await this.cleanItem();
      },
    }
};
</script>

<style scoped>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
