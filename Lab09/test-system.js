const axios = require('axios');

async function testSystem() {
  const ORCHESTRATOR = process.env.ORCHESTRATOR_URL || 'http://192.168.1.10:8080';

  try {
    console.log('--- Testing User Registration ---');
    const regRes = await axios.post(`${ORCHESTRATOR}/auth/register`, {
      username: 'testuser',
      password: 'password123'
    });
    console.log('Registration Response:', regRes.data);

    console.log('\n--- Testing Tour Listing ---');
    const toursRes = await axios.get(`${ORCHESTRATOR}/tours`);
    console.log('Tours:', toursRes.data);

    console.log('\n--- Testing Booking Process ---');
    const bookRes = await axios.post(`${ORCHESTRATOR}/bookings`, {
      userId: 1,
      tourId: 101
    });
    console.log('Booking Response:', bookRes.data);
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
}

setTimeout(testSystem, 3000);
