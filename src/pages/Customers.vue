<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-btn
          v-if="$q.screen.gt.xs"
          outline
          dense
          icon="add"
          color="green"
          label="Добавить"
          class="bg-white q-pr-sm text-weight-bold"
          @click="dialogOpen('Add')"
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
            <q-btn dense round flat color="grey" @click="dialogOpen('Edit', props)" icon="edit"></q-btn>
            <q-btn dense round flat color="grey" icon="info" :to="{ name: 'customer-products', params: { id: props.row._id }}"></q-btn> 
            
            <q-btn dense round flat color="grey" @click="dialogOpen('Delete', props)" icon="delete"></q-btn>
          </q-td>
      </template>
    
      <template v-slot:top="props">
        <q-icon name="groups" class="text-grey-7 text-h4"></q-icon>
        <!-- <svg style="width:30px;height:30px" class="text-grey-8" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 20C19 21.11 18.11 22 17 22C15.89 22 15 21.1 15 20C15 18.89 15.89 18 17 18C18.11 18 19 18.9 19 20M7 18C5.89 18 5 18.89 5 20C5 21.1 5.89 22 7 22C8.11 22 9 21.11 9 20S8.11 18 7 18M7.2 14.63L7.17 14.75C7.17 14.89 7.28 15 7.42 15H19V17H7C5.89 17 5 16.1 5 15C5 14.65 5.09 14.32 5.24 14.04L6.6 11.59L3 4H1V2H4.27L5.21 4H20C20.55 4 21 4.45 21 5C21 5.17 20.95 5.34 20.88 5.5L17.3 11.97C16.96 12.58 16.3 13 15.55 13H8.1L7.2 14.63M8.5 11H10V9H7.56L8.5 11M11 9V11H14V9H11M14 8V6H11V8H14M17.11 9H15V11H16L17.11 9M18.78 6H15V8H17.67L18.78 6M6.14 6L7.08 8H10V6H6.14Z" />
        </svg> -->
        <span class="text-h6 q-ml-sm text-grey-9 text-weight-bold">Покупатели</span>
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
   
    <q-dialog v-model="dialogAdd" position="left">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Добавить покупателя</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-input filled v-model="item.name" label="Ф.И.О." class="col-12 q-pa-sm"/>
            <q-input filled v-model="item.phone" type="number" label="Номер телефона" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.companyName" label="Название компании" class="col-6 q-pa-sm"/>

            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="dialogAdd=!dialogAdd" label="Отменить" color="primary"/>
              <q-btn
                @click="addCustomer"
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

     <q-dialog v-model="dialogEdit" position="right">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-pl-sm">Редактировать покупателя</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-form class="row full-width">
            <q-input filled v-model="item.name" label="Ф.И.О." class="col-12 q-pa-sm"/>
            <q-input filled v-model="item.phone" type="number" label="Номер телефона" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.companyName" label="Название компании" class="col-6 q-pa-sm"/>

            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="dialogEdit=!dialogEdit" label="Отменить" color="primary"/>
              <q-btn
                @click="editCustomer"
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
          <q-btn flat label="Да" v-close-popup @click="deleteCustomer"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    {{getCustomers}}
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
          search: '',
          filter: '',
          pagination: {
            page: 1,
            rowsPerPage: 5
          },
          dialogAdd: false,
          dialogEdit: false,
          dialogDelete: false,
          item: {name: '', phone: null, companyName: ''},
          columns: [
            { name: 'index', align: 'center', label: "No#", field: 'index', sortable: true },
            { name: 'name', align: 'center', label: 'Ф.И.О.', field: 'name', sortable: true },
            { name: 'phone', align: 'center', label: 'Номер телефона', field: 'phone', sortable: true,  },
            { name: 'companyName', align:'center',  label: 'Название компании', field: 'companyName', sortable: true},
            { name: 'actions', align:'center', label: 'Действия', field: '' },
          ],
          data: [],
            
        };
    },
    async mounted() {
      await this.refresh();
    },
    computed: {
        ...mapGetters([
          'getCustomers'
        ])
    },
    methods: {
      ...mapActions([
          'ADD_CUSTOMER', 'GET_CUSTOMERS', 'EDIT_CUSTOMER', 'DELETE_CUSTOMER'
      ]),
      async refresh(){
        await this.GET_CUSTOMERS();
        this.data = await this.getCustomers;
      },
      async addCustomer() {
        await this.ADD_CUSTOMER(this.item)
        await this.refresh();
        this.item = {name: '', phone: null, companyName: ''}
      },
      async editCustomer(){
        await this.EDIT_CUSTOMER(this.item)
        await this.refresh();
        this.dialogEdit = !this.dialogEdit
      },
      async deleteCustomer(){
        await this.DELETE_CUSTOMER(this.item)
        await this.refresh();
      },
      async dialogOpen(type, props){
        if(type == 'Add'){
          this.dialogAdd = !this.dialogAdd
          this.item = {name: '', phone: null, companyName: ''}
        }else if(type == 'Edit'){
          this.dialogEdit = !this.dialogEdit
          Object.assign(this.item, {name: props.row.name, phone: props.row.phone, companyName: props.row.companyName, id: props.row._id})
        }else if(type == 'Delete'){
          this.dialogDelete = !this.dialogDelete
          Object.assign(this.item, {id: props.row._id})
        }
      }
    }
};
</script>

<style scoped>
 
</style>
