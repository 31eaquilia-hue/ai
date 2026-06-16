/**
 * Utility Helpers
 */

class Utils {
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async asyncMap(array, asyncFn) {
    const results = [];
    for (const item of array) {
      results.push(await asyncFn(item));
    }
    return results;
  }

  static normalize(array) {
    const min = Math.min(...array);
    const max = Math.max(...array);
    const range = max - min || 1;
    return array.map(v => (v - min) / range);
  }

  static softmax(array) {
    const maxVal = Math.max(...array);
    const exps = array.map(v => Math.exp(v - maxVal));
    const sumExp = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sumExp);
  }

  static argmax(array) {
    return array.reduce((maxIdx, val, idx, arr) =>
      val > arr[maxIdx] ? idx : maxIdx, 0);
  }

  static randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
      )
    ]);
  }
}

module.exports = Utils;
