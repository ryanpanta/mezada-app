import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.0.108:5003/api', 
  headers: {
    'Content-Type': 'application/json',
  }
});

let activeRequests = 0; 

const setLoading = (isLoading) => {
    console.log(`[API] Loading: ${isLoading}`);
};

api.interceptors.request.use(
  async (config) => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
          config.headers['X-User-Id'] = userId;
      }
      console.log(`[API] Requisição: ${config.method.toUpperCase()} ${config.url}`);
      return config;
  },
  (error) => {
      console.error('[API] Erro na requisição:', error);
      return Promise.reject(error);
  }
);

export default api;