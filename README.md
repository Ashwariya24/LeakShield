# LeakShield
A **Dark Web Monitoring and Credential Leak Alert System** is a cybersecurity tool that scans sources like Pastebin, GitHub, and breach services such as HaveIBeenPwned to detect leaked credentials linked to an organization’s email domain and instantly alerts the security team.

This project monitors publicly available sources to detect leaked credentials related to an organisation's email domain.

## Features

- GitHub public repository monitoring
- Breach database lookup
- Credential detection
- Email alerts
- Web dashboard

## Tech Stack

Frontend: HTML, CSS, JavaScript  
Backend: Python Flask  
APIs: HaveIBeenPwned

## How to Run

pip install -r requirements.txt

python backend/app.py
