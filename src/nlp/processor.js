/**
 * Natural Language Processor
 * Handles:
 * - Text tokenization
 * - Sentiment analysis
 * - Entity extraction
 * - Intent recognition
 * - Language understanding
 */

const Tokenizer = require('./tokenizer');
const SentimentAnalyzer = require('./sentiment');
const EntityExtractor = require('./entities');

class NLPProcessor {
  constructor(config = {}) {
    this.config = config;
    this.tokenizer = new Tokenizer();
    this.sentiment = new SentimentAnalyzer();
    this.entities = new EntityExtractor();
    this.vocabulary = new Map();
    this.intents = new Map();
  }

  /**
   * Process text input
   */
  async process(text) {
    const result = {
      input: text,
      tokens: this.tokenizer.tokenize(text),
      sentiment: this.sentiment.analyze(text),
      entities: this.entities.extract(text),
      intent: this._classifyIntent(text),
      confidence: 0,
      processed: true
    };

    result.confidence = this._calculateConfidence(result);
    return result;
  }

  /**
   * Tokenize text
   */
  tokenize(text) {
    return this.tokenizer.tokenize(text);
  }

  /**
   * Analyze sentiment
   */
  analyzeSentiment(text) {
    return this.sentiment.analyze(text);
  }

  /**
   * Extract entities (names, places, etc)
   */
  extractEntities(text) {
    return this.entities.extract(text);
  }

  /**
   * Classify intent
   */
  _classifyIntent(text) {
    const keywords = {
      'greeting': ['hello', 'hi', 'hey', 'greetings', 'welcome'],
      'question': ['what', 'when', 'where', 'who', 'why', 'how'],
      'command': ['do', 'make', 'create', 'delete', 'update', 'run'],
      'statement': ['i', 'you', 'is', 'are', 'the'],
      'sentiment_positive': ['good', 'great', 'excellent', 'amazing', 'love'],
      'sentiment_negative': ['bad', 'terrible', 'hate', 'awful', 'poor']
    };

    const lower = text.toLowerCase();
    const tokens = lower.split(/\W+/);
    const intents = {};

    for (const [intent, words] of Object.entries(keywords)) {
      intents[intent] = tokens.filter(t => words.includes(t)).length;
    }

    const maxIntent = Object.entries(intents).sort((a, b) => b[1] - a[1])[0];
    return maxIntent[1] > 0 ? maxIntent[0] : 'unknown';
  }

  /**
   * Calculate confidence score
   */
  _calculateConfidence(result) {
    let confidence = 0.5; // base confidence

    if (result.tokens.length > 2) confidence += 0.1;
    if (result.sentiment !== null) confidence += 0.1;
    if (result.entities.length > 0) confidence += 0.1;
    if (result.intent !== 'unknown') confidence += 0.2;

    return Math.min(1, confidence);
  }

  /**
   * Train on new vocabulary
   */
  addVocabulary(word, metadata = {}) {
    this.vocabulary.set(word.toLowerCase(), {
      word,
      frequency: (this.vocabulary.get(word.toLowerCase())?.frequency || 0) + 1,
      ...metadata
    });
  }

  /**
   * Get processor info
   */
  getInfo() {
    return {
      type: 'Natural Language Processor',
      vocabulary: this.vocabulary.size,
      intents: this.intents.size,
      capabilities: ['tokenization', 'sentiment', 'entities', 'intent']
    };
  }
}

module.exports = NLPProcessor;
