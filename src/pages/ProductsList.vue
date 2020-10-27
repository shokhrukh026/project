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
      
      :rows-per-page-options="[0]"
      :pagination="pagination"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber"
      >
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat color="grey" @click="editRow(props)" icon="edit"></q-btn>
            <q-btn dense round flat color="grey" @click="deleteRow(props)" icon="delete"></q-btn>
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
            <q-input filled v-model="item.barcode" type="number" label="Штрих код" class="col-12 q-pa-sm"/>
            <q-input filled v-model="item.name" label="Название" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.amount" type="number" label="Кол-во" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.buyPrice" type="number" label="Цена покупки" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.sellPrice" type="number" label="Цена продажи" class="col-6 q-pa-sm"/>
            <q-input filled v-model="item.description" label="Описание" autogrow class="col-12 q-pa-sm"/>

            
            <div class="col-12 row justify-end q-pa-sm">
              <q-btn @click="add_new=!add_new" label="Отменить" color="primary"/>
              <q-btn
                @click="addProductToDB"
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
    {{getProducts}}
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
          search: '',
          filter: '',
          label: 'hello',
          pagination: {
            page: 1,
            rowsPerPage: 5
          },
          add_new: false,
          item: {barcode: null, name: '', amount: null, buyPrice: null, sellPrice: null, description: ''},
          columns: [
            { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
            { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
            { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
            { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
            { name: 'protein', label: 'Protein (g)', field: 'protein' },
            { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
            { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
            { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
            { name: 'actions', label: 'Действия', field: '', align:'center' },
          ],
          data: [
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: '14%', iron: '1%'},
            
          ],
            
        };
    },
    async mounted() {
      await this.GET_PRODUCTS();
    },
    computed: {
        ...mapGetters([
          'getProducts'
        ])
    },
    methods: {
      ...mapActions([
          'GET_PRODUCTS'
      ]),
      async addProductToDB() {
          // await this.$store.dispatch('ADD_PRODUCT');
      },
    }
};
</script>

<style scoped>
 
</style>
