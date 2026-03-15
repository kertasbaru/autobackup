# autobackup

Fetches unified transaction histories from the GoPay Merchant API.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
```

## Environment Variables

| Variable | Description |
|---|---|
| `GOPAY_BEARER_TOKEN` | Bearer token for API authentication |
| `GOPAY_SESSION_ID` | Session ID header value |
| `GOPAY_D1` | Device fingerprint (d1 header) |
| `GOPAY_X_LOCATION` | Location coordinates (x-location header) |
| `GOPAY_X_M1` | Device metadata (x-m1 header) |
| `GOPAY_APP_VERSION` | App version (default: `1.22.0`) |

## Usage

```bash
node index.js
```
