const mqtt = require('mqtt')
const host = 'localhost'
const port = '3001'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'chuyendoiso',
    password: 'chuyendoiso@2023tlus',
    reconnectPeriod: 1000,
})

export default client;