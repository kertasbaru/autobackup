# autobackup

Fetches unified transaction histories from the GoPay Merchant API, with optional automatic token refresh via GoTo Accounts (`accounts.goto-products.com`).

## Search Results

No public GitHub repository was found making direct HTTP requests to `https://accounts.goto-products.com`. The closest match is [miftahzulfikar/semi-on-skipper](https://github.com/miftahzulfikar/semi-on-skipper), which references `*.goto-products.com` in its Content Security Policy (CSP) configuration.

This project implements the authentication flow with `accounts.goto-products.com` for automatic token refresh.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
```

## Environment Variables

| Variable | Description |
|---|---|
| `GOPAY_BEARER_TOKEN` | Bearer token for API authentication (used if `GOTO_REFRESH_TOKEN` is not set) |
| `GOPAY_SESSION_ID` | Session ID header value |
| `GOPAY_D1` | Device fingerprint (d1 header) |
| `GOPAY_X_LOCATION` | Location coordinates (x-location header) |
| `GOPAY_X_M1` | Device metadata (x-m1 header) |
| `GOPAY_APP_VERSION` | App version (default: `1.22.0`) |
| `GOPAY_X_UNIQUEID` | Unique device ID (x-uniqueid header) |
| `GOPAY_X_PHONEMAKE` | Phone manufacturer (x-phonemake header) |
| `GOPAY_X_PHONEMODEL` | Phone model (x-phonemodel header) |
| `GOPAY_X_DEVICEOS` | Device OS (default: `Android, 15`) |
| `GOPAY_X_DEVICETOKEN` | FCM device token (x-devicetoken header) |
| `GOPAY_X_SELECTED_OUTLET` | Selected outlet ID (x-selected-outlet header) |
| `GOPAY_X_TIMEZONE` | Timezone (default: `GMT+08:00`) |
| `GOPAY_X_USER_LOCALE` | User locale (default: `id_ID`) |
| `GOPAY_X_E1` | Device attestation value (x-e1 header) |
| `GOPAY_X_E2` | Device attestation value (x-e2 header) |
| `GOTO_CLIENT_ID` | GoTo client ID for token refresh (optional) |
| `GOTO_REFRESH_TOKEN` | GoTo refresh token for automatic token refresh via `accounts.goto-products.com` (optional) |

## Usage

```bash
node index.js
```

### Authentication

The script supports two authentication modes:

1. **Static token**: Set `GOPAY_BEARER_TOKEN` directly in `.env`
2. **Auto-refresh**: Set `GOTO_CLIENT_ID` and `GOTO_REFRESH_TOKEN` to automatically obtain a fresh access token from `https://accounts.goto-products.com/oauth2/token` before each request
