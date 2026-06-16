/**
 * PowerfulAI - A comprehensive AI engine
 * Combines NLP, Machine Learning, Neural Networks, and Agent Architecture
 */

const AIEngine = require('./src/core/engine');
const NLPProcessor = require('./src/nlp/processor');
const MachineLearning = require('./src/ml/trainer');
const Agent = require('./src/agents/agent');
const Utils = require('./src/utils/helpers');

class PowerfulAI {
  constructor(config = {}) {
    this.config = {
      modelSize: config.modelSize || 'large',
      learningRate: config.learningRate || 0.01,
      maxIterations: config.maxIterations || 1000,
      enableNLP: config.enableNLP !== false,
      enableML: config.enableML !== false,
      enableAgents: config.enableAgents !== false,
      ...config
    };

    this.engine = new AIEngine(this.config);
    this.nlp = this.config.enableNLP ? new NLPProcessor(this.config) : null;
    this.ml = this.config.enableML ? new MachineLearning(this.config) : null;
    this.agents = [];
    
    console.log('🤖 PowerfulAI initialized with config:', this.config);
  }

  /**
   * Process natural language input
   */
  async think(input) {
    if (!this.nlp) {
      throw new Error('NLP processor not enabled');
    }
    return await this.nlp.process(input);
  }

  /**
   * Learn from training data
   */
  async learn(trainingData, labels) {
    if (!this.ml) {
      throw new Error('Machine Learning not enabled');
    }
    return await this.ml.train(trainingData, labels);
  }

  /**
   * Predict outputs for new inputs
   */
  async predict(input) {
    if (!this.ml) {
      throw new Error('Machine Learning not enabled');
    }
    return await this.ml.predict(input);
  }

  /**
   * Create and manage autonomous agents
   */
  createAgent(name, goals, capabilities = []) {
    const agent = new Agent(name, goals, capabilities, this);
    this.agents.push(agent);
    console.log(`✅ Agent "${name}" created with goals:`, goals);
    return agent;
  }

  /**
   * Execute all agents
   */
  async executeAgents(context) {
    const results = [];
    for (const agent of this.agents) {
      const result = await agent.execute(context);
      results.push({ agent: agent.name, result });
    }
    return results;
  }

  /**
   * Retrieve model information
   */
  getModelInfo() {
    return {
      engine: this.engine.getInfo(),
      nlp: this.nlp ? this.nlp.getInfo() : null,
      ml: this.ml ? this.ml.getInfo() : null,
      agents: this.agents.length,
      config: this.config
    };
  }
}

module.exports = PowerfulAI;
