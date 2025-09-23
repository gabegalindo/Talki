# Talki

Talki: it means Talk in English and Bunny in Korean! Talki is a voice-driven chat application with frontend and backend components. The frontend is a Next.js app that provides a conversational UI and media upload endpoints; the backend is a Flask-based service that handles audio processing, text-to-speech and speech-to-text, and image generation.


## Demo video

<https://youtu.be/gc4kM7IjK_0>
##

This repository contains two main folders:

- `Talki-back/`: Python backend (Flask) — audio generation, speech-to-text (STT), and image generation utilities.
- `Talki-front/`: Next.js frontend — user interface, API routes that call the backend, and chat components.

**Table of contents**

- Installation
- Backend (Talki-back)
- Frontend (Talki-front)
- Project structure
- Troubleshooting
- Contributing

## Installation

Prerequisites

- Node.js (16+) and npm or Yarn for the frontend
- Python 3.10+ for the backend
- Optional: Google Cloud credentials for TTS/STT if used (`Talki-back/my-gcp-credentials.json`)

Clone the repository and change into the workspace root:

```bash
git clone <your-repo-url>
cd Talki
```

## Backend (Talki-back)

1. Create and activate a Python virtual environment, then install dependencies:

```bash
cd Talki-back
python -m venv .venv
.venv\Scripts\activate    # Windows (cmd.exe)
# or: source .venv/bin/activate    # macOS / Linux
pip install -r requirements.txt
```

2. Credentials

- If using Google Cloud TTS/STT, place your service account JSON in `Talki-back/my-gcp-credentials.json` and set the environment variable:

```bash
set GOOGLE_APPLICATION_CREDENTIALS=%CD%\\my-gcp-credentials.json
```

3. Run the backend

```bash
python app.py
```

The backend serves endpoints used by the frontend and writes generated media into `Talki-back/static/`.

## Frontend (Talki-front)

1. Install dependencies and run the Next.js app:

```bash
cd ..\\Talki-front
npm install
npm run dev
```

2. By default the frontend expects the backend to be reachable via the API routes defined in `app/api/*` (the frontend includes server-side API routes that may proxy or call the backend). If the backend runs on a different host/port, update the frontend API base URL (look for `fetch` calls or environment variables in `Talki-front/app/api` routes).


## Project structure

- `Talki-back/`

  - `app.py` — Flask application entrypoint
  - `services.py` — backend helper functions used by the app
  - `requirements.txt` — Python dependencies
  - `my-gcp-credentials.json` — (optional) Google Cloud credentials (NOT checked into VCS)
  - `static/` — generated audio and image assets

- `Talki-front/`
  - `app/` — Next.js app
  - `app/api/` — Next.js API routes
  - `app/components/` — React components used by the UI

## Troubleshooting

- If you see errors related to Google Cloud authentication, confirm `GOOGLE_APPLICATION_CREDENTIALS` points to a valid service account JSON and that required APIs are enabled.
- For CORS or proxy issues, ensure the frontend can reach the backend host and port, or configure a proxy in development.

## Contributing

Contributions welcome. Create issues or pull requests for bug fixes or feature additions. Keep secrets and credentials out of commits.
