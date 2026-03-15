# APK Modification Toolkit for Termux

Bash toolkit for modifying Android APK files in [Termux](https://termux.dev/). Automates common reverse-engineering tasks such as bypassing SSL pinning, disabling signature verification, neutralizing anti-Frida detection, extracting cryptographic secrets, and **runtime hooking** for automatic key/IV/header extraction when the app runs.

## Features

| Module | Description |
|--------|-------------|
| **SSL Pinning Bypass** | Patches OkHttp `CertificatePinner`, `X509TrustManager`, `HostnameVerifier`, Network Security Config, and WebView SSL handlers |
| **Signature Killer** | Injects a `SignatureKiller` smali class, detects `PackageManager` signature checks, and extracts the original APK signature |
| **Anti-Frida / Root / Emulator Bypass** | Neutralizes Frida port scanning, library name detection, `/proc/self/maps` checks, root detection (`su`, Magisk, SuperSU), debugger detection, and emulator detection |
| **Secret Extractor (Static)** | Extracts hardcoded AES/DES/RSA keys, IV parameters, API keys, Firebase config, and documents all encryption/decryption methods |
| **Runtime Hooking** | Injects frida-gadget into the APK so that when the app is launched, it **automatically hooks** all crypto operations and HTTP headers, capturing secret keys, IVs, encryption/decryption data, and auth tokens to `storage/downloads/modify/key/` |
| **APK Rebuild & Sign** | Rebuilds the patched APK with `apktool`, zipaligns, and signs with a debug keystore |

## Quick Start

```bash
# 1. Install prerequisites (run once)
bash setup.sh

# 2. Modify an APK (all features including runtime hooking)
bash modify_apk.sh /path/to/app.apk --hook

# 3. Deploy hooks to device, install APK, and launch
bash ~/storage/downloads/modify/key/<app_name>/deploy_hooks.sh
adb install -r ~/storage/downloads/modify/output/<app_name>_modified.apk

# 4. Use the app - crypto keys/IVs/headers are automatically captured

# 5. Pull runtime results from device
adb pull /sdcard/Download/modify/key/<app_name>/ .

# 6. Check all results
cat ~/storage/downloads/modify/key/<app_name>/report.txt
```

## Installation

```bash
pkg install git -y
git clone https://github.com/kertasbaru/autobackup.git
cd autobackup
bash setup.sh
```

`setup.sh` installs the following in Termux:

- **apktool** — APK decompilation and recompilation
- **jadx** — DEX to Java decompiler
- **dex2jar** — DEX to JAR conversion
- **apksigner / jarsigner** — APK signing
- **keytool** — Keystore generation
- **OpenJDK 17** — Java runtime
- **openssl** — Cryptographic utilities
- **androguard** (Python) — Advanced APK analysis
- **frida / frida-tools** (Python) — Dynamic instrumentation and runtime hooking
- **xz-utils** — For decompressing frida-gadget

## Usage

```
bash modify_apk.sh <apk-file> [options]

Options:
  --ssl-only          Only bypass SSL pinning
  --sig-only          Only bypass signature verification
  --anti-frida-only   Only bypass anti-Frida/root detection
  --extract-only      Only extract secrets (no patching, no rebuild)
  --hook              Inject frida-gadget for auto runtime hooking
  --hook-only         Only inject frida-gadget (no static patching)
  --hook-type <type>  Hook type: all, crypto, headers (default: all)
  --no-rebuild        Skip APK rebuild (keep decompiled source)
  --output <path>     Custom output path for the modified APK
  --debug             Enable verbose debug logging
  --help              Show help message
```

### Examples

```bash
# Full modification (all modules)
bash modify_apk.sh app.apk

# Full modification + runtime hooking (recommended)
bash modify_apk.sh app.apk --hook

# Extract secrets only (no modifications)
bash modify_apk.sh app.apk --extract-only

# Only inject runtime hooks (no static patching)
bash modify_apk.sh app.apk --hook-only

# SSL pinning bypass only
bash modify_apk.sh app.apk --ssl-only

# Anti-Frida bypass with custom output
bash modify_apk.sh app.apk --anti-frida-only --output ~/modified.apk
```

## Output Structure

All results are saved under `~/storage/downloads/modify/`:

```
storage/downloads/modify/
├── key/<apk_name>/
│   ├── report.txt            # Full modification report
│   ├── encryption_keys.txt   # AES/DES/RSA key references (static)
│   ├── iv_parameters.txt     # IV/nonce parameters (static)
│   ├── api_keys.txt          # API keys and tokens
│   ├── firebase_config.txt   # Firebase/Google configuration
│   ├── crypto_analysis.txt   # Encryption/decryption method analysis
│   ├── urls_endpoints.txt    # URLs and API endpoints
│   ├── original_signature.txt# Original APK signature
│   ├── ssl_pinning.txt       # SSL pinning bypass details
│   ├── signature_killer.txt  # Signature bypass details
│   ├── anti_frida.txt        # Anti-detection bypass details
│   ├── secrets.txt           # General secret findings
│   ├── runtime_hooks.txt     # Runtime hooking status & instructions
│   ├── frida_hooks.js        # Hooks script (deploy to device)
│   └── deploy_hooks.sh       # Script to deploy hooks to device
├── output/                   # Modified APK files
├── backup/                   # Original APK backups
└── logs/                     # Operation logs
```

### Runtime Output (on device after app launch)

When the modified APK (with `--hook`) is installed and launched, the app automatically captures crypto operations to the device storage:

```
/sdcard/Download/modify/key/<package_name>/
├── runtime_keys.txt          # Secret keys, IVs, cipher operations captured at runtime
└── runtime_headers.txt       # HTTP headers, auth tokens, JWT captured at runtime
```

`runtime_keys.txt` contains actual values captured during execution:
- **SECRET_KEY**: Algorithm, key value (hex/base64/utf8), key length
- **IV_PARAMETER**: IV values (hex/base64/utf8), length
- **CIPHER_OP**: Encrypt/decrypt mode, algorithm, key, IV
- **CIPHER_DATA**: Plaintext and ciphertext for each operation
- **MAC_KEY**: HMAC keys and algorithm
- **MAC_DATA**: HMAC input and output
- **HASH_DATA**: Hash algorithm, input, digest
- **PBE_KEY**: Password, salt, iterations, key length
- **KEY_DERIVATION**: Derived key values (PBKDF2, etc.)
- **KEYSTORE**: KeyStore aliases and key values

`runtime_headers.txt` contains HTTP header construction:
- **OKHTTP_HEADER**: Headers set via OkHttp Request.Builder
- **OKHTTP_REQUEST**: Full request URLs, methods, and all headers
- **HTTP_HEADER**: Headers set via HttpURLConnection
- **JWT_TOKEN**: JWT token components detected during Base64 encoding
- **STORED_SECRET**: Security-related SharedPreferences entries

## Project Structure

```
.
├── setup.sh               # Termux environment setup
├── modify_apk.sh          # Main entry point
├── hooks/
│   ├── crypto_hooks.js     # Frida script: crypto operation hooking
│   ├── header_hooks.js     # Frida script: HTTP header hooking
│   ├── combined_hooks.js   # Combined crypto + header hooks (for gadget)
│   └── gadget_config.json  # Frida gadget configuration template
├── lib/
│   ├── common.sh           # Shared utilities and constants
│   ├── ssl_pinning.sh      # SSL pinning bypass module
│   ├── signature_killer.sh # Signature verification bypass
│   ├── anti_frida.sh       # Anti-Frida/root/emulator bypass
│   ├── secret_extractor.sh # Secret key and crypto extraction (static)
│   ├── runtime_hooker.sh   # Frida gadget injection & runtime hooking
│   └── apk_builder.sh      # APK rebuild and signing
└── README.md
```

## References

- [Apktool](https://github.com/iBotPeaches/Apktool) — APK reverse engineering
- [jadx](https://github.com/skylot/jadx) — DEX to Java decompiler
- [Frida](https://github.com/frida/frida) — Dynamic instrumentation toolkit
- [OWASP MASTG](https://mas.owasp.org/MASTG/) — Mobile Application Security Testing Guide
- [apk-mitm](https://github.com/nicholasgasior/apk-mitm) — APK MITM proxy patching
- [dex2jar](https://github.com/pxb1988/dex2jar) — DEX to JAR tools

## License

This project is for **educational and authorized security testing purposes only**. Always obtain proper authorization before modifying any application you do not own.
