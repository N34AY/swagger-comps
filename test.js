const swagger = require('./index.js')

async function run() {
    await swagger.init()
    await swagger.compile()
}

run()