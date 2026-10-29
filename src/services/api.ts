
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wedev-api.sky.pro/api/fitness',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;

      if (serverMessage) {
        error.message = serverMessage;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
