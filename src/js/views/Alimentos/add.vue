<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/alimentos' }">ALIMENTOS</el-breadcrumb-item>
                            <el-breadcrumb-item>AGREGAR</el-breadcrumb-item>
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
                    <el-form-item label="Grupo Alimenticio">
                        <el-select
                            v-model="form.group_id"
                            placeholder="Seleccione Grupo Alimenticio"
                            style="width: 100%;"
                        >
                            <el-option
                                v-for="group in food_group"
                                :key="`group_${group.id}`"
                                :label="group.name"
                                :value="group.id"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Nombre del alimento">
                        <el-input v-model="form.name" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Cantidad">
                        <el-input v-model="form.quantity" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Unidad">
                        <el-input v-model="form.unity" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Peso Bruto (g)">
                        <el-input v-model="form.gross_weight" type="number" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Peso Neto (g)">
                        <el-input v-model="form.net_weight" type="number" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Energía (kcal)">
                        <el-input v-model="form.energy" type="number" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Proteína (g)">
                        <el-input v-model="form.protein" type="number" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Lipidos (g)">
                        <el-input v-model="form.lipids" type="number" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Hidratos de carbono (g)">
                        <el-input v-model="form.carbohydrates" type="number" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Sodio (mg)">
                        <el-input v-model="form.sodium" type="number" />
                    </el-form-item>

                    <el-form-item label="Azúcar por equivalente">
                        <el-input v-model="form.sugar_equivalents" type="number" />
                    </el-form-item>

                    <el-form-item label="Índice glicérmico">
                        <el-input v-model="form.glycermic_index" type="number" />
                    </el-form-item>

                    <el-form-item label="Carga glicérmica">
                        <el-input v-model="form.glycermic_load" type="number" />
                    </el-form-item>

                    <el-form-item label="AG Saturados (g)">
                        <el-input v-model="form.saturated_fatty_acids" type="number" />
                    </el-form-item>

                    <el-form-item label="AG Monoinsatudos (g)">
                        <el-input v-model="form.monounsaturated_fatty_acids" type="number" />
                    </el-form-item>

                    <el-form-item label="AG Poliinsaturadas (g)">
                        <el-input v-model="form.polyunsaturated_fatty_acids" type="number" />
                    </el-form-item>

                    <el-form-item label="Colesterol (mg)">
                        <el-input v-model="form.cholesterol" type="number" />
                    </el-form-item>

                    <el-form-item label="Vitamína A (ug RE)">
                        <el-input v-model="form.vitamin_a" type="number" />
                    </el-form-item>

                    <el-form-item label="Calcio (mg)">
                        <el-input v-model="form.calcium" type="number" />
                    </el-form-item>

                    <el-form-item label="Hierro NO HEM (mg)">
                        <el-input v-model="form.non_heme_iron" type="number" />
                    </el-form-item>

                    <el-form-item label="Hierro HEM (mg)">
                        <el-input v-model="form.heme_iron" type="number" />
                    </el-form-item>

                    <el-form-item label="Selenio (mg)">
                        <el-input v-model="form.selenium" type="number" />
                    </el-form-item>

                    <el-form-item label="Fósforo (mg)">
                        <el-input v-model="form.phosphorous" type="number" />
                    </el-form-item>

                    <el-form-item label="Potasio (mg)">
                        <el-input v-model="form.potassium" type="number" />
                    </el-form-item>

                    <el-form-item label="Fibras (g)">
                        <el-input v-model="form.fibers" type="number" />
                    </el-form-item>

                    <el-form-item label="Ácido Ascórbico (mg)">
                        <el-input v-model="form.ascorbic_acid" type="number" />
                    </el-form-item>

                    <el-form-item label="Ácido Fólico (ug)">
                        <el-input v-model="form.folic_acid" type="number" />
                    </el-form-item>
                </el-form>

                <el-row justify="center">
                    <el-button type="primary" @click="requestAdd()">
                        Agregar
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
            let form = reactive({
                group_id: null,
                name: '',
                quantity: '',
                unity: '',
                gross_weight: '',
                net_weight: '',
                energy: '',
                protein: '',
                lipids: '',
                carbohydrates: '',
                sodium: '',
                sugar_equivalents: '',
                glycermic_index: '',
                glycermic_load: '',
                saturated_fatty_acids: '',
                monounsaturated_fatty_acids: '',
                polyunsaturated_fatty_acids: '',
                cholesterol: '',
                vitamin_a: '',
                calcium: '',
                non_heme_iron: '',
                heme_iron: '',
                selenium: '',
                phosphorous: '',
                potassium: '',
                fibers: '',
                ascorbic_acid: '',
                folic_acid: ''
            })
            let food_group = reactive([])

            // actions
            const requestSelect = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/food/select',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el catalogo de alimentos, intente nuevamente por favor')
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

                // Update data and hide loading
                food_group.length = 0
                food_group.push(...response.data.select)
                form.group_id = null
                loading.close()
            }

            const requestAdd = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // validate form
                let error = null
                if(form.group_id == null) {
                    error = 'Seleccione un grupo alimenticio'
                }
                else if(form.name.trim() == '') {
                    error = 'Ingrese el nombre del alimento'
                }
                else if(form.quantity.trim() == '') {
                    error = 'Ingrese cantidad'
                }
                else if(form.unity.trim() == '') {
                    error = 'Ingrese unidad'
                }
                else if(form.gross_weight.trim() == '') {
                    error = 'Ingrese peso bruto'
                }
                else if(form.net_weight.trim() == '') {
                    error = 'Ingrese peso neto'
                }
                else if(form.energy.trim() == '') {
                    error = 'Ingrese cantidad de energía'
                }
                else if(form.protein.trim() == '') {
                    error = 'Ingrese cantidad de proteína'
                }
                else if(form.lipids.trim() == '') {
                    error = 'Ingrese cantidad de lípidos'
                }
                else if(form.carbohydrates.trim() == '') {
                    error = 'Ingrese cantidad de hidratos de carbono'
                }

                if(error === null) {
                    // request selector data
                    let response = await request.send({
                        method: 'POST',
                        url: import.meta.env.VITE_API_SYSTEM_URL + '/food/add',
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        },
                        body: form
                    })

                    // request error
                    if(!response.success) {
                        error = 'No se ha logrado agregar el registro a la lista de alimentos, por favor intente nuevamente'
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
                            ElMessage.success('Se ha agregado el registro al listado de alimentos')

                            router.push({
                                name: 'EditAlimentos',
                                params: {
                                    id: response.data.food_id
                                }
                            })
                        }
                    }
                }

                // request error
                if(error) {
                    ElMessage.error(error)
                }

                loading.close()
            }

            // mounted actions
            onMounted(() => {
                requestSelect()
            })
            // return component
            return {
                // state
                food_group,
                form,
                // actions
                requestAdd
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 20px;
    }

    .app-breadcrumb {
        height: 20px;
    }

</style>
