<script>
    export default {
        install: (app) => {

            const send = ({
                method,
                url,
                headers,
                query,
                body,
            }) => {
                return new Promise(async (resolve) => {
                    // Prepare options
                    method = (method === undefined || method === null) ? 'GET' : method
                    url = (url === undefined || url === null) ? '/' : url
                    headers = (headers === undefined || typeof headers !== 'object' || Array.isArray(headers))
                        ? null : headers
                    query = (query === undefined || typeof query !== 'object' || Array.isArray(query)) ? null : query
                    body = (body === undefined || typeof body !== 'object' || Array.isArray(body)) ? null : body
                    
                    console.log(`Send request [${method}] ${url} => `, {
                        headers, query, body
                    })

                    if (query !== null) {
                        query = new URLSearchParams(query)
                        url += '?' + query
                    }

                    if (body !== null) {
                        body = JSON.stringify(body)
                    }

                    try {
                        let response = await fetch(url, { method, headers, body })
                        response = await response.json()

                        console.log(`Response request [${method}] ${url} =>`, response)

                        resolve({
                            success: true,
                            response: response
                        })
                    }
                    catch (err) {
                        console.log(`Error request [${method}] ${url} =>`, err)

                        resolve({
                            success: false,
                            error: err.stack
                        })
                    }
                })
            }

            // Define plugin
            const request = {
                send
            }
            
            // Register plugin
            app.config.globalProperties.$request = request
            app.provide('request', request)
        }
    }
</script>
