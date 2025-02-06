import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://health-conditions-file.p.rapidapi.com/year',
  params: {
    limit: '500',
    index: '0',
    orderBy: 'asc',
    value: '0'
  },
  headers: {
    'x-rapidapi-key': '5e42c3fb2amsh86b7bd6cca722cep1dc909jsncfb98cf2c652',
    'x-rapidapi-host': 'health-conditions-file.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}