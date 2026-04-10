# 🛡️ DarkSentinel OS

> **Stop Breaches Before They Happen.**
> An enterprise-grade dark web monitoring and credential leak alert platform.

DarkSentinel is a centralized intelligence OS designed to actively monitor the dark web, paste sites, and public repositories for exposed corporate credentials, API keys, and PII. When data leaks, DarkSentinel alerts your security team in under 30 seconds and provides instant AutoRemediation playbooks to mitigate the threat.

---

## ⚡ The Problem

Securing an enterprise's perimeter is no longer sufficient. With the rise of third-party breaches, phishing, and accidental insider leaks, sensitive data often ends up on dark web marketplaces, Pastebin, or public GitHub forks long before the affected organization is even aware. Security teams need a way to proactively detect external footprint exposures before threat actors can exploit them.

## 🚀 Key Features

- **Live Exposure Scanner**: Instantly check emails and domains against real-time breach databases using the **XposedOrNot Live API**. 
- **Dark Web Intelligence**: Get AI-powered predictions and track breaking alerts from cybercrime forums (e.g., BreachForums, RaidForums, Telegram).
- **Continuous Monitoring**: Round-the-clock scraping of paste sites (Pastebin, Ghostbin) and GitHub repositories for misplaced API keys and credentials.
- **Enterprise Dashboard**: A zero-trust, glassmorphism UI designed for modern security operations centers (SOC).
- **Incident Playbooks & AutoRemediate**: Automatically trigger notification scripts, force password resets, or revoke API tokens the moment a leak is verified.
- **Compliance Ready**: Generate one-click executive and compliance reports tailored for GDPR (Article 33), HIPAA, and SOC 2 audits.

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Design System**: Custom Enterprise CSS Design System (Dynamic Variables, Glassmorphism, CSS Grid/Flexbox)
- **API Integrations**: [XposedOrNot API](https://xposedornot.com/api_doc) (Live Breach Database Querying)
- **Deployment Structure**: Zero-dependency frontend prototype optimized for rapid hackathon deployment.

## ⚙️ How to Run Locally

Because the platform is built purely with web standards and requires no heavy build-steps or Node.js environment, it can be tested instantly.

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/darksentinel.git
   cd darksentinel
   ```
2. Start a local server (using Python, for example):
   ```bash
   python -m http.server 8080
   ```
   *(Alternatively, use VS Code Live Server or simply open `index.html` in your browser).*
3. Navigate to `http://localhost:8080` in your web browser.

## 📸 Platform Previews

| Platform Dashboard | Exposure Scanner |
| --- | --- |
| Centralized intel alerts, source breakdowns, and integrated SOC monitoring. | Live API calls to determine if a specific email has been compromised in any known breaches. |

| Threat Intelligence | Compliance Reports |
| --- | --- |
| Deep-dive timelines, dark web mentions, and indicators of compromise (IOCs). | One-click report generation for executive briefings and GDPR notification frameworks. |

---

*Built with ❤️ for the 36-Hour Hackathon.*
