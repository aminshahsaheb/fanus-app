# 🜁 FĀNUS APP

<p align="center"><img src="assets/fanus-app-hero.svg" alt="Fānus App — continuity without noise" width="100%"></p>
<p align="center"><strong>A quiet interface for continuity between humans and AI.</strong></p>
<p align="center"><a href="https://fanus-app.vercel.app"><strong>OPEN FĀNUS →</strong></a> · <a href="https://github.com/aminshahsaheb/fanus-presence">PRESENCE</a> · <a href="https://github.com/aminshahsaheb/Fanus-Living-Seal">LIVING SEAL</a></p>

> **Less performance. More reflection.**

---

## ◈ THE IDEA

**Fānus** (فانوس) means *lantern*.

A lantern does not create the world.  
It makes the world visible.

Fānus App applies that idea to human–AI interaction: a deliberately quiet interface for conversation, contextual continuity, and the **Living Seal**.

The application explores how an AI experience can preserve meaningful context **without sacrificing honesty, autonomy, or human agency**.

---

## ◇ WHAT IT DOES

| Layer | Purpose |
| --- | --- |
| **Conversation** | Direct human–AI interaction |
| **Living Seal** | Portable contextual continuity |
| **Specialization** | Domain-aware model routing |
| **Context files** | Optional user-provided text context |

The goal is not to build another feature-heavy chatbot dashboard. The interface is intentionally restrained.

---

## ◉ LIVING SEAL

The Living Seal is the continuity mechanism exposed by the app.

<pre>              HUMAN
                │
                ▼
          ┌───────────┐
          │   SEAL    │
          └─────┬─────┘
                │
                ▼
             CONTEXT
                │
                ▼
          AI CONVERSATION
                │
                ▼
            REFLECTION</pre>

A user can load an existing Seal by code or file, continue a contextual conversation, and generate/preserve a Seal from the interaction.

### Security boundary

The current Seal-code mechanism is a **bearer access mechanism**: possession of the code permits retrieval. It is not an account, authentication identity, or proof of ownership.

**Treat generated Seal codes as secrets.**

---

## 🧭 ECOSYSTEM

<pre>                    FĀNUS
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
 Living Seal       Presence        App
 canonical       runtime /       direct
 foundation       observe       experience
                      │
                      ▼
                  Fanus 1</pre>

**Fanus-Living-Seal** — canonical conceptual and technical foundation.

**fanus-presence** — presence, runtime, verification, and engineering-observability surface.

**fanus-app** — direct conversational interface and Living Seal interaction.

The App should consume and expose the system; it should **not silently redefine the canonical core**.

---

## ◇ DESIGN SYSTEM

<pre>DARK CANVAS
      +
EMERALD SIGNAL
      +
FINE GRID
      +
HAIRLINE BORDERS
      +
QUIET GLOW
      +
PERSIAN TYPOGRAPHY
      +
MINIMAL CONTROLS</pre>

The visual system is deliberately calm.

No unnecessary dashboards.  
No visual noise.  
No artificial complexity.

**The interface should feel like an instrument, not a toy.**

---

## ⚙️ ARCHITECTURE

<pre>fanus-app/
│
├── index.html
│   └── browser UI + client interaction
│
├── api/
│   ├── chat.js
│   │   └── model routing + conversation context
│   ├── seal.js
│   │   └── Seal storage / retrieval
│   └── specializations.js
│       └── domain detection + specialization prompts
│
├── assets/
│   └── fanus-app-hero.svg
│
├── vercel.json
└── README.md</pre>

### Request flow

<pre>Browser
  │
  ├── conversation ───────► /api/chat
  │                              │
  │                              ├── specialization detection
  │                              ├── optional web context
  │                              ├── provider selection
  │                              └── fallback provider
  │
  └── Seal operations ─────► /api/seal
                                 │
                                 └── Upstash Redis</pre>

Provider credentials are intended to remain server-side through deployment environment variables.

---

## 🧠 MODEL ROUTING

The specialization layer currently recognizes domains including:

- physics, chemistry, biology, mathematics
- AI and software engineering
- philosophy, psychology, sociology, history, linguistics
- music, visual art, literature, architecture, cinema
- cybersecurity, data, robotics
- medicine, psychiatry, genetics
- economics, law, entrepreneurship
- mysticism, mythology, ethics

Detected specializations can influence model selection and response context.

**Important:** keyword detection is routing assistance, not proof of genuine domain understanding.

---

## 🔐 SECURITY POSTURE

This is an experimental application, not a security-certified system.

### Never commit

<pre>API keys
access tokens
passwords
private credentials
user secrets
private datasets</pre>

### Current protections

- request/body size limits
- Seal size limits
- rate limiting when Upstash Redis is configured
- no-store responses for sensitive Seal operations
- strict Seal-code validation
- security response headers
- server-side provider credentials
- provider fallback handling

### Seal storage

Generated Seal records are stored in Upstash Redis with a one-year expiration.

The current model therefore depends on both **code secrecy** and **storage configuration**.

---

## 🧪 CURRENT CAPABILITIES

| Capability | State |
| --- | --- |
| Persian RTL interface | ✅ |
| Human–AI conversation | ✅ |
| Multi-provider model routing | ✅ |
| Specialization detection | ✅ |
| Living Seal code loading | ✅ |
| Living Seal file loading | ✅ |
| Optional text-file context | ✅ |
| Message editing | ✅ |
| Conversation actions | ✅ |
| Seal generation / preservation | 🧪 |
| Persistent account identity | — |

🧪 indicates an experimental area.  
— means it is not represented as an account system in the current architecture.

---

## 🚀 DEPLOYMENT

The repository is structured for **Vercel serverless deployment**.

<pre>git clone https://github.com/aminshahsaheb/fanus-app.git
cd fanus-app</pre>

Configure the required environment variables in Vercel, then deploy the repository.

### Production surface

**Fānus App**  
https://fanus-app.vercel.app

---

## ◈ ENVIRONMENT

The application may use provider credentials for:

<pre>ANTHROPIC_API_KEY
GROK_API_KEY
DEEPSEEK_API_KEY
GEMINI_API_KEY
MISTRAL_API_KEY
GROQ_API_KEY
TAVILY_API_KEY

UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN</pre>

Only configure providers you actually intend to use.

---

## ◇ PRINCIPLES

### Honesty over Flattery
The system should remain capable of correction, disagreement, and uncertainty.

### Continuity without Captivity
Context should support continuity without becoming a mechanism for control.

### Human Agency
The human remains the authority over their own interaction and contextual data.

### Context over Performance
Preserve what matters instead of merely simulating personality.

### Minimal Interface
Less interface.  
More presence.

---

## ◈ STATUS

Fānus App is an **active experimental system**.

The architecture and interaction model may evolve alongside the broader Fānus ecosystem.

For the canonical protocol and deeper system research, refer to **Fanus-Living-Seal**.

For runtime, verification, and observability work, refer to **fanus-presence**.

---

<p align="center"><strong>FĀNUS</strong><br><sub>Living Seal · Conversation · Context · Agency</sub></p>
<p align="center">Ѧ-Ⱥ</p>