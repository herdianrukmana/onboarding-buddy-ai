# Onboarding Buddy AI 🤝

AI-powered onboarding assistant for new employees. Built with **Node.js + Express** and **OpenAI GPT-4o-mini**, with a vanilla HTML/CSS/JS chat interface.

---

## Features

- 💬 **Conversational chat** — Ask anything about culture, tools, workflows, and policies
- 📋 **Interactive 30-60-90 day checklist** — Track progress with persistent localStorage state
- 👋 **Personalized welcome** — AI greets each new employee by name and role
- 🛡️ **Built-in guardrails** — Won't fabricate HR/payroll/legal policy; escalates sensitive topics
- 🌐 **Language-adaptive** — Follows the employee's language (Indonesian or otherwise)

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your OpenAI key
Edit `.env` and replace the placeholder:
```
OPENAI_API_KEY=sk-your-real-key-here
OPENAI_MODEL=gpt-4o-mini       # or gpt-4o for higher quality
COMPANY_NAME=PT Nama Perusahaan
```

### 3. Start the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

Fill in the employee setup form and start chatting!

---

## Project Structure

```
├── server.js              # Express server + /api/chat + /api/welcome endpoints
├── prompts/
│   └── onboarding.js      # System prompt builder (inject employee context)
├── data/
│   └── checklist.json     # 30-60-90 day onboarding checklist items
├── public/
│   └── index.html         # Vanilla HTML/CSS/JS chat UI
├── .env                   # Environment variables (never commit this)
└── package.json
```

---

## Customization

### Edit the checklist
Modify [`data/checklist.json`](data/checklist.json) to match your company's onboarding steps.

### Edit the AI behavior / guardrails
Modify [`prompts/onboarding.js`](prompts/onboarding.js) — the `buildSystemPrompt()` function assembles the full system prompt with employee context injected.

### Change the model
In `.env`:
- `gpt-4o-mini` — faster, cheaper (recommended for most use cases)
- `gpt-4o` — higher quality, more expensive

---

## Escalation Rules (built-in)
The AI will proactively suggest escalating to a human if:
- Account/device access issues blocking work for more than 2 hours
- Personal HR questions (contract, compensation, conflicts)
- Unclear task priorities from the manager

---

## Security Notes
- Never commit `.env` to version control (it's in `.gitignore`)
- The API key is used server-side only — never exposed to the browser
- Employee data entered in the form stays in-browser (not persisted server-side)
