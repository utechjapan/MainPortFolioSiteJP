// scripts/test-mailchimp.js
// Run this script with: node scripts/test-mailchimp.js
// Make sure to have a .env.local file with your Mailchimp credentials

require('dotenv').config({ path: '.env.local' });
const mailchimp = require('@mailchimp/mailchimp_marketing');

// Get environment variables
const API_KEY = process.env.MAILCHIMP_API_KEY;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const LIST_ID = process.env.MAILCHIMP_LIST_ID;

// Validate environment variables
if (!API_KEY) {
  console.error('❌ MAILCHIMP_API_KEY is missing');
  process.exit(1);
}

if (!SERVER_PREFIX) {
  console.error('❌ MAILCHIMP_SERVER_PREFIX is missing');
  process.exit(1);
}

if (!LIST_ID) {
  console.error('❌ MAILCHIMP_LIST_ID is missing');
  process.exit(1);
}

// Configure Mailchimp
mailchimp.setConfig({
  apiKey: API_KEY,
  server: SERVER_PREFIX,
});

async function testConnection() {
  console.log('🔍 Testing Mailchimp connection...');
  console.log(`Using server prefix: ${SERVER_PREFIX}`);
  
  try {
    // First, test API connection
    const apiTest = await mailchimp.ping.get();
    console.log('✅ API Connection successful:', apiTest.health_status);
    
    // Then, verify the list exists
    try {
      const listInfo = await mailchimp.lists.getList(LIST_ID);
      console.log('✅ List found!', {
        name: listInfo.name,
        memberCount: listInfo.stats.member_count,
        id: listInfo.id
      });
      
      console.log('\n🎉 Your Mailchimp configuration is working correctly!');
      return true;
    } catch (error) {
      console.error('❌ List ID error:', error.message);
      console.log('\nPlease check your MAILCHIMP_LIST_ID value');
      return false;
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nPlease check your MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX values');
    return false;
  }
}

testConnection();