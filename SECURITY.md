# Security Policy & Privacy Architecture

At **EarthSphere**, security, user privacy, and defensive engineering are foundational design principles. This policy outlines supported versions, vulnerability disclosure procedures, client-side cryptographic isolation, and our **Bring Your Own Key (BYOK)** security model.

---

## 🛡️ Supported Versions

The following table details the releases of **EarthSphere & God's Eye View Suite** currently receiving active security updates and patches:

| Version | Status | Security Maintenance Support |
| :--- | :---: | :--- |
| **`2.1.x`** | 🟢 Active | **Full Security & Feature Support** (Current Release) |
| **`2.0.x`** | 🟡 Supported | Critical Security & Telemetry Bugfixes |
| **`1.x.x`** | 🟠 Maintenance | Deprecated — Security Backports for Critical CVEs only |
| **`< 1.0`** | 🔴 End of Life | Unsupported — Please upgrade immediately |

---

## 🔑 BYOK (Bring Your Own Key) Privacy & Security Architecture

God's Eye View (`https://godseyeview.earthsphere.in`) is engineered as a **zero-host-cost, zero-custody intelligence console** featuring client-side sandboxed credential storage:

### 1. Air-Gapped Client-Side Storage
- **Cesium Ion Access Token (`gev_cesium_token`)** and **Google Maps 3D Photorealistic Tiles API Key (`gev_google_maps_key`)** are stored **strictly within the visitor's local browser `localStorage`**.
- Credentials are read at runtime via JavaScript inside the user's isolated browser sandbox and passed directly to the CesiumJS / Google 3D tile rendering engine.
- **Zero Server Persistence**: No database, cookie, session store, or backend server operated by EarthSphere ever receives, logs, or stores these provider keys.

### 2. Ephemeral OpenAI Realtime Session Minting
- When using hands-free voice operations, the visitor's OpenAI API key (`gev_openai_key`) is transmitted over TLS 1.3 via the custom HTTP header `x-openai-key` to the local `/session` proxy route.
- The proxy acts as a single-flight ephemeral gateway forwarding the request directly to `https://api.openai.com/v1/realtime/sessions` to mint a short-lived WebRTC ephemeral client token.
- Once the ephemeral token is received, the proxy immediately discards the API key from execution memory. **Keys are never written to disk or recorded in application access logs.**

### 3. Immediate Revocation & Self-Custody
- Users retain absolute custody of their credentials.
- In-app **"Revoke Keys"** action immediately purges all keys (`gev_*`) from `localStorage` and resets the console to public keyless mode.
- Users can verify network requests at any time using standard browser Developer Tools (`F12` -> Network tab).

---

## 🌐 Network Security & Anti-SSRF Defenses

EarthSphere and its telemetry proxies enforce defense-in-depth against malicious network manipulation:

- **Strict Upstream Whitelisting**: Telemetry proxy endpoints (`/api/proxy/nasa`, `/adsb`, `/ais`, `/fires`, `/session`) strictly enforce hardcoded destination whitelists (e.g., `api.nasa.gov`, `opensky-network.org`, `adsb.lol`, `aisstream.io`, `celestrak.org`). Dynamic arbitrary external URL forwarding is blocked to prevent Server-Side Request Forgery (SSRF).
- **Rate-Limiting & Edge Caching**: Next.js route handlers cache upstream NASA responses with intelligent TTL headers (Stale-While-Revalidate) to mitigate denial-of-service pressure and stay well within API rate boundaries.
- **CORS Hardening**: Proxy endpoints restrict Cross-Origin Resource Sharing headers, preventing unauthorized cross-site domain scraping.

---

## 🖼️ Framing & Anti-Clickjacking Protections

To protect users against clickjacking and unauthorized embedding of tactical displays:

- **Frame Ancestors Policy**: Applications enforce HTTP response headers:
  ```http
  X-Frame-Options: SAMEORIGIN
  Content-Security-Policy: frame-ancestors 'self' https://earthsphere.in https://*.earthsphere.in;
  ```
- Any attempt to frame the command center from untrusted third-party origins is blocked by modern user agents.

---

## 🧼 Telemetry Sanitization & WebGL/XSS Defenses

- **Dynamic Data Sanitization**: Real-time geospatial telemetry (GeoJSON coordinates, aircraft ICAO hex identifiers, ship MMSI codes, satellite TLE ephemerides, NASA FIRMS fire heat signatures) undergoes rigorous type validation and HTML character encoding before being mounted to DOM nodes.
- **GPU Context Isolation**: WebGL and Three.js canvas contexts are configured with `preserveDrawingBuffer: false` and strict buffer boundaries to prevent memory leaks and shader-based GPU fingerprinting or injection.

---

## 🚨 Reporting a Vulnerability

We deeply appreciate and welcome responsible disclosure from the independent security research community. If you discover a vulnerability in EarthSphere or God's Eye View:

### 1. Disclosure Protocol
- **Do NOT open a public GitHub issue** for suspected security vulnerabilities.
- Submit a confidential report via **[GitHub Private Vulnerability Reporting](https://github.com/djabhi31/EarthSphere/security/advisories/new)** (preferred).
- Alternatively, email our security team directly at **`security@earthsphere.in`** with the subject `[SECURITY DISCLOSURE] Vulnerability in EarthSphere`.

### 2. What to Include
Please provide sufficient information to reproduce the issue:
- Clear description of the vulnerability and its potential impact.
- Affected component, route, or commit hash.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- Any proposed remediation or patches.

### 3. Response SLAs
| Phase | Target SLA |
| :--- | :--- |
| **Initial Acknowledgment** | Within **48 hours** |
| **Triage & Severity Rating** | Within **5 business days** |
| **Patch Development & Deployment** | Within **14 business days** |

### 4. Safe Harbor Guarantee
If you conduct security research in good faith in accordance with this policy:
- We will not initiate legal action against you or contact law enforcement regarding your research.
- We will work collaboratively with you to validate and remediate the issue promptly.
- You will receive public attribution in our Release Notes and Security Hall of Fame (unless you prefer anonymity).

---

<div align="center">
  <sub>EarthSphere Security Architecture • Maintained by <a href="https://github.com/djabhi31">Abhilash</a> & the Security Team</sub>
</div>
