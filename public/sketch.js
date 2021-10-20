
  if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, json;
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;

      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);

      const api_url = `/weather/${lat.toFixed(4)},${lon.toFixed(4)}`;
      const response = await fetch(api_url);
      json = await response.json();
      console.log(json);

      d_climate = json.climate;
      d_aq = json.aq.results;
      document.getElementById('summary').textContent = d_climate.weather[0].main;
      document.getElementById('temperature').textContent = Math.round(d_climate.main.temp);
      document.getElementById('aq_parameter').textContent = d_aq[0].measurements[2].parameter;
      document.getElementById('aq_value').textContent = d_aq[0].measurements[2].value;
      document.getElementById('aq_date').textContent = d_aq[0].measurements[2].lastUpdated;
      
      
    } catch (error) {
      console.log(error);
      aq = {value: -1}
      document.getElementById('aq_value').textContent = 'NO READING';
    }
    const refresh = document.getElementById('refresh');
      refresh.addEventListener('click', async event => {
        const data = {lat, lon, json};
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        };
        const db_response = await fetch('/api', options);
        const db_json = await db_response.json(); 
        console.log(db_json);
      })
  });
} else {
    console.log('geolocation not available');
}