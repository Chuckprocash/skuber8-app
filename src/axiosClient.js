import axios from 'axios';
import { isLoading } from './store/loading';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(config => {
  isLoading.value = true;
  return config;
}, error => {
  isLoading.value = false;
  return Promise.reject(error);
});

axiosClient.interceptors.response.use(response => {
  isLoading.value = false;
  return response;
}, error => {
  isLoading.value = false;
  return Promise.reject(error);
});

export default axiosClient;