<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/pacientes' }">PACIENTES</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: `/pacientes/ver/${ id }` }">{{ id }}</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: `/pacientes/plan_nutricional/${ id }` }">PLAN NUTRICIONAL</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ plan_id }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <!-- Plan Nutricional -->
                <el-row>
                    <el-col :span="24" class="title">
                        Plan Nutricional
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="screen.width <= 576 ? 'top' : 'left'"
                >
                    <el-row>
                        <el-col :span="24">
                            <el-select
                                v-model="plan_selected"
                                placeholder="Plan Alimenticio Predefinido"
                                style="width: 100%;"
                            >
                                <el-option
                                    v-for="plan in planes"
                                    :key="`plan_${plan.id}`"
                                    :label="plan.name"
                                    :value="plan.id"
                                />
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form>

                <el-divider />

                <el-tabs v-model="tab_food">
                    <!-- Desayuno -->
                    <el-tab-pane label="Desayuno" name="breakfast">
                        <el-row>
                            <el-col :span="24" class="title">
                                Desayuno
                            </el-col>
                        </el-row>
                        
                        <el-form
                            :model="breakfast_form"
                            label-width="200px"
                            :label-position="screen.width <= 576 ? 'top' : 'left'"
                        >
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="Grupo Alimenticio">
                                        <el-select
                                            v-model="breakfast_form.group_id"
                                            placeholder="Seleccione Grupo Alimenticio"
                                            style="width: 100%;"
                                        >
                                            <el-option
                                                v-for="group in food_group"
                                                :key="`group_${group.group_id}`"
                                                :label="group.group_name"
                                                :value="group.group_id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" style="padding-left: 10px;">
                                    <el-form-item label="Cantidad">
                                        <el-input v-model="breakfast_form.quantity" placeholder="Requerido" type="number" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                        <el-row justify="center">
                            <el-button type="primary" @click="addBreakfast()">
                                Agregar a Desayuno
                            </el-button>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-table
                                    class="table"
                                    :max-height="600"
                                    :data="breakfast_info"
                                    style="width: 100%"
                                    border
                                    stripe
                                >
                                    <el-table-column
                                        v-for="(item, index) of table_columns"
                                        :key="`column_${index}`"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.min_width"
                                        :sortable="item.key != 'actions' ? true : false"
                                    >
                                        <template #default="scope" v-if="item.key == 'actions'">
                                            <div class="table-icon cursor-pointer" v-if="scope.$index !== breakfast_info.length - 1">
                                                <box-icon name='trash' color='#760000' @click="removeBreakfast(scope.row.group_id)"></box-icon>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <!-- Medio Día -->
                    <el-tab-pane label="Medio Día" name="morning_snack">
                        <el-row>
                            <el-col :span="24" class="title">
                                Medio Día
                            </el-col>
                        </el-row>

                        <el-form
                            :model="morning_snack_form"
                            label-width="200px"
                            :label-position="screen.width <= 576 ? 'top' : 'left'"
                        >
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="Grupo Alimenticio">
                                        <el-select
                                            v-model="morning_snack_form.group_id"
                                            placeholder="Seleccione Grupo Alimenticio"
                                            style="width: 100%;"
                                        >
                                            <el-option
                                                v-for="group in food_group"
                                                :key="`group_${group.group_id}`"
                                                :label="group.group_name"
                                                :value="group.group_id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" style="padding-left: 10px;">
                                    <el-form-item label="Cantidad">
                                        <el-input v-model="morning_snack_form.quantity" placeholder="Requerido" type="number" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                        <el-row justify="center">
                            <el-button type="primary" @click="addMorningSnack()">
                                Agregar a Medio Día
                            </el-button>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-table
                                    class="table"
                                    :max-height="600"
                                    :data="morning_snack_info"
                                    style="width: 100%"
                                    border
                                    stripe
                                >
                                    <el-table-column
                                        v-for="(item, index) of table_columns"
                                        :key="`column_${index}`"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.min_width"
                                        :sortable="item.key != 'actions' ? true : false"
                                    >
                                        <template #default="scope" v-if="item.key == 'actions'">
                                            <div class="table-icon cursor-pointer" v-if="scope.$index !== morning_snack_info.length - 1">
                                                <box-icon name='trash' color='#760000' @click="removeMorningSnack(scope.row.group_id)"></box-icon>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <!-- Comida -->
                    <el-tab-pane label="Comida" name="lunch">
                        <el-row>
                            <el-col :span="24" class="title">
                                Comida
                            </el-col>
                        </el-row>

                        <el-form
                            :model="lunch_form"
                            label-width="200px"
                            :label-position="screen.width <= 576 ? 'top' : 'left'"
                        >
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="Grupo Alimenticio">
                                        <el-select
                                            v-model="lunch_form.group_id"
                                            placeholder="Seleccione Grupo Alimenticio"
                                            style="width: 100%;"
                                        >
                                            <el-option
                                                v-for="group in food_group"
                                                :key="`group_${group.group_id}`"
                                                :label="group.group_name"
                                                :value="group.group_id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" style="padding-left: 10px;">
                                    <el-form-item label="Cantidad">
                                        <el-input v-model="lunch_form.quantity" placeholder="Requerido" type="number" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                        <el-row justify="center">
                            <el-button type="primary" @click="addLunch()">
                                Agregar a Comida
                            </el-button>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-table
                                    class="table"
                                    :max-height="600"
                                    :data="lunch_info"
                                    style="width: 100%"
                                    border
                                    stripe
                                >
                                    <el-table-column
                                        v-for="(item, index) of table_columns"
                                        :key="`column_${index}`"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.min_width"
                                        :sortable="item.key != 'actions' ? true : false"
                                    >
                                        <template #default="scope" v-if="item.key == 'actions'">
                                            <div class="table-icon cursor-pointer" v-if="scope.$index !== lunch_info.length - 1">
                                                <box-icon name='trash' color='#760000' @click="removeLunch(scope.row.group_id)"></box-icon>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <!-- Media Tarde -->
                    <el-tab-pane label="Media Tarde" name="afternoon_snack">
                        <el-row>
                            <el-col :span="24" class="title">
                                Media Tarde
                            </el-col>
                        </el-row>

                        <el-form
                            :model="afternoon_snack_form"
                            label-width="200px"
                            :label-position="screen.width <= 576 ? 'top' : 'left'"
                        >
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="Grupo Alimenticio">
                                        <el-select
                                            v-model="afternoon_snack_form.group_id"
                                            placeholder="Seleccione Grupo Alimenticio"
                                            style="width: 100%;"
                                        >
                                            <el-option
                                                v-for="group in food_group"
                                                :key="`group_${group.group_id}`"
                                                :label="group.group_name"
                                                :value="group.group_id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" style="padding-left: 10px;">
                                    <el-form-item label="Cantidad">
                                        <el-input v-model="afternoon_snack_form.quantity" placeholder="Requerido" type="number" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        
                        <el-row justify="center">
                            <el-button type="primary" @click="addAfternoonSnack()">
                                Agregar a Media Tarde
                            </el-button>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-table
                                    class="table"
                                    :max-height="600"
                                    :data="afternoon_snack_info"
                                    style="width: 100%"
                                    border
                                    stripe
                                >
                                    <el-table-column
                                        v-for="(item, index) of table_columns"
                                        :key="`column_${index}`"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.min_width"
                                        :sortable="item.key != 'actions' ? true : false"
                                    >
                                        <template #default="scope" v-if="item.key == 'actions'">
                                            <div class="table-icon cursor-pointer" v-if="scope.$index !== afternoon_snack_info.length - 1">
                                                <box-icon name='trash' color='#760000' @click="removeAfternoonSnack(scope.row.group_id)"></box-icon>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <!-- Cena -->
                    <el-tab-pane label="Cena" name="dinner">
                        <el-row>
                            <el-col :span="24" class="title">
                                Cena
                            </el-col>
                        </el-row>

                        <el-form
                            :model="dinner_form"
                            label-width="200px"
                            :label-position="screen.width <= 576 ? 'top' : 'left'"
                        >
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="Grupo Alimenticio">
                                        <el-select
                                            v-model="dinner_form.group_id"
                                            placeholder="Seleccione Grupo Alimenticio"
                                            style="width: 100%;"
                                        >
                                            <el-option
                                                v-for="group in food_group"
                                                :key="`group_${group.group_id}`"
                                                :label="group.group_name"
                                                :value="group.group_id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" style="padding-left: 10px;">
                                    <el-form-item label="Cantidad">
                                        <el-input v-model="dinner_form.quantity" placeholder="Requerido" type="number" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        
                        <el-row justify="center">
                            <el-button type="primary" @click="addDinner()">
                                Agregar a Cena
                            </el-button>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-table
                                    class="table"
                                    :max-height="600"
                                    :data="dinner_info"
                                    style="width: 100%"
                                    border
                                    stripe
                                >
                                    <el-table-column
                                        v-for="(item, index) of table_columns"
                                        :key="`column_${index}`"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.min_width"
                                        :sortable="item.key != 'actions' ? true : false"
                                    >
                                        <template #default="scope" v-if="item.key == 'actions'">
                                            <div class="table-icon cursor-pointer" v-if="scope.$index !== dinner_info.length - 1">
                                                <box-icon name='trash' color='#760000' @click="removeDinner(scope.row.group_id)"></box-icon>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>

                <el-divider />

                <!-- Aportación General -->
                <el-row>
                    <el-col :span="24" class="title">
                        Aportación General
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-table
                            class="table"
                            :max-height="600"
                            :data="plan_info"
                            style="width: 100%"
                            border
                            stripe
                        >
                            <el-table-column
                                v-for="(item, index) of table_columns_plan"
                                :key="`column_${index}`"
                                :prop="item.key"
                                :label="item.label"
                                :width="item.width"
                                :min-width="item.min_width"
                                :sortable="item.key != 'actions' ? true : false"
                            />
                        </el-table>
                    </el-col>
                </el-row>

                <el-row justify="center">
                    <el-button type="primary" @click="requestEdit()">
                        Editar Plan
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { ref, reactive, inject, onMounted, computed, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'
    import { useScreen } from 'vue-screen'
    
    export default {
        setup() {

            // router
            const route = useRoute()

            // store
            const appStore = useAppStore()

            // plugins
            const log = inject('log')
            const request = inject('request')

            // state
            const screen = useScreen()

            let planes = reactive([])
            let plan_selected = ref(null)

            let food_group = reactive([])
            let form = reactive({
                breakfast: [], 
                morning_snack: [], 
                lunch: [], 
                afternoon_snack: [], 
                dinner: []
            })

            let tab_food = ref('breakfast')

            let table_columns = reactive([
                {
                    key: 'group_name',
                    label: 'Grupo Alimenticio', 
                    width: 180
                }, 
                {
                    key: 'quantity',
                    label: 'Porciones', 
                    width: 120
                }, 
                {
                    key: 'actions',
                    label: 'Acciones',
                    width: 120
                },
                {
                    key: 'energy',
                    label: 'Energía',
                    min_width: 100, 
                }, 
                {
                    key: 'protein',
                    label: 'Proteína',
                    min_width: 120, 
                }, 
                {
                    key: 'lipids',
                    label: 'Lípidos',
                    min_width: 100, 
                }, 
                {
                    key: 'carbohydrates',
                    label: 'Hídratos de Carbono', 
                    min_width: 180, 
                }
            ])

            let table_columns_plan = reactive([
                {
                    key: 'group_name',
                    label: 'Grupo Alimenticio', 
                    width: 180
                }, 
                {
                    key: 'quantity',
                    label: 'Porciones', 
                    width: 120
                },
                {
                    key: 'energy',
                    label: 'Energía',
                    min_width: 100, 
                }, 
                {
                    key: 'protein',
                    label: 'Proteína',
                    min_width: 120, 
                }, 
                {
                    key: 'lipids',
                    label: 'Lípidos',
                    min_width: 100, 
                }, 
                {
                    key: 'carbohydrates',
                    label: 'Hídratos de Carbono', 
                    min_width: 180, 
                }
            ])

            let breakfast_form = reactive({
                group_id: null, 
                quantity: 1
            })

            let morning_snack_form = reactive({
                group_id: null, 
                quantity: 1
            })

            let lunch_form = reactive({
                group_id: null, 
                quantity: 1
            })

            let afternoon_snack_form = reactive({
                group_id: null, 
                quantity: 1
            })

            let dinner_form = reactive({
                group_id: null, 
                quantity: 1
            })

            // computed
            let breakfast_info = computed(() => {
                let table_data = []
                let summary = {
                    group_name: 'Total', 
                    quantity: '---', 
                    energy: 0, 
                    protein: 0, 
                    lipids: 0, 
                    carbohydrates: 0
                }
                
                for(let group of food_group) {
                    for(let food of form.breakfast) {
                        if(food.group_id == group.group_id) {
                            table_data.push({
                                group_id: food.group_id,
                                group_name: group.group_name, 
                                quantity: food.quantity, 
                                energy: Number(group.energy) * Number(food.quantity), 
                                protein: Number(group.protein) * Number(food.quantity), 
                                lipids: Number(group.lipids) * Number(food.quantity), 
                                carbohydrates: Number(group.carbohydrates) * Number(food.quantity),
                            })

                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }
                }

                table_data.push(summary)
                return table_data
            })

            let morning_snack_info = computed(() => {
                let table_data = []
                let summary = {
                    group_name: 'Total', 
                    quantity: '---', 
                    energy: 0, 
                    protein: 0, 
                    lipids: 0, 
                    carbohydrates: 0
                }
                
                for(let group of food_group) {
                    for(let food of form.morning_snack) {
                        if(food.group_id == group.group_id) {
                            table_data.push({
                                group_id: food.group_id,
                                group_name: group.group_name, 
                                quantity: food.quantity, 
                                energy: Number(group.energy) * Number(food.quantity), 
                                protein: Number(group.protein) * Number(food.quantity), 
                                lipids: Number(group.lipids) * Number(food.quantity), 
                                carbohydrates: Number(group.carbohydrates) * Number(food.quantity)
                            })

                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }
                }

                table_data.push(summary)
                return table_data
            })

            let lunch_info = computed(() => {
                let table_data = []
                let summary = {
                    group_name: 'Total', 
                    quantity: '---', 
                    energy: 0, 
                    protein: 0, 
                    lipids: 0, 
                    carbohydrates: 0
                }
                
                for(let group of food_group) {
                    for(let food of form.lunch) {
                        if(food.group_id == group.group_id) {
                            table_data.push({
                                group_id: food.group_id,
                                group_name: group.group_name, 
                                quantity: food.quantity, 
                                energy: Number(group.energy) * Number(food.quantity), 
                                protein: Number(group.protein) * Number(food.quantity), 
                                lipids: Number(group.lipids) * Number(food.quantity), 
                                carbohydrates: Number(group.carbohydrates) * Number(food.quantity)
                            })

                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }
                }

                table_data.push(summary)
                return table_data
            })

            let afternoon_snack_info = computed(() => {
                let table_data = []
                let summary = {
                    group_name: 'Total', 
                    quantity: '---', 
                    energy: 0, 
                    protein: 0, 
                    lipids: 0, 
                    carbohydrates: 0
                }
                
                for(let group of food_group) {
                    for(let food of form.afternoon_snack) {
                        if(food.group_id == group.group_id) {
                            table_data.push({
                                group_id: food.group_id,
                                group_name: group.group_name, 
                                quantity: food.quantity, 
                                energy: Number(group.energy) * Number(food.quantity), 
                                protein: Number(group.protein) * Number(food.quantity), 
                                lipids: Number(group.lipids) * Number(food.quantity), 
                                carbohydrates: Number(group.carbohydrates) * Number(food.quantity)
                            })

                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }
                }

                table_data.push(summary)
                return table_data
            })

            let dinner_info = computed(() => {
                let table_data = []
                let summary = {
                    group_name: 'Total', 
                    quantity: '---', 
                    energy: 0, 
                    protein: 0, 
                    lipids: 0, 
                    carbohydrates: 0
                }
                
                for(let group of food_group) {
                    for(let food of form.dinner) {
                        if(food.group_id == group.group_id) {
                            table_data.push({
                                group_id: food.group_id,
                                group_name: group.group_name, 
                                quantity: food.quantity, 
                                energy: Number(group.energy) * Number(food.quantity), 
                                protein: Number(group.protein) * Number(food.quantity), 
                                lipids: Number(group.lipids) * Number(food.quantity), 
                                carbohydrates: Number(group.carbohydrates) * Number(food.quantity)
                            })

                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }
                }

                table_data.push(summary)
                return table_data
            })

            let plan_info = computed(() => {
                let table_data = []

                let summary = {
                    group_name: 'Total', 
                    quantity: '---', 
                    energy: 0, 
                    protein: 0, 
                    lipids: 0, 
                    carbohydrates: 0
                }
                
                for(let group of food_group) {
                    let data = {
                        group_name: group.group_name, 
                        quantity: 0, 
                        energy: 0, 
                        protein: 0, 
                        lipids: 0, 
                        carbohydrates: 0
                    }
                    
                    for(let food of form.breakfast) {
                        if(food.group_id == group.group_id) {
                            data.quantity += food.quantity
                            data.energy += Number(group.energy) * Number(food.quantity)
                            data.protein += Number(group.protein) * Number(food.quantity)
                            data.lipids += Number(group.lipids) * Number(food.quantity)
                            data.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)

                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }

                    for(let food of form.morning_snack) {
                        if(food.group_id == group.group_id) {
                            data.quantity += food.quantity
                            data.energy += Number(group.energy) * Number(food.quantity)
                            data.protein += Number(group.protein) * Number(food.quantity)
                            data.lipids += Number(group.lipids) * Number(food.quantity)
                            data.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            
                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }

                    for(let food of form.lunch) {
                        if(food.group_id == group.group_id) {
                            data.quantity += food.quantity
                            data.energy += Number(group.energy) * Number(food.quantity)
                            data.protein += Number(group.protein) * Number(food.quantity)
                            data.lipids += Number(group.lipids) * Number(food.quantity)
                            data.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            
                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }

                    for(let food of form.afternoon_snack) {
                        if(food.group_id == group.group_id) {
                            data.quantity += food.quantity
                            data.energy += Number(group.energy) * Number(food.quantity)
                            data.protein += Number(group.protein) * Number(food.quantity)
                            data.lipids += Number(group.lipids) * Number(food.quantity)
                            data.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            
                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }

                    for(let food of form.dinner) {
                        if(food.group_id == group.group_id) {
                            data.quantity += food.quantity
                            data.energy += Number(group.energy) * Number(food.quantity)
                            data.protein += Number(group.protein) * Number(food.quantity)
                            data.lipids += Number(group.lipids) * Number(food.quantity)
                            data.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            
                            summary.energy += Number(group.energy) * Number(food.quantity)
                            summary.protein += Number(group.protein) * Number(food.quantity)
                            summary.lipids += Number(group.lipids) * Number(food.quantity)
                            summary.carbohydrates += Number(group.carbohydrates) * Number(food.quantity)
                            break
                        }
                    }

                    if(data.quantity > 0) {
                        table_data.push(data)
                    }
                }

                table_data.push(summary)

                return table_data
            })

            // actions
            const requestInit = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/food_average`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener la información requerida, intente nuevamente por favor')
                    loading.close()
                    return
                }
                response = response.response

                // request failed
                if(!response.success) {
                    log.error('API error => ', response.error)

                    if(response.error == 'wrong_session') {
                        ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                        appStore.logout(request)
                    }

                    loading.close()
                    return
                }

                // set state and hide loading
                food_group.length = 0
                food_group.push(...response.data.list)

                requestPlan()
            }

            const requestPlan = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/nutritional_plan`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener la información requerida, intente nuevamente por favor')
                    loading.close()
                    return
                }
                response = response.response

                // request failed
                if(!response.success) {
                    log.error('API error => ', response.error)

                    if(response.error == 'wrong_session') {
                        ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                        appStore.logout(request)
                    }

                    loading.close()
                    return
                }

                // set state and hide loading
                planes.length = 0
                planes.push(...response.data.list)
                plan_selected.value = null

                requestCurrentPlan()
            }

            const requestCurrentPlan = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/nutritional_plan/${route.params.plan_id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener la información requerida, intente nuevamente por favor')
                    loading.close()
                    return
                }
                response = response.response

                // request failed
                if(!response.success) {
                    log.error('API error => ', response.error)

                    if(response.error == 'wrong_session') {
                        ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                        appStore.logout(request)
                    }

                    loading.close()
                    return
                }

                // set state and hide loading
                form.breakfast.length = 0
                form.morning_snack.length = 0
                form.lunch.length = 0
                form.afternoon_snack.length = 0
                form.dinner.length = 0

                if(response.data.plan.details) {
                    for(let detail of response.data.plan.details) {
                        form[detail.food_time].push({
                            group_id: detail.food_group_id, 
                            quantity: Number(detail.portions) || 0
                        })
                    }
                }

                loading.close()
            }

            // Watch Effects
            watch(plan_selected, async(new_plan_id, prev_plan_id) => {

                if(new_plan_id !== null) {
                    // show loading
                    const loading = ElLoading.service({
                        lock: true,
                        text: 'Actualizando información',
                        background: 'rgba(23, 23, 23, 0.6)'
                    })

                    // request selector data
                    let response = await request.send({
                        method: 'GET',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/nutritional_plan/${new_plan_id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }
                    })

                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado obtener la información requerida, intente nuevamente por favor')
                        plan_selected.value = null

                        loading.close()
                        return
                    }
                    response = response.response

                    // request failed
                    if(!response.success) {
                        log.error('API error => ', response.error)
                        plan_selected.value = null

                        if(response.error == 'wrong_session') {
                            ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                            appStore.logout(request)
                        }

                        loading.close()
                        return
                    }

                    // set state and hide loading
                    form.breakfast.length = 0
                    form.morning_snack.length = 0
                    form.lunch.length = 0
                    form.afternoon_snack.length = 0
                    form.dinner.length = 0

                    if(response.data.plan.details) {
                        for(let detail of response.data.plan.details) {
                            form[detail.food_time].push({
                                group_id: detail.food_group_id, 
                                quantity: Number(detail.portions) || 0
                            })
                        }
                    }

                    loading.close()
                }
            })

            // breakfast actions
            const addBreakfast = () => {
                // validate form
                let quantity = Number(breakfast_form.quantity) || 0

                if(breakfast_form.group_id == null) {
                    ElMessage.error('Seleccione un grupo alimenticion para agregar en el desayuno')
                    return
                }
                else if(quantity <= 0) {
                    ElMessage.error('Ingrese la cantidad de porciones a agregar en el desayuno')
                    return
                }
        
                // check group in array
                let new_food = true
                for(let food of form.breakfast) {
                    if(food.group_id == breakfast_form.group_id) {
                        new_food = false
                        food.quantity = quantity
                        break
                    }
                }

                if(new_food) {
                    form.breakfast.push({
                        group_id: breakfast_form.group_id, 
                        quantity: quantity
                    })
                }

                breakfast_form.group_id = null
                breakfast_form.quantity = 1
                plan_selected.value = null
            }

            const removeBreakfast = (groupId) => {
                const new_breakfast = [...form.breakfast]
                const index = new_breakfast.findIndex((item) => item.group_id == groupId)
                new_breakfast.splice(index, 1)
                
                form.breakfast.length = 0
                form.breakfast.push(...new_breakfast)
                plan_selected.value = null
            }

            // morning snack actions
            const addMorningSnack = () => {
                // validate form
                let quantity = Number(morning_snack_form.quantity) || 0

                if(morning_snack_form.group_id == null) {
                    ElMessage.error('Seleccione un grupo alimenticion para agregar al mediodía')
                    return
                }
                else if(quantity <= 0) {
                    ElMessage.error('Ingrese la cantidad de porciones a agregar al mediodía')
                    return
                }
        
                // check group in array
                let new_food = true
                for(let food of form.morning_snack) {
                    if(food.group_id == morning_snack_form.group_id) {
                        new_food = false
                        food.quantity = quantity
                        break
                    }
                }

                if(new_food) {
                    form.morning_snack.push({
                        group_id: morning_snack_form.group_id, 
                        quantity: quantity
                    })
                }

                morning_snack_form.group_id = null
                morning_snack_form.quantity = 1
                plan_selected.value = null
            }

            const removeMorningSnack = (groupId) => {
                const new_morning_snack = [...form.morning_snack]
                const index = new_morning_snack.findIndex((item) => item.group_id == groupId)
                new_morning_snack.splice(index, 1)

                form.morning_snack.length = 0
                form.morning_snack.push(...new_morning_snack)
                plan_selected.value = null
            }

            // lunch actions
            const addLunch = () => {
                // validate form
                let quantity = Number(lunch_form.quantity) || 0

                if(lunch_form.group_id == null) {
                    ElMessage.error('Seleccione un grupo alimenticion para agregar en la comida')
                    return
                }
                else if(quantity <= 0) {
                    ElMessage.error('Ingrese la cantidad de porciones a agregar en la comida')
                    return
                }

                // check group in array
                let new_food = true
                for(let food of form.lunch) {
                    if(food.group_id == lunch_form.group_id) {
                        new_food = false
                        food.quantity = quantity
                        break
                    }
                }
                
                if(new_food) {
                    form.lunch.push({
                        group_id: lunch_form.group_id, 
                        quantity: quantity
                    })
                }

                lunch_form.group_id = null
                lunch_form.quantity = 1
                plan_selected.value = null
            }

            const removeLunch = (groupId) => {
                const new_lunch = [...form.lunch]
                const index = new_lunch.findIndex((item) => item.group_id == groupId)
                new_lunch.splice(index, 1)

                form.lunch.length = 0
                form.lunch.push(...new_lunch)
                plan_selected.value = null
            }

            // morning snack actions
            const addAfternoonSnack = () => {
                // validate form
                let quantity = Number(afternoon_snack_form.quantity) || 0

                if(afternoon_snack_form.group_id == null) {
                    ElMessage.error('Seleccione un grupo alimenticion para agregar a media tarde')
                    return
                }
                else if(quantity <= 0) {
                    ElMessage.error('Ingrese la cantidad de porciones a agregar a media tarde')
                    return
                }
        
                // check group in array
                let new_food = true
                for(let food of form.afternoon_snack) {
                    if(food.group_id == afternoon_snack_form.group_id) {
                        new_food = false
                        food.quantity = quantity
                        break
                    }
                }

                if(new_food) {
                    form.afternoon_snack.push({
                        group_id: afternoon_snack_form.group_id, 
                        quantity: quantity
                    })
                }

                afternoon_snack_form.group_id = null
                afternoon_snack_form.quantity = 1
                plan_selected.value = null
            }

            const removeAfternoonSnack = (groupId) => {
                const new_afternoon_snack = [...form.afternoon_snack]
                const index = new_afternoon_snack.findIndex((item) => item.group_id == groupId)
                new_afternoon_snack.splice(index, 1)

                form.afternoon_snack.length = 0
                form.afternoon_snack.push(...new_afternoon_snack)
                plan_selected.value = null
            }

            // morning snack actions
            const addDinner = () => {
                // validate form
                let quantity = Number(dinner_form.quantity) || 0

                if(dinner_form.group_id == null) {
                    ElMessage.error('Seleccione un grupo alimenticion para agregar en la cena')
                    return
                }
                else if(quantity <= 0) {
                    ElMessage.error('Ingrese la cantidad de porciones a agregar en la cena')
                    return
                }

                // check group in array
                let new_food = true
                for(let food of form.dinner) {
                    if(food.group_id == dinner_form.group_id) {
                        new_food = false
                        food.quantity = quantity
                        break
                    }
                }

                if(new_food) {
                    form.dinner.push({
                        group_id: dinner_form.group_id, 
                        quantity: quantity
                    })
                }

                dinner_form.group_id = null
                dinner_form.quantity = 1
                plan_selected.value = null
            }
            
            const removeDinner = (groupId) => {
                const new_dinner = [...form.dinner]
                const index = new_dinner.findIndex((item) => item.group_id == groupId)
                new_dinner.splice(index, 1)

                form.dinner.length = 0
                form.dinner.push(...new_dinner)
                plan_selected.value = null
            }

            const requestEdit = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Agregando Plan Nutricional',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'POST',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/nutritional_plan/add`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }, 
                    body: form
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado agregar el plan nutricional, intente nuevamente por favor')
                    loading.close()
                    return
                }
                response = response.response

                // request failed
                if(!response.success) {
                    log.error('API error => ', response.error)

                    if(response.error == 'wrong_session') {
                        ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                        appStore.logout(request)
                    }

                    loading.close()
                    return
                }

                // redirect to view
                ElMessage.success('Plan nutricional agregado exitosamente')

                // Hidea loading
                loading.close()
            }

            // mounted actions
            onMounted(() => {
                requestInit()
            })

            // return component
            return {
                // state
                planes, 
                plan_selected, 
                food_group, 
                form, 
                tab_food, 
                table_columns, 
                table_columns_plan, 
                breakfast_form, 
                morning_snack_form, 
                lunch_form, 
                afternoon_snack_form, 
                dinner_form, 
                screen, 
                id: route.params.id, 
                plan_id: route.params.plan_id, 
                // computed
                breakfast_info, 
                morning_snack_info, 
                lunch_info,  
                afternoon_snack_info,  
                dinner_info, 
                plan_info, 
                // actions
                addBreakfast, 
                removeBreakfast, 
                addMorningSnack, 
                removeMorningSnack, 
                addLunch, 
                removeLunch, 
                addAfternoonSnack, 
                removeAfternoonSnack, 
                addDinner, 
                removeDinner, 
                requestEdit, 
            }
        }
    }
</script>

<style scoped lang="scss">
    // Globals SCSS
    @import '~/app.scss';
    
    .container {
        padding: 20px;

        .app-breadcrumb {
            height: 20px;
        }
    }

    .app-breadcrumb {
        height: 20px;
    }

    .title {
        color: $primary-color;
        font-family: Bold;
        text-align: center;
        margin-bottom: 20px;
        margin-top: 10px;
    }
</style>
