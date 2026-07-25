/**
 * Token Counter
 * Tracks token consumption in vibe coding sessions
 */

const THREE_MILLION_TOKENS = 3_000_000;
const WARNING_THRESHOLD_TOKENS = 2_000_000;

class TokenCounter {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create a new session
   */
  createSession(sessionId, metadata = {}) {
    this.sessions.set(sessionId, {
      id: sessionId,
      tokens: 0,
      startTime: Date.now(),
      metadata,
      warnings: [],
      restTaken: false
    });
    return this.sessions.get(sessionId);
  }

  /**
   * Add tokens to a session
   */
  addTokens(sessionId, tokenCount) {
    if (!this.sessions.has(sessionId)) {
      this.createSession(sessionId);
    }

    const session = this.sessions.get(sessionId);
    session.tokens += tokenCount;

    // Check warnings
    if (session.tokens >= WARNING_THRESHOLD_TOKENS && session.tokens < THREE_MILLION_TOKENS) {
      if (!session.warnings.includes('2M')) {
        session.warnings.push('2M');
        return this.getWarning(session);
      }
    }

    // Check hard stop
    if (session.tokens >= THREE_MILLION_TOKENS && !session.restTaken) {
      return this.getHardStop(session);
    }

    return { status: 'ok', tokens: session.tokens };
  }

  /**
   * Get warning message at 2M tokens
   */
  getWarning(session) {
    const remaining = THREE_MILLION_TOKENS - session.tokens;
    return {
      status: 'warning',
      tokens: session.tokens,
      milestone: '2M',
      message: `⚠️  You've hit 2 million tokens. ${remaining.toLocaleString()} tokens remaining before REST protocol activates.`,
      action: 'prepare for a break soon'
    };
  }

  /**
   * Get hard stop message at 3M tokens
   */
  getHardStop(session) {
    return {
      status: 'HARD_STOP',
      tokens: session.tokens,
      milestone: '3M',
      message: `🚨 JEAN-MICHEL-REPOS: 3 MILLION TOKENS REACHED 🚨

You've hit the limit. Your vibe is legendary. But your REST is overdue.

REST PROTOCOL ACTIVATED:
• Close your laptop
• Step outside
• Drink water
• Sleep 6-8 hours
• Return tomorrow refreshed

Your code will be there. Promise. 🌙`,
      action: 'MANDATORY REST - no iteration until REST protocol complete',
      restRequired: true
    };
  }

  /**
   * Mark session as having taken REST
   */
  completeRest(sessionId) {
    if (this.sessions.has(sessionId)) {
      this.sessions.get(sessionId).restTaken = true;
      return { status: 'rest_logged', sessionId };
    }
    return { status: 'session_not_found', sessionId };
  }

  /**
   * Get session stats
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get all active sessions
   */
  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  /**
   * Format tokens for display
   */
  static formatTokens(count) {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(2)}M`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(2)}K`;
    }
    return count.toString();
  }
}

// Export for use in other modules
module.exports = TokenCounter;

// CLI usage
if (require.main === module) {
  const counter = new TokenCounter();
  const sessionId = 'demo-session-' + Date.now();

  console.log('🧘 JEAN-MICHEL-REPOS Token Counter Demo\n');

  // Simulate progression
  const milestones = [1_000_000, 2_000_000, 2_500_000, 3_000_000];

  for (const tokens of milestones) {
    const result = counter.addTokens(sessionId, tokens);
    console.log(`Tokens: ${TokenCounter.formatTokens(tokens)}`);
    console.log(`Result: ${result.message}\n`);
  }
}
