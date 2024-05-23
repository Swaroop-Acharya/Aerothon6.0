const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://airport-info.p.rapidapi.com/airport',
  params: {iata: 'BLR'},
  headers: {
    'X-RapidAPI-Key': '6a299485a2msh69cfeee83a143e3p148bd3jsn43eeec00ee95',
    'X-RapidAPI-Host': 'airport-info.p.rapidapi.com'
  }
};



const fetchData=async()=>{
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  
}

fetchData()