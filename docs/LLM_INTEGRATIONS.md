# LLM Integration Guides

Welcome to the JEAN-MICHEL-REPOS integration documentation. These guides show how to add token tracking and REST protocol enforcement to your LLM workflows.

---

## Supported LLMs

- **Claude** (Anthropic) - Full integration ✅
- **Codex** (OpenAI) - Full integration ✅
- **GPT-4** (OpenAI) - Full integration ✅
- **Kimi** (Moonshot) - Full integration ✅
- **PaLM** (Google) - Full integration ✅
- **GitHub Copilot Agents** - Full integration ✅

---

## Quick Start Guides

### For Claude Users
→ [Claude Integration Guide](./CLAUDE_INTEGRATION.md)

Set up token tracking for Claude API calls with declarative YAML configuration.

### For Copilot Agent Developers
→ [Copilot Agent Integration Guide](./AGENTS_INTEGRATION.md)

Integrate REST protocol enforcement into long-running agent tasks.

### For OpenAI Users (Codex/GPT-4)
→ [Coming Soon](./OPENAI_INTEGRATION.md)

### For Other LLMs
→ [Generic LLM Hook Guide](./GENERIC_LLM_INTEGRATION.md)

---

## The 3M Token Protocol

All integrations follow the same wellness framework:

```
0 - 2M tokens:   ✓ Continue working
2M tokens:       ⚠️  WARNING - Prepare for break
3M tokens:       🚨 HARD STOP - REST ENFORCED
```

---

## How It Works

### 1. Hook Into Your LLM

```javascript
const tokenHook = new LLMTokenHook();
```

### 2. Create a Session

```javascript
tokenHook.createSessionHook(sessionId, 'claude', metadata);
```

### 3. Report Token Usage

```javascript
const result = tokenHook.reportTokenUsage(sessionId, tokensUsed);
```

### 4. Respect the Protocol

```javascript
if (result.status === 'HARD_STOP') {
  // REST is mandatory - stop execution
  throw new Error('REST_PROTOCOL_ENFORCED');
}
```

---

## Declarative Configuration

Each integration supports YAML-based configuration:

```yaml
rest_protocol:
  enabled: true
  max_tokens_per_session: 3_000_000
  warning_threshold: 2_000_000
  enforcement: hard_stop
  logging: true
```

---

## Example: Claude

```javascript
const LLMTokenHook = require('jean-michel-repos/src/llm-token-hook');
const Anthropic = require('@anthropic-ai/sdk');

const hook = new LLMTokenHook();
const client = new Anthropic();

// Initialize
const sessionId = 'session-' + Date.now();
hook.createSessionHook(sessionId, 'claude');

// Make API call
const response = await client.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }]
});

// Report usage
const result = hook.reportTokenUsage(
  sessionId,
  response.usage.input_tokens + response.usage.output_tokens
);

// Check status
if (result.status === 'HARD_STOP') {
  console.error(result.message);
  throw new Error('REST ENFORCED');
}
```

---

## Monitoring

### Check Session Stats

```javascript
const stats = hook.getSessionStats(sessionId);
console.log(stats);
// { sessionId, provider, tokens, duration, warnings, restTaken }
```

### View Dashboard

```javascript
hook.dashboard();
// Shows all active sessions with token usage
```

---

## Environment Variables

All integrations support configuration via environment:

```bash
JEAN_MICHEL_REPOS_ENABLED=true
JEAN_MICHEL_REPOS_MAX_TOKENS=3000000
JEAN_MICHEL_REPOS_WARNING_THRESHOLD=2000000
JEAN_MICHEL_REPOS_LOGGING=true
```

---

## Contributing

Have an integration for another LLM? We'd love to add it!

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## Learn More

- [Main README](../README.md)
- [Wellness Manifesto](../.github/WELLNESS_MANIFESTO.md)
- [Token Counter System](../src/token-counter.js)
- [LLM Token Hook](../src/llm-token-hook.js)
