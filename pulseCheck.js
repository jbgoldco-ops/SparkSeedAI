require('dotenv').config(); 

//#!/usr/bin/env node

/**
 * Hive Pulse Check
 * Monitors the health and status of the Hive system
 * Includes fallback endpoints and improved error handling
 */

const https = require('https');

// Configuration
const HIVE_SAFE_KEY = process.env.HIVE_SAFE_KEY || '';

// Primary and fallback Hive RPC endpoints
// See: https://developers.hive.io/
const PULSE_ENDPOINTS = [
  'https://api.hive.blog/api/v1/',
  'https://rpc.hive.blog/',
  'https://anyx.io/', // Fallback RPC endpoint
  'https://api.hivekings.com/', // Fallback API endpoint
];

const TIMEOUT = 10000; // 10 seconds
const RETRIES = 2;
const MIN_HEALTHY_ENDPOINTS = 1; // Minimum healthy endpoints required for non-critical status

/**
 * Make HTTPS request to check endpoint health
 */
function checkEndpoint(url, retries = RETRIES) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${TIMEOUT}ms`));
    }, TIMEOUT);

    https
      .get(url, { timeout: TIMEOUT }, (res) => {
        clearTimeout(timer);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            url,
            status: 'healthy',
            statusCode: res.statusCode,
          });
        } else if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          resolve({
            url,
            status: 'warning',
            statusCode: res.statusCode,
          });
        }
      })
      .on('error', (err) => {
        clearTimeout(timer);
        if (retries > 0) {
          console.warn(`⚠️  Retry ${RETRIES - retries + 1} for ${url}:`, err.message);
          checkEndpoint(url, retries - 1)
            .then(resolve)
            .catch(reject);
        } else {
          reject(err);
        }
      });
  });
}

/**
 * Check Hive Safe Key validity
 */
function validateSafeKey() {
  if (!HIVE_SAFE_KEY) {
    console.warn('⚠️  Warning: HIVE_SAFE_KEY not set in environment');
    return false;
  }

  // Basic validation - key should be at least 32 characters
  if (HIVE_SAFE_KEY.length < 32) {
    console.error('❌ Error: HIVE_SAFE_KEY is too short');
    return false;
  }

  console.log('✅ HIVE_SAFE_KEY is valid');
  return true;
}

/**
 * Main pulse check function
 */
async function runPulseCheck() {
  console.log('🔄 Starting Hive Pulse Check...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    keyValid: validateSafeKey(),
    endpoints: [],
    overallStatus: 'unknown',
    summary: {
      total: PULSE_ENDPOINTS.length,
      healthy: 0,
      unhealthy: 0,
    },
  };

  let healthyCount = 0;
  let totalCount = PULSE_ENDPOINTS.length;

  // Check all endpoints
  for (const endpoint of PULSE_ENDPOINTS) {
    try {
      const result = await checkEndpoint(endpoint);
      results.endpoints.push(result);
      console.log(`✅ ${endpoint}: ${result.status} (${result.statusCode})`);
      
      if (result.status === 'healthy') {
        healthyCount++;
        results.summary.healthy++;
      }
    } catch (error) {
      results.endpoints.push({
        url: endpoint,
        status: 'unhealthy',
        error: error.message,
      });
      results.summary.unhealthy++;
      console.error(`❌ ${endpoint}: ${error.message}`);
    }
  }

  // Determine overall status based on minimum healthy endpoints
  if (healthyCount >= totalCount) {
    results.overallStatus = 'healthy';
  } else if (healthyCount >= MIN_HEALTHY_ENDPOINTS) {
    results.overallStatus = 'degraded';
  } else {
    results.overallStatus = 'critical';
  }

  // Summary
  console.log('\n📊 Pulse Check Summary:');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Overall Status: ${results.overallStatus.toUpperCase()}`);
  console.log(`Healthy Endpoints: ${healthyCount}/${totalCount}`);
  console.log(`Timestamp: ${results.timestamp}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Output JSON for logging
  console.log('\n📋 Detailed Results:');
  console.log(JSON.stringify(results, null, 2));

  // Exit with appropriate code
  if (results.overallStatus === 'healthy') {
    console.log('\n✨ Hive Pulse Check: PASSED\n');
    process.exit(0);
  } else if (results.overallStatus === 'degraded') {
    console.warn(`\n⚠️  Hive Pulse Check: DEGRADED (${healthyCount}/${totalCount} endpoints healthy)\n`);
    process.exit(0); // Don't fail on degraded - at least one endpoint is working
  } else {
    console.error(`\n💀 Hive Pulse Check: FAILED (${healthyCount}/${totalCount} endpoints healthy)\n`);
    process.exit(1);
  }
}

// Run the pulse check
runPulseCheck().catch((error) => {
  console.error('🔥 Pulse Check Error:', error);
  process.exit(1);
});
