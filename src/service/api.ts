import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api-central-rtd.totalsistemas.com.br',
  timeout: 10000,
  withCredentials: true,
});

export default api;
