# Security Policy

## Supported Versions

The following table details the versions of **EarthSphere** currently receiving security updates:

| Version | Supported          | Security Maintenance Status |
| ------- | ------------------ | --------------------------- |
| `1.x.x` | :white_check_mark: | Active Development & Patches |
| `< 1.0` | :x:                | Deprecated                  |

---

## Reporting a Vulnerability

We take the security of **EarthSphere** and its users seriously. If you discover a security vulnerability, please follow responsible disclosure protocols:

1. **Do NOT report security vulnerabilities via public GitHub issues.**
2. Send an email describing the vulnerability to **`security@earthsphere.in`** or contact the maintainer directly via [GitHub Profile](https://github.com/djabhi31).
3. Include detailed steps to reproduce the issue, along with any relevant proof-of-concept (PoC) code or screenshots.

### Response Timeline
- **Initial Acknowledgment:** Within 48 hours.
- **Triage & Impact Assessment:** Within 5 business days.
- **Fix & Security Patch Release:** Target within 14 business days depending on severity.

---

## Security Best Practices in EarthSphere

- **Public Data API:** EarthSphere uses NASA's EONET public endpoints which require no secret API keys.
- **Content Security & Sanitization:** Map Lib & WebGL rendering pipelines implement strict input sanitization to prevent XSS.
- **Client-Side State Isolation:** No sensitive telemetry or credentials are persisted in local browser storage.
