# Prompt Maker

Transform a short idea into a complete, structured, paste-ready prompt for AI platforms such as Claude, ChatGPT, Trae, Gemini, and Universal AI tools.

**BY SASAM**

---

## Features

- **Real working app** — the first screen is the tool itself, not a marketing page.
- **Core idea input** with character counting and validation.
- **Project categories**: Web App, Game, Mobile, Automation, Content, Other.
- **AI targets**: Claude, ChatGPT, Trae, Gemini, Universal.
- **Detail levels**: Concise, Balanced, Comprehensive.
- **Optional** technology stack and constraints.
- **Output language** selection (English, 中文, Español, Français, Deutsch, 日本語, Português).
- Generates a **title, summary, paste-ready prompt, and assumptions**.
- Uses the **JembatanAI FreeAI** OpenAI-compatible API through a secure, server-side API route.
- **Zod** validation on both request and AI response.
- **API key stays server-side** and is never exposed to the browser.
- **Safe model fallback** — tries multiple models if one fails.
- **Copy** and **text download** actions for the generated prompt.
- **Local browser history** — latest 20 prompts, with restore / delete / clear.
- **Example preset** for quick testing.
- **Original-IP safety**: prompts referencing existing games/projects only keep broad genre conventions and generate original characters, assets, worlds, names, music, and visual identity.
- **Editorial workspace design**, light + dark themes (saved preference), emerald + amber accents, readable typography, subtle prompt-themed visual effects, loading shimmer, result transitions, and accessible focus states.
- **Responsive and accessible**, with explicit empty / loading / validation / success / error states.
- **Reduced-motion support.**

---

## Requirements

- Node.js **18.18+** (tested on Node 24)
- npm (bundled with Node)
- A **JembatanAI FreeAI API key** (base URL: `https://freeai.jembatanai.com`)

## Live deployment

- **Production:** https://prompt-maker-sable.vercel.app
- **Repository:** https://github.com/sasam44/prompt-maker

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env.local

# 3. Add your API key to .env.local
#    API_KEY=your_jembatanai_api_key_here
#    API_BASE_URL=https://freeai.jembatanai.com

# 4. Run the development server
npm run dev
```

Then open http://localhost:3000

---

## Setup on Windows

### Prerequisites

1. Install **Node.js LTS** from https://nodejs.org/ (the installer adds `node` and `npm` to your PATH automatically).
2. Verify in a terminal (Command Prompt, PowerShell, or Windows Terminal):

```powershell
node --version
npm --version
```

### Steps

```powershell
# PowerShell / CMD
cd C:\Users\YOUR_USER\path\to\prompt-maker

npm install

# Create the environment file
# (PowerShell)
Copy-Item .env.example .env.local
#   or (CMD)
# copy .env.example .env.local

# Edit .env.local and add your API key, then:
npm run dev
```

Open http://localhost:3000

---

## Setup on WSL (Windows Subsystem for Linux)

### Prerequisites

1. Install WSL 2 if you haven't (run in **PowerShell as Administrator**):

```powershell
wsl --install
```

2. Restart your machine when prompted.
3. Install Node.js inside WSL:

```bash
# Inside WSL
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Or use **nvm**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts
```

Verify:

```bash
node --version
npm --version
```

### Steps

```bash
cd /mnt/c/Users/YOUR_USER/path/to/prompt-maker
# or copy the project into your WSL home: cp -r /mnt/c/.../prompt-maker ~/

npm install
cp .env.example .env.local
# edit .env.local and add your API key (nano .env.local)
npm run dev
```

Open http://localhost:3000 in your browser on Windows.

> Note: running the project from a Windows filesystem mount (`/mnt/c/...`) can be slower. Copy the project to your WSL home (`~/prompt-maker`) for best performance.

---

## Environment variables

| Variable         | Required | Description                                  |
|------------------|----------|----------------------------------------------|
| `API_KEY`        | Yes      | JembatanAI FreeAI access key.                |
| `API_BASE_URL`   | No       | API base URL (default `https://freeai.jembatanai.com`). |
| `API_MODELS`     | No       | Comma-separated model IDs to try in order (fallback). |

Never commit `.env.local`. It is already in `.gitignore`.

---

## Scripts

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm run dev`        | Start the development server         |
| `npm run build`      | Create an optimized production build |
| `npm run start`      | Start the production server          |
| `npm run lint`       | Run ESLint (flat config, `eslint .`) |
| `npm run typecheck`  | Run TypeScript checks                |

---

## API key

The app uses the **JembatanAI FreeAI** OpenAI-compatible endpoint: `https://freeai.jembatanai.com`.

The key (`API_KEY`) and base URL (`API_BASE_URL`) are read **only on the server** inside `app/api/generate/route.ts`. The browser never sees them — all generation happens via a server-side API route that calls `/v1/chat/completions`.

Available models (set via `API_MODELS`, comma-separated, tried in order):

- `openai/gpt-5.6-luna`
- `anthropic/claude-sonnet-5`
- `deepseek/deepseek-v4-pro-0813`
- `deepseek/deepseek-v4.1-flash`
- `z-ai/glm-5.2`
- `z-ai/glm-5.3-flash`

---

## Project structure

```
prompt-maker/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # Server-side Gemini generation
│   ├── globals.css             # Global styles, themes, animations
│   ├── layout.tsx              # Root layout, fonts
│   └── page.tsx                # Main workspace page
├── components/
│   ├── empty-state.tsx
│   ├── header.tsx
│   ├── history-panel.tsx
│   ├── loading-state.tsx
│   ├── prompt-form.tsx
│   └── result-card.tsx
├── lib/
│   ├── api.ts                  # Browser → API client
│   ├── gemini.ts               # Prompt construction + JSON parsing (OpenAI-compatible)
│   ├── types.ts                # Shared types & presets
│   ├── use-history.ts          # Local history hook
│   ├── use-theme.ts            # Theme hook
│   └── validation.ts           # Zod schemas
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## License

© SASAM. All rights reserved.
