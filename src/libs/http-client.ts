import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';

const url: string = import.meta.env.VITE_APP_API_URL;
const token: string | null = localStorage.getItem('token');

// Global response handler
const globalResponseHandler = (response: AxiosResponse): AxiosResponse => {
  return response;
};

// Global error handler
const globalErrorHandler = (error: AxiosError): Promise<any> => {
  const status = error.response?.status;
  const isTokenExpired = status === 401;

  if (isTokenExpired) {
    localStorage.removeItem('token');
    localStorage.removeItem('oo_token');
    window.location.href = '/';
  }

  return Promise.reject(error);
};

const client: AxiosInstance = axios.create({
  baseURL: url,
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

client.interceptors.response.use(globalResponseHandler, globalErrorHandler);

export default client;
