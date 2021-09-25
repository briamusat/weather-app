const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();
 
async function getData() {
  const response = await fetch ('/api');
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = `The weather here at ${item.lat} &deg;,
    ${item.lon}&deg; is ${item.climate.weather[0].main} with
    a temperature of ${Math.round(item.climate.main.temp)}&deg;
    F.`;

    if (item.aq.value < 0) {
      txt += 'No air quality reading.';
    } else {
      txt += `The concentration of particulate matter
      (${item.aq[0].measurements[2].parameter})
      is ${item.aq[0].measurements[2].value} last read on ${item.aq[0].measurements[2].lastUpdated}`
    }
    marker.bindPopup(txt);
  }
  
}