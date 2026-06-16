/**
 * Autonomous Agent
 * Self-directed entity that can:
 * - Set and achieve goals
 * - Learn from experience
 * - Make decisions
 * - Execute tasks
 */

class Agent {
  constructor(name, goals = [], capabilities = [], ai) {
    this.name = name;
    this.goals = goals;
    this.capabilities = capabilities;
    this.ai = ai;
    this.memory = [];
    this.status = 'idle';
    this.score = 0;
    this.experience = 0;
  }

  /**
   * Execute agent logic
   */
  async execute(context = {}) {
    this.status = 'executing';
    const startTime = Date.now();

    try {
      // Process context with NLP
      let analysis = null;
      if (this.ai.nlp && context.input) {
        analysis = await this.ai.nlp.process(context.input);
        this.memory.push({ timestamp: Date.now(), input: context.input, analysis });
      }

      // Make decisions based on goals
      const decisions = this._makeDecisions(context, analysis);

      // Execute actions
      const results = await this._executeActions(decisions);

      // Learn from experience
      this._updateExperience(results);

      this.status = 'completed';
      return {
        agent: this.name,
        decisions,
        results,
        success: true,
        experience: this.experience,
        score: this.score,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      this.status = 'error';
      return {
        agent: this.name,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Make decisions
   */
  _makeDecisions(context, analysis) {
    const decisions = [];

    for (const goal of this.goals) {
      const decision = {
        goal,
        reasoning: this._evaluateGoal(goal, context, analysis),
        confidence: Math.random() * 0.3 + 0.7,
        priority: Math.floor(Math.random() * 10)
      };
      decisions.push(decision);
    }

    // Sort by priority
    return decisions.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Evaluate goal
   */
  _evaluateGoal(goal, context, analysis) {
    if (!analysis) return `Working on goal: ${goal}`;

    const sentiment = analysis.sentiment?.sentiment || 'neutral';
    const intent = analysis.intent || 'unknown';

    return `Goal: ${goal}, Context sentiment: ${sentiment}, Intent: ${intent}`;
  }

  /**
   * Execute actions
   */
  async _executeActions(decisions) {
    const results = [];

    for (const decision of decisions) {
      const action = {
        decision: decision.goal,
        capability: this.capabilities[0] || 'think',
        result: await this._performAction(decision),
        timestamp: Date.now()
      };
      results.push(action);
    }

    return results;
  }

  /**
   * Perform an action
   */
  async _performAction(decision) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          status: 'success',
          output: `Completed: ${decision.goal}`,
          reward: Math.random()
        });
      }, Math.random() * 100);
    });
  }

  /**
   * Update experience
   */
  _updateExperience(results) {
    for (const result of results) {
      const reward = result.result?.reward || 0;
      this.experience += reward;
      this.score += reward * 10;
    }
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      name: this.name,
      status: this.status,
      goals: this.goals.length,
      capabilities: this.capabilities,
      experience: this.experience,
      score: this.score,
      memory: this.memory.length
    };
  }
}

module.exports = Agent;
