import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
});

// axiosInstance.interceptors.request.use(config => {
//   // Modificar la configuración antes de enviar la solicitud
//   return config;
// });

export default axiosInstance;
