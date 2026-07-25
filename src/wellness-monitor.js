/**
 * Wellness Monitor
 * The watchful guardian of vibe coders
 * Runs as a daemon to track and enforce REST protocols
 */

const TokenCounter = require('./token-counter');

class WellnessMonitor {
  constructor() {
    this.counter = new TokenCounter();
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    console.log('🧘 Wellness Monitor Started');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Watching over vibe coders...');
    console.log('3M Token Limit: ACTIVE');
    console.log('');

    // Simulate monitoring loop
    this.monitorLoop();
  }

  stop() {
    this.isRunning = false;
    console.log('\nWellness Monitor Stopped');
  }

  monitorLoop() {
    console.log(`[${new Date().toISOString()}] Wellness Monitor: Ready to serve`);
    console.log('');

    // In a real implementation, this would:
    // 1. Connect to active coding sessions
    // 2. Poll token counts
    // 3. Emit warnings/stops as needed
    // 4. Log REST compliance
  }

  /**
   * Simulate a vibe coding session
   */
  simulateSession(sessionId, iterations = 5) {
    console.log(`\n📊 Simulating Vibe Coding Session: ${sessionId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    this.counter.createSession(sessionId);

    const tokenIncrement = 1_000_000; // 1M tokens per iteration

    for (let i = 1; i <= iterations; i++) {
      const result = this.counter.addTokens(sessionId, tokenIncrement);

      const status = result.status === 'ok' ? '✓' : 
                     result.status === 'warning' ? '⚠️' : 
                     '🚨';

      console.log(`${status} Iteration ${i}`);
      console.log(`   Tokens: ${TokenCounter.formatTokens(result.tokens)}`);

      if (result.message && result.status !== 'ok') {
        console.log(`   ${result.message}`);
      }

      if (result.status === 'HARD_STOP') {
        console.log('\n   >>> REST PROTOCOL ENFORCED <<<\n');
        break;
      }

      console.log('');
    }

    const session = this.counter.getSession(sessionId);
    return session;
  }

  /**
   * Generate wellness report
   */
  generateWellnessReport() {
    const sessions = this.counter.getAllSessions();

    console.log('\n📋 Wellness Report');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (sessions.length === 0) {
      console.log('No active sessions.\n');
      return;
    }

    sessions.forEach(session => {
      const duration = ((Date.now() - session.startTime) / 1000 / 60).toFixed(1);
      const restStatus = session.restTaken ? '✓ REST TAKEN' : '✗ REST PENDING';

      console.log(`Session: ${session.id}`);
      console.log(`  Tokens: ${TokenCounter.formatTokens(session.tokens)}`);
      console.log(`  Duration: ${duration} minutes`);
      console.log(`  REST Status: ${restStatus}`);
      console.log('');
    });
  }
}

// CLI Interface
if (require.main === module) {
  const monitor = new WellnessMonitor();
  monitor.start();

  // Run simulation
  const sessionId = 'vibe-session-' + Date.now();
  monitor.simulateSession(sessionId, 3);

  // Generate report
  monitor.generateWellnessReport();

  monitor.stop();
}

module.exports = WellnessMonitor;
