<template>
  <q-page>
    <div class="row">
      {{characters}}hello
      <div class="col-12 row items-center">
        <div class="row q-ma-sm col-8">
        <q-input outlined v-model="text" class="bg-white col-6" dense label="Штрих-код" />
          <q-btn
            v-if="$q.screen.gt.xs"
            outline
            color="green"
            label="Добавить"
            class="q-ml-xs bg-white text-weight-bold"
            @click="add_new = true"
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
      <div class="q-pa-xs column-background">
        <q-item style="background-color: #5e5e5e;border-top-left-radius: 4px;border-top-right-radius: 4px;"
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
        </q-item>
        <draggable
          class="list-group"
          :list="task_list"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <q-list v-for="(element, index) in task_list" :key="index" bordered class="rounded-borders cursor-move"
                  :class="task_class[element.type]">
            <q-item class="bg-white">
              <q-item-section avatar>
                <q-icon :name="task_icon[element.type]" color="black" size="34px"/>
              </q-item-section>

              <q-item-section style="font-size: 18px;" class="text-grey-9">
                {{element.task_title}}
              </q-item-section>

              <q-item-section class="col-1">
                <q-avatar size="md">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png"/>
                </q-avatar>
              </q-item-section>
              <q-item-section class="col-2">
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
              </q-item-section>

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
              </q-item-section>
            </q-item>
          </q-list>
        </draggable>
      </div>
    </div>
    <q-dialog v-model="add_new" position="left">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Покупка</div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="row items-center no-wrap">
          <q-form class="q-gutter-md full-width">
            <q-input filled v-model="task_item.task_title" label="First Name" class="q-ml-none"/>

            <q-input filled v-model="task_item.task_type" label="Last Name" class="q-ml-none"/>

            <div class="text-right">
              <q-btn @click="add_new=false" label="Cancel" type="submit" color="primary"/>
              <q-btn
                @click="addNewTask"
                style="width: 90px"
                class="q-ml-sm"
                label="Add"
                type="submit"
                color="green"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
    import Vue from "vue";
    import draggable from "vuedraggable";
    import {Notify} from "quasar";

    Vue.component("draggable", draggable);

    export default {
        name: "PageIndex",
        data() {
            return {
                search: "",
                task_index: {
                    to_do_index: null,
                    in_progress_index: null,
                    test_index: null,
                    done_index: null
                },
                task_item: {
                    task_title: "Task Name",
                    task_type: "feature",
                    id: null
                },
                add_new: false,
                drag: false,
                task_list: [],
                task_to_do: [
                    {
                        task_title: "Develop the add new call feature",
                        task_type: "feature",
                        id: 1,
                        tags: [
                            {name: "css", color: "yellow"},
                            {name: "html", color: "pink"}
                        ],
                        due_date: '20 Jan, 2020'
                    },
                ],
                task_in_progress: [
                    {
                        task_title: "Fix upgrade issues",
                        task_type: "bug",
                        id: 5,
                        tags: [
                            {name: "api", color: "teal"},
                            {name: "html", color: "pink"}
                        ],
                        due_date: '12 Dec, 2019'
                    },
                ],
                task_test: [
                    {
                        task_title: "Test project upgrade version",
                        task_type: "feature",
                        id: 5,
                        tags: [{name: "api", color: "teal"}],
                        due_date: '05 Mar, 2019'
                    },
                ],
                task_done: [
                    {
                        task_title: "Handle new user API",
                        task_type: "feature",
                        id: 5,
                        tags: [
                            {name: "api", color: "teal"},
                            {name: "html", color: "pink"},
                            {name: "css", color: "yellow"}
                        ],
                        due_date: '31 Mar, 2020'
                    },
                ],
                task_class: {
                    to_do: 'border-todo',
                    in_progress: 'border-in-progress',
                    test: 'border-test',
                    done: 'border-done'
                },
                task_icon: {
                    to_do: 'view_list',
                    in_progress: 'sync',
                    test: 'compare_arrows',
                    done: 'las la-check-circle'
                },
            };
        },
        created() {
            this.load_tasks();
        },
        apollo:{
          characters: gql`
            query getCharacters{
              characters{
                id
                name
              }
            }
          `
        },
        async mounted(){
          
          // this.$axios.get('http://localhost:4000/')
          // .then((response) => {
          //   console.log(response);
          // })
          // .catch(() => {
          //   this.$q.notify({
          //     color: 'negative',
          //     position: 'top',
          //     message: 'Loading failed',
          //     icon: 'report_problem'
          //   })
          // })

        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            },
        },
        methods: {
            addNewTask() {
                let max_id = Math.max.apply(
                    Math,
                    this.task_to_do.map(function (o) {
                        return o.id;
                    })
                );
                this.task_item.id = max_id + 1;
                this.task_item.type = "to_do";
                this.task_list.push(this.task_item);
                this.add_new = false;
                this.task_item = {};
                this.$q.notify({
                    type: "positive",
                    message: `The new task is added successfully.`
                });
            },
            deleteTask(task_lane, index) {
                this[task_lane].splice(index, 1);
            },
            load_tasks() {
                let self = this;
                let inner_tasks = [];
                self.task_to_do.filter(function (item) {
                    item.type = "to_do";
                    return item;
                });
                self.task_in_progress.filter(function (item) {
                    item.type = "in_progress";
                    return item;
                });
                self.task_test.filter(function (item) {
                    item.type = "test";
                    return item;
                });
                self.task_done.filter(function (item) {
                    item.type = "done";
                    return item;
                });
                self.task_list = JSON.parse(JSON.stringify(self.task_to_do.concat(self.task_in_progress).concat(self.task_test).concat(self.task_done).sort(function () {
                    return 0.5 - Math.random()
                })));
            }
        }
    };
</script>

<style scoped>
  .button {
    margin-top: 35px;
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .list-group {
    min-height: 100vh;
  }

  .list-group-item {
    cursor: move;
  }

  .list-group-item i {
    cursor: pointer;
  }

  .cursor-move {
    cursor: move;
  }

  .border-todo {
    border-left: 5px solid #2fbb91 !important;
  }

  .feature-to-do {
    background-color: #2fbb91;
  }

  .to-do-title {
    background-color: rgb(47, 187, 145);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .border-in-progress {
    border-left: 5px solid #ee9835 !important;
  }

  .feature-in-progress {
    background-color: #ee9835;
  }

  .in-progress-title {
    background-color: #ee9835;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .border-test {
    border-left: 5px solid blueviolet !important;
  }

  .feature-test {
    background-color: blueviolet;
  }

  .test-title {
    background-color: blueviolet;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .border-done {
    border-left: 5px solid green !important;
  }

  .feature-done {
    background-color: green;
  }

  .done-title {
    background-color: green;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .to-do-title {
    background-color: rgb(47, 187, 145);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .bottom-right-radius {
    border-bottom-right-radius: 4px !important;
  }

  .tag-badge {
    border: 1px solid currentColor !important;
    border-radius: 4px !important;
  }

  .bug {
    background-color: red;
  }

  .box-shadow:hover {
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14),
    0 1px 10px rgba(0, 0, 0, 0.12) !important;
  }
</style>
