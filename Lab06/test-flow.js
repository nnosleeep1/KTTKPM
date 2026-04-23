const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testFlow() {
  try {
    console.log('--- Step 1: Browse Foods ---');
    const foodsResponse = await axios.get(`${BASE_URL}/foods`);
    console.log('Foods:', foodsResponse.data);

    console.log('\n--- Step 2: Register User ---');
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      username: 'testuser',
      password: 'password123'
    });
    console.log('Registered User:', registerResponse.data);
    const userId = registerResponse.data.id;

    console.log('\n--- Step 3: Login User ---');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: 'testuser',
      password: 'password123'
    });
    console.log('Login Token:', loginResponse.data.token);

    console.log('\n--- Step 4: Create Order ---');
    const orderResponse = await axios.post(`${BASE_URL}/orders`, {
      userId: userId,
      foodId: 1, // Bánh Mì
      quantity: 2
    });
    console.log('Order created:', orderResponse.data);
    const orderId = orderResponse.data.id;

    console.log('\n--- Step 5: Process Payment ---');
    const paymentResponse = await axios.post(`${BASE_URL}/payments`, {
      orderId: orderId,
      paymentMethod: 'Banking'
    });
    console.log('Payment result:', paymentResponse.data);

    console.log('\n--- Step 6: Verify Order Status ---');
    const ordersResponse = await axios.get(`${BASE_URL}/orders`);
    console.log('All Orders:', JSON.stringify(ordersResponse.data, null, 2));

  } catch (error) {
    console.error('Test Flow Failed:', error.response ? error.response.data : error.message);
  }
}

testFlow();
