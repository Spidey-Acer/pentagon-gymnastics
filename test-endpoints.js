const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  try {
    console.log('Testing subscription packages endpoint...');
    const packagesResponse = await axios.get(`${BASE_URL}/subscriptions/packages`);
    console.log('✅ Packages endpoint working:', packagesResponse.data);

    console.log('\nTesting classes endpoint...');
    const classesResponse = await axios.get(`${BASE_URL}/classes`);
    console.log('✅ Classes endpoint working. Found', classesResponse.data.length, 'classes');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testEndpoints();
