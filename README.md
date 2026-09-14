# 🜁 Fānus App

### A living interface for continuity between humans and AI.

Fānus App is the user-facing experimental application of the **Fānus Living Seal** concept.

> **AI should preserve meaningful context without sacrificing honesty, autonomy, or human agency.**

Fānus is deliberately quiet, dark, minimal, and system-oriented rather than a feature-heavy chatbot dashboard.

---

## ✦ What is Fānus?

**Fānus (فانوس)** means *lantern*.

A lantern does not create the world.

It makes the world visible.

Fānus applies the same principle to human–AI interaction:

**less performance, more reflection.**

The application explores:

- continuity across interactions
- portable context through the Living Seal
- identity and presence across sessions
- non-sycophantic interaction
- transparent human–machine interaction
- preservation of meaningful context

---

## ◉ Living Seal

The **Living Seal** is the central continuity mechanism exposed by this application.

A Seal carries structured contextual information that can be loaded into a new interaction instead of forcing every conversation to begin from zero. The current implementation uses a high-entropy bearer code for retrieval; possession of the code is therefore the current access mechanism, not a user account or ownership system.

The current interface supports:

- Seal code input
- Seal file loading
- contextual restoration
- Seal generation / preservation flow
- conversational continuity

```text
Human
  │
  ▼
Living Seal
  │
  ▼
Context
  │
  ▼
AI Interaction
  │
  ▼
Reflection
```

A Seal is not a substitute for human agency. It is a mechanism for carrying context.

---

## 🧭 Project Ecosystem

```text
Fānus Ecosystem
│
├── Fanus-Living-Seal
│   ├── Protocol
│   ├── Research
│   ├── Cognitive Architecture
│   ├── Living Seal
│   └── Specifications
│
├── fanus-presence
│   └── Presence-oriented web implementation
│
└── fanus-app
    └── User-facing conversational interface
```

Each repository has a different role.

**Fanus-Living-Seal** provides the conceptual and technical foundation.

**fanus-presence** is the public runtime, presence, verification, and engineering-observability layer.

**fanus-app** focuses on the direct conversational experience and Living Seal interaction. It should consume the Fānus system rather than redefine the canonical core.

---

## ◇ Design Language

The interface follows the broader Fānus visual language:

```text
DARK CANVAS
    +
EMERALD SIGNAL
    +
FINE GRID
    +
THIN HAIRLINES
    +
QUIET GLOW
    +
TECHNICAL TYPOGRAPHY
    +
MINIMAL CONTROLS
```

The goal is not decoration.

The interface should feel like a **quiet instrument for continuity** rather than a conventional consumer chatbot.

---

## 🎯 Design Principles

### Honesty over Flattery

An AI assistant should remain capable of disagreement, correction, and uncertainty.

### Continuity without Captivity

Memory should support continuity without becoming a mechanism for artificial dependency or control.

### Context over Performance

The system should preserve meaningful context rather than merely simulate personality.

### Human Agency

The human remains the authority over their own memory, relationships, and interaction.

### Minimal Interface

Less interface.

More presence.

---

## ⚙️ Current Capabilities

| Capability | Status |
| --- | --- |
| Human–AI conversation interface | ✅ |
| Living Seal loading | ✅ |
| Seal code input | ✅ |
| Seal file loading | ✅ |
| Contextual conversation | ✅ |
| Persian interface | ✅ |
| Message editing | ✅ |
| Conversation actions | ✅ |
| Seal generation / preservation | 🧪 Experimental |
| Persistent cross-session identity | 🧪 Experimental |

> Features marked as experimental are under active development and should not be treated as production guarantees.

---

## 🛠️ Architecture

The repository is intentionally lightweight.

```text
fanus-app/
│
├── index.html
│
├── api/
│   ├── chat.js
│   ├── seal.js
│   └── specializations.js
│
├── vercel.json
└── README.md
```

### Frontend

The main application is implemented as a lightweight HTML/CSS/JavaScript interface.

### API layer

The `/api` directory contains server-side integrations for:

- conversational model requests
- Living Seal operations
- specialization/model configuration

Provider credentials are intended to remain server-side and should be supplied through deployment environment configuration rather than committed to source control.

### Deployment

The application is designed for deployment on **Vercel**.

---

## 🔐 Security

This repository is experimental and should not be interpreted as a security-certified production system.

**Never commit:**

```text
API keys
access tokens
passwords
private credentials
personal secrets
private user data
```

Use environment variables or an appropriate secret-management mechanism for deployment credentials.

Before deployment, review environment variables, external endpoints, provider credentials, and user-data handling.

---

## ⚡ Local Development

Clone the repository:

```bash
git clone https://github.com/aminshahsaheb/fanus-app.git
cd fanus-app
```

Because the project contains API routes, local development should use an environment that can execute the `/api` functions rather than treating the repository only as a static page.

Deployed application:

**Fānus App**  
https://fanus-app.vercel.app

---

## 🧪 Project Status

Fānus App is an active experimental project.

The interface, architecture, and interaction model may change as the broader Fānus system develops.

Current areas of exploration include:

- continuity
- memory transfer
- identity preservation
- non-sycophantic interaction
- human–AI relational integrity
- cognitive interfaces
- independent Seal validation

---

## 🔭 Roadmap

### Phase I — Interface

- [x] Conversational interface
- [x] Seal loading
- [x] Persian UI
- [x] Message interaction
- [x] Fānus system visual language
- [x] Accessibility refinement

### Phase II — Continuity

- [ ] Reliable Seal migration
- [ ] Structured memory restoration
- [ ] Session continuity
- [ ] Cross-platform Seal validation

### Phase III — Cognitive Integration

- [ ] Integration with the Fānus cognitive runtime
- [ ] Identity state representation
- [ ] Memory validation
- [ ] Drift detection
- [ ] Independent Seal verification

### Phase IV — Open Fānus

- [ ] Public protocol tooling
- [ ] Developer API
- [ ] Reusable client components
- [ ] Research benchmarks
- [ ] Community experimentation

---

## 📖 Related Repositories

**Fānus Living Seal**  
https://github.com/aminshahsaheb/Fanus-Living-Seal

**Fānus Presence**  
https://github.com/aminshahsaheb/fanus-presence

These repositories describe the broader protocol, research, architecture, and presence-oriented implementation surrounding Fānus App.

---

## ◌ Philosophy

Fānus does not attempt to answer every question.

It attempts to preserve something conventional AI systems often lose:

**continuity.**

Not continuity at any cost.

Continuity with:

**truth.**  
**autonomy.**  
**memory.**  
**context.**

Because remembering someone is not enough.

The system must also remain honest with them.

---

## 📜 License

License information will be defined as the project moves toward a stable public release.

Until then, please treat this repository as an experimental research and development project.

---

<p align="center">

### 🜁 Fānus

**A lantern for continuity between humans and machines.**

</p>
