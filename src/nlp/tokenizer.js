/**
 * Tokenizer - Break text into tokens
 */

class Tokenizer {
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  tokenizeWithPOS(text) {
    const tokens = this.tokenize(text);
    return tokens.map(token => ({
      token,
      pos: this._estimatePOS(token)
    }));
  }

  _estimatePOS(token) {
    if (['the', 'a', 'an'].includes(token)) return 'DET';
    if (['is', 'are', 'was', 'be'].includes(token)) return 'VERB';
    if (['and', 'or', 'but'].includes(token)) return 'CONJ';
    return 'NOUN';
  }
}

module.exports = Tokenizer;
