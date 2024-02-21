<template>
    <div id="pathology-edit-container">
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/patologias' }">PATOLOGÍAS</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ id }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="'left'"
                >
                    <el-form-item label="Nombre de Patología">
                        <el-input v-model="form.name" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Descripción">
                        <el-input v-model="form.desc" placeholder="Requerido" type="textarea" />
                    </el-form-item>
                </el-form>

                <div
                    v-for="(foodItem, listIndex) of foodList"
                    :key="`food_group_${listIndex}`"
                    class="food-group"
                >
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <el-row>
                                    <el-col :span="16">
                                        <span>
                                            {{ foodItem.group }}
                                        </span>
                                    </el-col>

                                    <el-col 
                                        :span="8"
                                        class="text-right"
                                    >
                                        <el-button 
                                            class="button" 
                                            text
                                            @click="toggleShowGroup(listIndex)"
                                        >
                                            {{ foodItem.show ? 'Ocultar' : 'Mostrar' }}
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>

                        <el-row v-if="foodItem.show">
                            <el-col :span="24">
                                <el-button 
                                    class="button" 
                                    type="primary"
                                    @click="allAllowed(listIndex)"
                                >
                                    Todo Permitido
                                </el-button>

                                <el-button 
                                    class="button" 
                                    type="primary"
                                    @click="allOccasional(listIndex)"
                                >
                                    Todo Ocacional
                                </el-button>

                                <el-button 
                                    class="button" 
                                    type="primary"
                                    @click="allRestricted(listIndex)"
                                >
                                    Todo Restringido
                                </el-button>
                            </el-col>
                        </el-row>

                        <el-table
                            v-if="foodItem.show"
                            class="table"
                            :max-height="600"
                            :data="foodItem.list"
                            style="width: 100%"
                            border
                            stripe
                        >
                            <el-table-column
                                v-for="(item, index) of tableColumns"
                                :key="`column_${listIndex}_${index}`"
                                :prop="item.key"
                                :label="item.label"
                                :fixed="item.fixed"
                                :width="item.width"
                                :sortable="item.key === 'name' ? true : false"
                            >
                                <template #default="scope" v-if="item.key == 'allowed'">
                                    <el-checkbox
                                        v-model="scope.row.allowed"
                                        @change="changeAloweed(listIndex, scope.row.id)"
                                    />
                                </template>
                                <template #default="scope" v-if="item.key == 'occasional'">
                                    <el-checkbox
                                        v-model="scope.row.occasional"
                                        @change="changeOccasional(listIndex, scope.row.id)"
                                    />
                                </template>
                                <template #default="scope" v-if="item.key == 'restricted'">
                                    <el-checkbox
                                        v-model="scope.row.restricted"
                                        @change="changeRestricted(listIndex, scope.row.id)"
                                    />
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>

                <el-row justify="center">
                    <el-button type="primary" @click="requestEdit()">
                        Guardar Cambios
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { ref, reactive, inject, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'

    export default {
        setup() {

            // router
            const router = useRouter()
            const route = useRoute()

            // store
            const appStore = useAppStore()

            // plugins
            const log = inject('log')
            const request = inject('request')

            // state
            let foodList = reactive([])
            let tableColumns = reactive([
                {
                    key: 'name',
                    label: 'Nombre',
                },
                {
                    key: 'allowed',
                    label: 'Permitido',
                    width: 100,
                }, 
                {
                    key: 'occasional',
                    label: 'Ocacional',
                    width: 100,
                },
                {
                    key: 'restricted',
                    label: 'Restringido',
                    width: 100,
                },
            ])

            let form = reactive({
                name: '',
                desc: '',
            })

            let occasionalInitArray = ref([])
            let restrictedInitArray = ref([])
            
            // actions
            const requestInfo = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })
                
                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/pathology/${route.params.id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
                
                // request error
                if(!response.success) {
                    ElMessage.error('No se han logrado obtener los datos necesarios, intente nuevamente por favor')
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
                
                // set data and hide loading
                form.name = response.data.name
                form.desc = response.data.desc

                occasionalInitArray.value = response.data.occasional || []
                restrictedInitArray.value = response.data.restricted || []

                loading.close()
                
                // request food list
                requestFoodList()
            }

            const requestFoodList = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando listado de alimentos',
                    background: 'rgba(23, 23, 23, 0.6)'
                })
                
                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/food/select`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
                
                // request error
                if(!response.success) {
                    ElMessage.error('No se han logrado obtener los datos necesarios, intente nuevamente por favor')
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
                
                // food groups
                let foodListData = []
                for(const foodGroup of response.data.select) {
                    response = await request.send({
                        method: 'GET',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/food/list/${foodGroup.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }
                    })
                    
                    // request error
                    if(!response.success) {
                        ElMessage.error('No se han logrado obtener los datos necesarios, intente nuevamente por favor')
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
                    
                    let foodArray = []
                    for (const food of response.data.list) {
                        const occasionalStatus = occasionalInitArray.value.includes(food.id)
                        const restrictedStatus = restrictedInitArray.value.includes(food.id)

                        foodArray.push({
                            id: food.id,
                            name: food.name,
                            allowed: !occasionalStatus && !restrictedStatus,
                            occasional: occasionalStatus,
                            restricted: restrictedStatus,
                        })
                    }
                    
                    foodListData.push({
                        group: foodGroup.name,
                        show: false,
                        list: foodArray,
                    })
                }

                foodList.length = 0
                foodList.push(...foodListData)

                loading.close()
            }

            const toggleShowGroup = (listIndex) => {
                foodList[listIndex].show = !foodList[listIndex].show
            }

            const changeAloweed = (listIndex, foodId) => {
                for(const food of foodList[listIndex].list) {
                    if (food.id === foodId) {
                        food.allowed = true
                        food.occasional = false
                        food.restricted = false
                    }
                }
            }

            const changeOccasional = (listIndex, foodId) => {
                for(const food of foodList[listIndex].list) {
                    if (food.id === foodId) {
                        food.allowed = false
                        food.occasional = true
                        food.restricted = false
                    }
                }
            }

            const changeRestricted = (listIndex, foodId) => {
                for(const food of foodList[listIndex].list) {
                    if (food.id === foodId) {
                        food.allowed = false
                        food.occasional = false
                        food.restricted = true
                    }
                }
            }

            const allAllowed = (listIndex) => {
                for(const food of foodList[listIndex].list) {
                    food.allowed = true
                    food.occasional = false
                    food.restricted = false
                }
            }

            const allOccasional = (listIndex) => {
                for(const food of foodList[listIndex].list) {
                    food.allowed = false
                    food.occasional = true
                    food.restricted = false
                }
            }
            
            const allRestricted = (listIndex) => {
                for(const food of foodList[listIndex].list) {
                    food.allowed = false
                    food.occasional = false
                    food.restricted = true
                }
            }

            const requestEdit = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // validate form
                let error = null
                if(form.name.trim() == '') {
                    error = 'Ingrese el nombre del alimento'
                }
                else if(form.desc.trim() == '') {
                    error = 'Ingrese descripción'
                }

                if(error === null) {
                    const occasionalFoods = []
                    const restrictedFoods = []

                    for (const item of foodList) {
                        for (const food of item.list) {
                            if (food.occasional) {
                                occasionalFoods.push(food.id)
                            }

                            if (food.restricted) {
                                restrictedFoods.push(food.id)
                            }
                        }   
                    }

                    // request selector data
                    let response = await request.send({
                        method: 'PUT',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/pathology/${route.params.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        },
                        body: {
                            ...form,
                            occasional: occasionalFoods,
                            restricted: restrictedFoods,
                        }
                    })

                    // request error
                    if(!response.success) {
                        error = 'No se han logrado realizar cambios a la patología, por favor intente nuevamente'
                    }
                    else {
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
                        else {
                            ElMessage.success('Se han actualizado los datos exitosamente')
                        }
                    }
                }

                // request error
                if(error) {
                    ElMessage.error(error)
                }

                loading.close()
            }

            // on mounted
            onMounted(() => {
                requestInfo()
            })

            // return component
            return {
                // state
                foodList,
                tableColumns,
                form,
                id: route.params.id,
                // actions
                toggleShowGroup,
                changeAloweed,
                changeOccasional,
                changeRestricted,
                allAllowed,
                allOccasional,
                allRestricted,
                requestEdit
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 20px;
    }

    .app-breadcrumb {
        height: 20px;
    }

    .table {
        margin-top: 20px;
    }

    #pathology-edit-container {
        .food-group {
            margin-bottom: 20px;
        }
    }

</style>
