/**
 * Entity Extractor
 * Extract named entities like names, places, organizations
 */

class EntityExtractor {
  constructor() {
    this.patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      url: /https?:\/\/[^\s]+/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      number: /\b\d+(\.\d+)?\b/g,
      date: /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b/g
    };
  }

  extract(text) {
    const entities = [];

    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        entities.push({
          type,
          value: match[0],
          position: match.index
        });
      }
    }

    return entities;
  }

  extractNamed(text) {
    const tokens = text.split(/\s+/);
    const named = [];

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i][0] === tokens[i][0].toUpperCase()) {
        const entity = {
          type: 'ENTITY',
          value: tokens[i],
          position: i
        };
        named.push(entity);
      }
    }

    return named;
  }
}

module.exports = EntityExtractor;
