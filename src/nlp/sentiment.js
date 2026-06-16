/**
 * Sentiment Analyzer
 */

class SentimentAnalyzer {
  constructor() {
    this.positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful',
      'love', 'like', 'enjoy', 'happy', 'perfect', 'awesome', 'brilliant'
    ];

    this.negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad',
      'poor', 'worst', 'ugly', 'annoying', 'stupid', 'useless'
    ];

    this.intensifiers = ['very', 'really', 'so', 'extremely', 'incredibly'];
    this.negators = ['no', 'not', 'never', 'neither', 'nobody', 'nothing'];
  }

  analyze(text) {
    const lower = text.toLowerCase();
    const tokens = lower.split(/\W+/);

    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const isNegated = i > 0 && this.negators.includes(tokens[i - 1]);
      const multiplier = i > 0 && this.intensifiers.includes(tokens[i - 1]) ? 1.5 : 1;

      if (this.positiveWords.includes(token)) {
        score += multiplier * (isNegated ? -1 : 1);
        positiveCount++;
      } else if (this.negativeWords.includes(token)) {
        score -= multiplier * (isNegated ? -1 : 1);
        negativeCount++;
      }
    }

    const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    const magnitude = Math.abs(score) / Math.max(positiveCount + negativeCount, 1);

    return {
      sentiment,
      score,
      magnitude: Math.min(1, magnitude),
      positive: positiveCount,
      negative: negativeCount
    };
  }
}

module.exports = SentimentAnalyzer;
