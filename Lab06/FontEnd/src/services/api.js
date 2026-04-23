import axios from 'axios';

const USER_SERVICE_URL = 'http://172.16.54.78:8081';
const FOOD_SERVICE_URL = 'http://172.16.48.24:8082';
const ORDER_SERVICE_URL = 'http://172.16.48.141:8083';
const PAYMENT_SERVICE_URL = 'http://172.16.35.88:8084';


const createInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add interceptor for auth token
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return instance;
};

export const userApi = createInstance(USER_SERVICE_URL);
export const foodApi = createInstance(FOOD_SERVICE_URL);
export const orderApi = createInstance(ORDER_SERVICE_URL);
export const paymentApi = createInstance(PAYMENT_SERVICE_URL);

export default userApi; // default as userApi for backward compatibility if needed

