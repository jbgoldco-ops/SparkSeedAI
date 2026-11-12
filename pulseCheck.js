#!/usr/bin/env node

/**
 * Hive Pulse Check
 * Checks public Hive RPC nodes with a read-only JSON-RPC request.
 */

const https = require('https');

// Public Hive RPC endpoints. Use POST JSON-RPC rather than GETting the node URL;
// RPC nodes commonly return 404 for a browser-style GET at the root path.
const PULSE_ENDPOINTS = [
  'https://api.hive.blog',
  'https://api.openhive.network',
  'https://rpc.ecency.com',
  'https://hived.privex.io',
];

const TIMEOUT = 10000;
const RETRIES = 2;
const MIN_HEALTHY_ENDPOINTS = 1;
const RPC_REQUEST = JSON.stringify({
  jsonrpc: '2.0',
  method: 'condenser_api.get_dynamic_global_properties',
  params: [],
  id: 1,
});

function requestEndpoint(url) {
  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Content-Length': Buffer.byteLength(RPC_REQUEST),
        },
        timeout: TIMEOUT,
      },
      (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }

          let payload;
          try {
            payload = JSON.parse(body);
          } catch {
            reject(new Error('Invalid JSON response'));
            return;
          }

          if (payload.error) {
            reject(new Error(`JSON-RPC error: ${JSON.stringify(payload.error)}`));
            return;
          }

          const headBlockNumber = payload.result?.head_block_number;
          if (!Number.isSafeInteger(headBlockNumber) || headBlockNumber <= 0) {
            reject(new Error('JSON-RPC response is missing a valid head_block_number'));
            return;
          }

          resolve({
            url,
            status: 'healthy',
            statusCode: response.statusCode,
            headBlockNumber,
          });
        });
      },
    );

    request.on('timeout', () => {
      request.destroy(new Error(`Timeout after ${TIMEOUT}ms`));
    });
    request.on('error', reject);
    request.end(RPC_REQUEST);
  });
}

async function checkEndpoint(url, retries = RETRIES) {
  try {
    return await requestEndpoint(url);
  } catch (error) {
    if (retries > 0) {
      console.warn(`⚠️  Retrying ${url} (${RETRIES - retries + 1}/${RETRIES}): ${error.message}`);
      return checkEndpoint(url, retries - 1);
    }
    throw error;
  }
}

async function runPulseCheck() {
  console.log('🔄 Starting Hive Pulse Check...\n');

  const checks = await Promise.all(
    PULSE_ENDPOINTS.map(async (url) => {
      try {
        const result = await checkEndpoint(url);
        console.log(`✅ ${url}: healthy (head block ${result.headBlockNumber})`);
        return result;
      } catch (error) {
        console.error(`❌ ${url}: ${error.message}`);
        return { url, status: 'unhealthy', error: error.message };
      }
    }),
  );

  const healthyCount = checks.filter((check) => check.status === 'healthy').length;
  const overallStatus = healthyCount === PULSE_ENDPOINTS.length
    ? 'healthy'
    : healthyCount >= MIN_HEALTHY_ENDPOINTS
      ? 'degraded'
      : 'critical';
  const results = {
    timestamp: new Date().toISOString(),
    endpoints: checks,
    overallStatus,
    summary: {
      total: PULSE_ENDPOINTS.length,
      healthy: healthyCount,
      unhealthy: PULSE_ENDPOINTS.length - healthyCount,
    },
  };

  console.log('\n📊 Pulse Check Summary:');
  console.log(`Overall Status: ${overallStatus.toUpperCase()}`);
  console.log(`Healthy Endpoints: ${healthyCount}/${PULSE_ENDPOINTS.length}`);
  console.log(`Timestamp: ${results.timestamp}`);
  console.log('\n📋 Detailed Results:');
  console.log(JSON.stringify(results, null, 2));

  if (healthyCount >= MIN_HEALTHY_ENDPOINTS) {
    console.log(`\n✨ Hive Pulse Check: ${overallStatus.toUpperCase()}\n`);
    process.exit(0);
  }

  console.error('\n💀 Hive Pulse Check: FAILED (no healthy RPC endpoints)\n');
  process.exit(1);
}

runPulseCheck().catch((error) => {
  console.error('🔥 Pulse Check Error:', error);
  process.exit(1);
});
