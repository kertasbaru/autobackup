const axios = require('axios');

const GOTO_ACCOUNTS_BASE_URL = 'https://accounts.goto-products.com';

async function refreshToken(refreshToken) {
  if (!refreshToken) {
    throw new Error('GOTO_REFRESH_TOKEN environment variable is required');
  }

  const clientId = process.env.GOTO_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOTO_CLIENT_ID environment variable is required');
  }

  const config = {
    method: 'POST',
    url: `${GOTO_ACCOUNTS_BASE_URL}/oauth2/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Dart/3.7 (dart:io)',
      'Accept-Encoding': 'gzip',
    },
    data: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  };

  const response = await axios(config);
  return response.data;
}

async function getAccessToken() {
  const token = process.env.GOTO_REFRESH_TOKEN;
  if (!token) {
    const bearerToken = process.env.GOPAY_BEARER_TOKEN;
    if (!bearerToken) {
      throw new Error(
        'Either GOTO_REFRESH_TOKEN or GOPAY_BEARER_TOKEN must be set',
      );
    }
    return bearerToken;
  }

  const data = await refreshToken(token);
  return data.access_token;
}

module.exports = { refreshToken, getAccessToken, GOTO_ACCOUNTS_BASE_URL };
