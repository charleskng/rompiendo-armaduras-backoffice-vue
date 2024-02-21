<script>
import moment from 'moment'

export default {
    install: (app, options) => {
        const show = options?.show || true

        const debug = (...args) => {
            if (show) {
                console.log(...args)
            }
        }

        const error = (...args) => {
            if (show) {
                console.error(...args)
            }
        }

        // Define plugin
        const log = {
            debug,
            error,
        }

        // Register plugin
        app.config.globalProperties.$log = log
        app.provide('log', log)
    }
}
</script>
