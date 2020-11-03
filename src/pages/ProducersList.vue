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
            <q-btn dense round flat color="grey" icon="info" :to="{ name: 'products', params: { id: props.row._id }}"></q-btn> 
            
            <q-btn dense round flat color="grey" @click="dialogOpen('Delete', props)" icon="delete"></q-btn>
          </q-td>
      </template>
    
      <template v-slot:top="props">
        <q-icon name="local_shipping" class="text-grey-7 text-h4"></q-icon>
        <span class="text-h6 q-ml-sm text-grey-9 text-weight-bold">Поставщики</span>
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
          <div class="text-h6 text-weight-bold q-pl-sm">Добавить поставщика</div>
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
                @click="addProducer"
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
          <div class="text-h6 text-weight-bold q-pl-sm">Редактировать поставщика</div>
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
                @click="editProducer"
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
          <q-btn flat label="Да" v-close-popup @click="deleteProducer"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    {{getProducers}}
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
          'getProducers'
        ])
    },
    methods: {
      ...mapActions([
          'ADD_PRODUCER', 'GET_PRODUCERS', 'EDIT_PRODUCER', 'DELETE_PRODUCER'
      ]),
      async refresh(){
        await this.GET_PRODUCERS();
        this.data = await this.getProducers;
      },
      async addProducer() {
        await this.ADD_PRODUCER(this.item)
        await this.refresh();
        this.item = {name: '', phone: null, companyName: ''}
      },
      async editProducer(){
        await this.EDIT_PRODUCER(this.item)
        await this.refresh();
        this.dialogEdit = !this.dialogEdit
      },
      async deleteProducer(){
        await this.DELETE_PRODUCER(this.item)
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
