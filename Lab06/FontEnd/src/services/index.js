import { userApi, foodApi, orderApi, paymentApi } from './api';

export const authService = {
  login: async (username, password) => {
    const response = await userApi.post('/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (username, password) => {
    const response = await userApi.post('/register', { username, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const foodService = {
  getFoods: async () => {
    const response = await foodApi.get('/foods');
    return response.data;
  }
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await orderApi.post('/orders', orderData);
    return response.data;
  },
  getOrders: async () => {
    const response = await orderApi.get('/orders');
    return response.data;
  }
};

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await paymentApi.post('/payments', paymentData);
    return response.data;
  }
};

