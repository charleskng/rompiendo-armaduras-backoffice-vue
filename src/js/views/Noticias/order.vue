<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/noticias' }">NOTICIAS</el-breadcrumb-item>
                            <el-breadcrumb-item>ORDEN</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <draggable
                    v-model="list"
                    @end="endDraggable"
                    item-key="order"
                >
                    <template #item="{ element }">
                        <el-row class="item-box">
                            <el-col :sapn="24" class="title text-center">
                                {{ element.title }}
                            </el-col>
                            <el-col :sapn="24" class="text-center">
                                <img v-if="element.image" :src="element.image" width="100" onerror="this.src='/sistema/images/news/default.png';" />
                                <img v-else src="/sistema/images/news/default.png" width="100" />
                            </el-col>
                        </el-row>
                    </template>
                </draggable>
                
                <el-row style="margin-top:20px;">
                    <el-col :span="24" class="text-center">
                        <el-button type="primary" @click="saveOrder()">
                            Guardar Orden
                        </el-button>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { reactive, inject, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable
        },
        setup() {

            // router
            const router = useRouter()

            // store
            const appStore = useAppStore()

            // plugins
            const log = inject('log')
            const request = inject('request')

            // state
            let list = reactive([])

            // actions
            const requestForum = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/news',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
    
                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el listado de noticias, intente nuevamente por favor')
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
                
                list.length = 0
                if(response.data.list !== null) {
                    list.push(...response.data.list)
                }
                
                // Update data and hide loading
                loading.close()
            }

            const endDraggable = (evt) => {
                let old_item = list[evt.oldIndex]
                let new_item = list[evt.newIndex]

                let list_arr = [...list]
                list_arr[evt.oldIndex] = new_item
                list_arr[evt.newIndex] = old_item

                for(let index in list_arr) {
                    list_arr[index].order = Number(index) + 1
                }
                
                list.length = 0
                list.push(...list_arr)
            }

            const saveOrder = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // validate data
                let error = null
                let order_list = []

                for(let index in list) {
                    let item = list[index]

                    order_list.push({
                        id: item.id, 
                        order: Number(index) + 1
                    })
                }
                
                // request order
                let response = await request.send({
                    method: 'POST',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/news/order',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }, 
                    body: {
                        list: order_list
                    }
                })
                
                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado actualizar el orden del listado, intente nuevamente por favor')
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

                // show success message
                ElMessage.success('Se ha actualizado el listado exitosamente')

                // request error
                if(error) {
                    ElMessage.error(error)
                }
                
                // Hide loading and refresh data
                loading.close()
                requestForum()
            }
            
            // request food group
            onMounted(() => {
                requestForum()
            })

            // return component
            return {
                // state
                list, 
                // actions
                endDraggable, 
                saveOrder, 
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

        .item-box {
            border: solid 1px rgba(23,23,23,0.2);
            padding: 10px;
        }

        .title {
            color: $primary-color;
            font-family: Bold;
            text-align: center;
            margin-bottom: 20px;
        }
    }
</style>
