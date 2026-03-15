require('dotenv').config();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { getAccessToken } = require('./auth');

async function fetchUnifiedHistories(options = {}) {
  const {
    type = 'all',
    sort = 'desc',
    source = 'all',
    fromRhea = 0,
    size = 30,
    startTime,
    endTime,
    fromOh = 0,
  } = options;

  if (!startTime || !endTime) {
    throw new Error('startTime and endTime are required');
  }

  const bearerToken = await getAccessToken();
  const sessionId = process.env.GOPAY_SESSION_ID;
  const d1 = process.env.GOPAY_D1;
  const appVersion = process.env.GOPAY_APP_VERSION || '1.22.0';
  const location = process.env.GOPAY_X_LOCATION;
  const m1 = process.env.GOPAY_X_M1;
  const uniqueId = process.env.GOPAY_X_UNIQUEID;
  const phoneMake = process.env.GOPAY_X_PHONEMAKE;
  const phoneModel = process.env.GOPAY_X_PHONEMODEL;
  const deviceOs = process.env.GOPAY_X_DEVICEOS || 'Android, 15';
  const deviceToken = process.env.GOPAY_X_DEVICETOKEN;
  const selectedOutlet = process.env.GOPAY_X_SELECTED_OUTLET;
  const timezone = process.env.GOPAY_X_TIMEZONE || 'GMT+08:00';
  const userLocale = process.env.GOPAY_X_USER_LOCALE || 'id_ID';
  const e1 = process.env.GOPAY_X_E1;
  const e2 = process.env.GOPAY_X_E2;

  const config = {
    method: 'GET',
    url: 'https://gopaymerchant.midtrans.com/api/v1/unified-histories',
    params: {
      type,
      sort,
      source,
      from_rhea: fromRhea,
      size,
      start_time: startTime,
      end_time: endTime,
      from_oh: fromOh,
    },
    headers: {
      'User-Agent': 'Dart/3.7 (dart:io)',
      'Accept-Encoding': 'gzip',
      'x-session-id': sessionId,
      'authorization': `Bearer ${bearerToken}`,
      'x-request-id': uuidv4(),
      'd1': d1,
      'x-appversion': appVersion,
      'x-location': location,
      'x-m1': m1,
      'gojek-country-code': 'ID',
      'x-theme': 'LIGHT',
      'x-uniqueid': uniqueId,
      'x-phonemake': phoneMake,
      'x-e1': e1,
      'x-user-type': 'merchant',
      'x-deviceos': deviceOs,
      'x-appid': 'com.gojek.gopaymerchant',
      'x-selected-outlet': selectedOutlet,
      'content-type': 'application/json',
      'x-timezone': timezone,
      'x-authsdk-version': '1.0.0',
      'x-apptype': 'GOPAY-MERCHANT',
      'x-user-locale': userLocale,
      'x-devicetoken': deviceToken,
      'x-source-app': 'gopay-merchant',
      'x-e2': e2,
      'accept-language': 'id',
      'x-pushtokentype': 'FCM',
      'x-phonemodel': phoneModel,
      'x-platform': 'Android',
    },
  };

  const response = await axios(config);
  return response.data;
}

async function main() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(16, 0, 0, 0);
  startOfDay.setUTCDate(startOfDay.getUTCDate() - 1);
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(15, 59, 59, 0);

  try {
    const data = await fetchUnifiedHistories({
      startTime: startOfDay.toISOString().replace('.000Z', 'Z'),
      endTime: endOfDay.toISOString().replace('.000Z', 'Z'),
    });
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

module.exports = { fetchUnifiedHistories };

if (require.main === module) {
  main();
}
