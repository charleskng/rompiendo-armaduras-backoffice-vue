import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
    // State
    state: () => {
        return {
            profile: null,
            user: null,
            session: null,
            menu_open: false
        }
    },
    // Getters
    getters: {
        hasSession: (state) => {
            return state.session !== null
        }
    },
    // Actions
    actions: {
        setSession(user = null, profile = null, session = null) {
            this.user = user
            this.profile = profile
            this.session = session
        },
        toggleMenu() {
            this.menu_open = !this.menu_open
        },
        openMenu() {
            this.menu_open = true
        },
        closeMenu() {
            this.menu_open = false
        },
        async logout(request) {
            // when no session is found
            if (this.session == null) {
                // redirect to home
                document.location.href = "/sistema/"
                
                // reset session
                this.user = null
                this.profile = null
                this.session = null
                this.menu_open = false
            }

            // send logout request
            try {
                await request.send({
                    method: 'POST',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/logout`,
                    headers: {
                        'content-type': 'application/json',
                        'session': this.session,
                    },
                })
            }
            catch (err) {
                if (import.meta.env.VITE_DEBUG) {
                    console.error('Cannot send logout request')
                }
            }
            
            // redirect to home
            document.location.href = "/sistema/"
            
            // reset session
            this.user = null
            this.profile = null
            this.session = null
            this.menu_open = false
        }
    },
    // Persist Store
    persist: {
        enabled: true,
        strategies: [{
            key: 'app',
            storage: localStorage
        }]
    }
})
