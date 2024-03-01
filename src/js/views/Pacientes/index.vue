<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item>PACIENTES</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="12" class="text-left">
                        <el-input v-model="search" placeholder="Buscar por nombre" />
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <el-button type="primary" @click="add()">
                            Agregar
                        </el-button>
                    </el-col>
                </el-row>

                <el-row>
                    <template v-for="(consultant, index) of listFilter">
                        <el-col v-if="index < max_users" :key="`consultant_${consultant.id}`" :lg="6" :md="8" :sm="12"
                            :xs="24" class="item_list">
                            <el-card class="box-card">
                                <p class="item_title">
                                    {{ consultant.first_name }}
                                    <div style="margin-top: 4px;" />
                                    {{ consultant.last_name }}
                                </p>

                                <el-row justify="center">
                                    <div class="image_container">
                                        <div class="image_content" :style="consultant.image
                                            ? `background-image: url(${consultant.image});`
                                            : ''
                                            ">
                                        </div>
                                    </div>
                                </el-row>

                                <p class="item_title">
                                    {{ consultant.membership }} ({{ consultant.active ? 'Activo' : 'Inactivo' }})
                                </p>

                                <p class="item_text">
                                    <span style="white-space: pre;">{{ consultant.main_ailment }}</span>
                                </p>

                                <el-row justify="center" style="margin-top: 10px;">
                                    <el-button type="primary" @click="profileUser(consultant.id)">
                                        Perfil
                                    </el-button>
                                </el-row>
                            </el-card>
                        </el-col>
                    </template>
                </el-row>

                <el-row style="margin-top: 10px;">
                    <el-col v-if="listFilter.length > max_users" :span="24" class="text-center"
                        style="margin-bottom: 10px;">
                        Mostrando {{ max_users }} de {{ listFilter.length }} usuarios
                    </el-col>
                    <el-col v-else :span="24" class="text-center" style="margin-bottom: 10px;">
                        Mostrando {{ listFilter.length }} de {{ listFilter.length }} usuarios
                    </el-col>

                    <el-col v-if="listFilter.length > max_users" :span="24" class="text-center">
                        <el-button type="primary" @click="increaseMax()">
                            Mostrar más usuarios
                        </el-button>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { ref, reactive, inject, watch, onMounted, computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
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
            let list = reactive([])
            let search = ref('')
            let max_users = ref(12)

            // computed
            const listFilter = computed(() => {
                let _search = search.value.trim().toLowerCase()

                if (_search !== '') {
                    return list.filter(function (item) {
                        return (item.first_name.toLowerCase().includes(_search) || item.last_name.toLowerCase().includes(_search))
                    })
                }

                return list
            })

            // actions
            const add = async () => {
                router.push({
                    name: 'AddPacientes'
                })
            }

            const profileUser = async (id) => {
                router.push({
                    name: 'ViewPacientes',
                    params: {
                        id: id
                    }
                })
            }
            
            const requestConsultants = async () => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_CONSULTANT_URL + '/user',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
                
                // request error
                if (!response.success) {
                    ElMessage.error('No se ha logrado obtener el listado de pacientes, intente nuevamente por favor')
                    loading.close()
                    return
                }
                response = response.response

                // request failed
                if (!response.success) {
                    log.error('API error => ', response.error)
                    
                    if (response.error == 'wrong_session') {
                        ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                        appStore.logout(request)
                    }

                    loading.close()
                    return
                }

                list.length = 0
                if (response.data.list !== null) {
                    response.data.list.forEach((consultant) => {
                        consultant.image = `${import.meta.env.VITE_STORAGE}${
                            consultant.image || '/sistema/images/consultant/default.png'
                        }`
                    })
                    
                    list.push(...response.data.list)
                }

                // Update data and hide loading
                loading.close()
            }

            const increaseMax = () => {
                max_users.value += 12
            }

            // watch search
            watch(search, (search, prevSearch) => {
                if (search !== prevSearch) {
                    max_users.value = 12
                }
            })

            // on mounted
            onMounted(() => {
                requestConsultants()
            })

            // return component
            return {
                // state
                list,
                search,
                max_users,
                // computed
                listFilter,
                // actions
                add,
                requestConsultants,
                profileUser,
                increaseMax
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

        .item_list {
            padding-left: 10px;
            padding-right: 10px;
            margin-top: 20px;

            .item_title {
                font-family: Bold;
                text-align: center;
                color: $primary_color;
            }

            .item_text {
                margin-top: 0px;
                margin-bottom: 0px;
                padding-bottom: 6px;

                font-family: Regular;
                text-align: center;
                color: $dark_color;
            }
        }

        .image_container {

            .image_content {
                @include coverImage("/sistema/images/consultant/default.png");

                width: 100px;
                height: 100px;
                border-radius: 50px;

                background-color: rgba(23, 23, 23, 0.2);
            }
        }
    }
</style>
