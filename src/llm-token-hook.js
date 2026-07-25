/**
 * LLM Token Hook System
 * Integrates with multiple LLM providers to track token usage
 * Supports: Claude, Codex, Kimi, and others
 */

const TokenCounter = require('./token-counter');

class LLMTokenHook {
  constructor() {
    this.counter = new TokenCounter();
    this.providers = new Map();
    this.registerProviders();
  }

  /**
   * Register available LLM providers
   */
  registerProviders() {
    this.providers.set('claude', {
      name: 'Claude (Anthropic)',
      statusEndpoint: '/usage',
      tokenField: 'tokens_used',
      maxTokens: Infinity,
    });

    this.providers.set('codex', {
      name: 'Codex (OpenAI)',
      statusEndpoint: '/v1/usage',
      tokenField: 'total_tokens',
      maxTokens: Infinity,
    });

    this.providers.set('kimi', {
      name: 'Kimi',
      statusEndpoint: '/status',
      tokenField: 'tokens_consumed',
      maxTokens: Infinity,
    });

    this.providers.set('gpt-4', {
      name: 'GPT-4 (OpenAI)',
      statusEndpoint: '/v1/usage',
      tokenField: 'total_tokens',
      maxTokens: Infinity,
    });

    this.providers.set('palm', {
      name: 'PaLM (Google)',
      statusEndpoint: '/v1/status',
      tokenField: 'usage_tokens',
      maxTokens: Infinity,
    });
  }

  /**
   * Get all registered providers
   */
  getProviders() {
    return Array.from(this.providers.values());
  }

  /**
   * Create a session hook for an LLM provider
   */
  createSessionHook(sessionId, provider, metadata = {}) {
    if (!this.providers.has(provider)) {
      throw new Error(`Unknown provider: ${provider}. Available: ${Array.from(this.providers.keys()).join(', ')}`);
    }

    const providerConfig = this.providers.get(provider);
    this.counter.createSession(sessionId, {
      provider,
      ...providerConfig,
      ...metadata,
      hookCreatedAt: new Date().toISOString()
    });

    return {
      sessionId,
      provider: providerConfig.name,
      statusEndpoint: providerConfig.statusEndpoint,
      message: `✓ Token hook initialized for ${providerConfig.name}`
    };
  }

  /**
   * Report token usage from LLM provider
   * Called after each API call to the LLM
   */
  reportTokenUsage(sessionId, tokenCount, metadata = {}) {
    try {
      const result = this.counter.addTokens(sessionId, tokenCount);

      return {
        status: result.status,
        tokens: result.tokens,
        milestone: result.milestone,
        message: result.message,
        metadata
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Middleware for API calls - wrap this around your LLM API calls
   */
  middleware(provider) {
    return async (apiCall) => {
      const sessionId = apiCall.sessionId || 'default-' + Date.now();

      // Initialize session if needed
      if (!this.counter.getSession(sessionId)) {
        this.createSessionHook(sessionId, provider);
      }

      // Execute the API call
      const response = await apiCall.execute();

      // Extract and report token usage
      const tokensUsed = this.extractTokens(response, provider);
      if (tokensUsed > 0) {
        const result = this.reportTokenUsage(sessionId, tokensUsed, {
          endpoint: apiCall.endpoint,
          model: apiCall.model,
          timestamp: new Date().toISOString()
        });

        // Check if we hit the limit
        if (result.status === 'HARD_STOP') {
          console.error(`\n🚨 ${result.message}`);
          throw new Error('REST_PROTOCOL_ENFORCED: 3M tokens reached. Take a break.');
        }
      }

      return response;
    };
  }

  /**
   * Extract token count from LLM response
   */
  extractTokens(response, provider) {
    const providerConfig = this.providers.get(provider);
    if (!providerConfig) return 0;

    // Handle different response formats
    if (response.usage) {
      return response.usage.total_tokens || response.usage.tokens_used || 0;
    }

    if (response.data && response.data.tokens_used) {
      return response.data.tokens_used;
    }

    if (response.tokens_consumed) {
      return response.tokens_consumed;
    }

    return 0;
  }

  /**
   * Get current session stats
   */
  getSessionStats(sessionId) {
    const session = this.counter.getSession(sessionId);
    if (!session) {
      return { status: 'session_not_found', sessionId };
    }

    const duration = (Date.now() - session.startTime) / 1000 / 60;
    const provider = session.metadata?.provider || 'unknown';

    return {
      sessionId,
      provider,
      tokens: TokenCounter.formatTokens(session.tokens),
      duration: `${duration.toFixed(1)} min`,
      warnings: session.warnings,
      restTaken: session.restTaken
    };
  }

  /**
   * Generate a dashboard of all active sessions
   */
  dashboard() {
    const sessions = this.counter.getAllSessions();

    console.log('\n🧘 JEAN-MICHEL-REPOS: LLM Token Dashboard');
    console.log('═══════════════════════════════════════════\n');

    if (sessions.length === 0) {
      console.log('No active sessions.\n');
      return;
    }

    sessions.forEach(session => {
      const stats = this.getSessionStats(session.id);
      console.log(`📊 ${stats.provider} Session`);
      console.log(`   ID: ${stats.sessionId}`);
      console.log(`   Tokens: ${stats.tokens}`);
      console.log(`   Duration: ${stats.duration}`);
      console.log(`   REST Status: ${session.restTaken ? '✓ COMPLETED' : '✗ PENDING'}`);
      console.log('');
    });
  }
}

module.exports = LLMTokenHook;
