import axios from 'axios';

const API_URL = 'http://localhost:3333';


const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
      },
});

export default client