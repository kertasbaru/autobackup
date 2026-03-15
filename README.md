# APK Modification Toolkit for Termux

Bash toolkit for modifying Android APK files in [Termux](https://termux.dev/). Automates common reverse-engineering tasks such as bypassing SSL pinning, disabling signature verification, neutralizing anti-Frida detection, and extracting cryptographic secrets.

## Features

| Module | Description |
|--------|-------------|
| **SSL Pinning Bypass** | Patches OkHttp `CertificatePinner`, `X509TrustManager`, `HostnameVerifier`, Network Security Config, and WebView SSL handlers |
| **Signature Killer** | Injects a `SignatureKiller` smali class, detects `PackageManager` signature checks, and extracts the original APK signature |
| **Anti-Frida / Root / Emulator Bypass** | Neutralizes Frida port scanning, library name detection, `/proc/self/maps` checks, root detection (`su`, Magisk, SuperSU), debugger detection, and emulator detection |
| **Secret Extractor** | Extracts hardcoded AES/DES/RSA keys, IV parameters, API keys, Firebase config, and documents all encryption/decryption methods |
| **APK Rebuild & Sign** | Rebuilds the patched APK with `apktool`, zipaligns, and signs with a debug keystore |

## Quick Start

```bash
# 1. Install prerequisites (run once)
bash setup.sh

# 2. Modify an APK (all features)
bash modify_apk.sh /path/to/app.apk

# 3. Check results
ls ~/storage/downloads/modify/key/<app_name>/
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

## Usage

```
bash modify_apk.sh <apk-file> [options]

Options:
  --ssl-only          Only bypass SSL pinning
  --sig-only          Only bypass signature verification
  --anti-frida-only   Only bypass anti-Frida/root detection
  --extract-only      Only extract secrets (no patching, no rebuild)
  --no-rebuild        Skip APK rebuild (keep decompiled source)
  --output <path>     Custom output path for the modified APK
  --debug             Enable verbose debug logging
  --help              Show help message
```

### Examples

```bash
# Full modification (all modules)
bash modify_apk.sh app.apk

# Extract secrets only (no modifications)
bash modify_apk.sh app.apk --extract-only

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
│   ├── encryption_keys.txt   # AES/DES/RSA key references
│   ├── iv_parameters.txt     # IV/nonce parameters
│   ├── api_keys.txt          # API keys and tokens
│   ├── firebase_config.txt   # Firebase/Google configuration
│   ├── crypto_analysis.txt   # Encryption/decryption method analysis
│   ├── urls_endpoints.txt    # URLs and API endpoints
│   ├── original_signature.txt# Original APK signature
│   ├── ssl_pinning.txt       # SSL pinning bypass details
│   ├── signature_killer.txt  # Signature bypass details
│   ├── anti_frida.txt        # Anti-detection bypass details
│   └── secrets.txt           # General secret findings
├── output/                   # Modified APK files
├── backup/                   # Original APK backups
└── logs/                     # Operation logs
```

## Project Structure

```
.
├── setup.sh               # Termux environment setup
├── modify_apk.sh          # Main entry point
├── lib/
│   ├── common.sh           # Shared utilities and constants
│   ├── ssl_pinning.sh      # SSL pinning bypass module
│   ├── signature_killer.sh # Signature verification bypass
│   ├── anti_frida.sh       # Anti-Frida/root/emulator bypass
│   ├── secret_extractor.sh # Secret key and crypto extraction
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
