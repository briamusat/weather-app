const fetch = require ('node-fetch');
const express = require ('express');
const Datastore = require('nedb');
require('dotenv').config();

//console.log(process.env);

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.json(data);
    });
   
})

app.post('/api', (req, res) => {
    console.log("I got a request!");
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json(data);
});

app.get('/weather/:latlon', async (req, res) => {
    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${api_key}`;
    const weather_response = await fetch(api_url);
    const weather_data = await weather_response.json();


    const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        climate: weather_data,
        aq: aq_data
    };
    res.json(data);
  
});