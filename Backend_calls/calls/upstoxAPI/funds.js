/* eslint-disable @typescript-eslint/no-require-imports */
import  config  from './config'; // Import specific config values
const your_access_token = config.accessToken
let funds = null 
// let varialbe2 = null

import  get  from 'axios';

const url = 'https://api.upstox.com/v2/user/get-funds-and-margin?segment=SEC';

const headers = {
  'Accept': 'application/json',
  'Authorization': `Bearer ${your_access_token}`
};

get(url, { headers })
  .then(response => {
    // console.log(response.status);
    // console.log(response.data)
    console.log(response.data.data.equity.available_margin);
    funds = response.data.data.equity.available_margin;
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

  export function getFunds() { return funds; }