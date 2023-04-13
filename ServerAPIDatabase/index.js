const express = require('express')
const mqtt = require('mqtt')
const app = express()

// respond with "hello world" when a GET request is made to the homepage
const PORT = 3000;

app.listen(PORT, function(err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost", //host
    user: 'Huy',
    password: '12345678',
    database: 'huy'
});

connection.connect();

app.get('/query', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    connection.query('SELECT * FROM `distance` ORDER BY `id` DESC LIMIT 12', function(error, results, fields) {
        if (error) throw error;
        res.send(results)
    });
})


const host = 'localhost'
const port = '1883'
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

const topic = 'khoang cach'
client.on('connect', () => {
    console.log('Connect Success')
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
    })
})
client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
    var today = new Date();
    const mySQLDateString = today.toJSON().slice(0, 19).replace('T', ' ');
    console.log(today);
    var sql = "INSERT INTO `distance` (`Distance`, `Time`) VALUES (" + payload.toString() + ", '" + mySQLDateString + "')";
    connection.query(sql, function(error, results) {
        if (error) throw error;
        console.log("Insert Success");
    });
})