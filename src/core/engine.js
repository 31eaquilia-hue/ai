/**
 * Core AI Engine
 * Implements neural network-like architecture with:
 * - Layers (input, hidden, output)
 * - Activation functions
 * - Backpropagation
 * - Weight optimization
 */

class NeuralLayer {
  constructor(inputSize, outputSize, activationFn = 'relu') {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.activationFn = activationFn;
    
    // Initialize weights and biases
    this.weights = this._initializeWeights(inputSize, outputSize);
    this.biases = new Array(outputSize).fill(0).map(() => Math.random() * 0.01);
    this.cache = {};
  }

  _initializeWeights(inputSize, outputSize) {
    const weights = [];
    const stdDev = Math.sqrt(2 / inputSize);
    for (let i = 0; i < outputSize; i++) {
      weights[i] = [];
      for (let j = 0; j < inputSize; j++) {
        weights[i][j] = (Math.random() - 0.5) * stdDev;
      }
    }
    return weights;
  }

  forward(input) {
    const output = [];
    for (let i = 0; i < this.outputSize; i++) {
      let sum = this.biases[i];
      for (let j = 0; j < this.inputSize; j++) {
        sum += input[j] * this.weights[i][j];
      }
      output[i] = this._activate(sum);
    }
    this.cache.input = input;
    this.cache.preActivation = output.map((_, i) => {
      let sum = this.biases[i];
      for (let j = 0; j < this.inputSize; j++) {
        sum += input[j] * this.weights[i][j];
      }
      return sum;
    });
    return output;
  }

  backward(gradient, learningRate = 0.01) {
    const inputGradient = new Array(this.inputSize).fill(0);
    const weightGradient = [];

    for (let i = 0; i < this.outputSize; i++) {
      const derivative = this._activationDerivative(this.cache.preActivation[i]);
      const delta = gradient[i] * derivative;

      for (let j = 0; j < this.inputSize; j++) {
        inputGradient[j] += delta * this.weights[i][j];
        if (!weightGradient[i]) weightGradient[i] = [];
        weightGradient[i][j] = delta * this.cache.input[j];
      }

      this.biases[i] -= learningRate * delta;
    }

    for (let i = 0; i < this.outputSize; i++) {
      for (let j = 0; j < this.inputSize; j++) {
        this.weights[i][j] -= learningRate * weightGradient[i][j];
      }
    }

    return inputGradient;
  }

  _activate(x) {
    switch (this.activationFn) {
      case 'relu':
        return Math.max(0, x);
      case 'sigmoid':
        return 1 / (1 + Math.exp(-x));
      case 'tanh':
        return Math.tanh(x);
      default:
        return x;
    }
  }

  _activationDerivative(x) {
    switch (this.activationFn) {
      case 'relu':
        return x > 0 ? 1 : 0;
      case 'sigmoid': {
        const s = 1 / (1 + Math.exp(-x));
        return s * (1 - s);
      }
      case 'tanh': {
        const t = Math.tanh(x);
        return 1 - t * t;
      }
      default:
        return 1;
    }
  }
}

class AIEngine {
  constructor(config = {}) {
    this.config = config;
    this.layers = [];
    this.memory = {};
    this.learningRate = config.learningRate || 0.01;
    
    // Build default neural network
    this._buildNetwork();
  }

  _buildNetwork() {
    // Input layer: 128 neurons
    // Hidden layer 1: 256 neurons with ReLU
    // Hidden layer 2: 128 neurons with ReLU
    // Output layer: 64 neurons with Sigmoid
    
    this.layers.push(new NeuralLayer(128, 256, 'relu'));
    this.layers.push(new NeuralLayer(256, 128, 'relu'));
    this.layers.push(new NeuralLayer(128, 64, 'sigmoid'));
  }

  /**
   * Forward pass through the network
   */
  forward(input) {
    if (input.length !== 128) {
      throw new Error('Input must be array of 128 values');
    }

    let data = input;
    for (const layer of this.layers) {
      data = layer.forward(data);
    }
    return data;
  }

  /**
   * Backward pass for training
   */
  backward(gradient) {
    for (let i = this.layers.length - 1; i >= 0; i--) {
      gradient = this.layers[i].backward(gradient, this.learningRate);
    }
  }

  /**
   * Store information in memory
   */
  remember(key, value, ttl = null) {
    const entry = { value, timestamp: Date.now() };
    if (ttl) {
      entry.expiresAt = Date.now() + ttl;
    }
    this.memory[key] = entry;
  }

  /**
   * Retrieve from memory
   */
  recall(key) {
    const entry = this.memory[key];
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      delete this.memory[key];
      return null;
    }
    return entry.value;
  }

  /**
   * Clear memory
   */
  clearMemory() {
    this.memory = {};
  }

  /**
   * Get engine information
   */
  getInfo() {
    return {
      type: 'Neural Network Engine',
      layers: this.layers.length,
      totalNeurons: this.layers.reduce((sum, l) => sum + l.outputSize, 0),
      learningRate: this.learningRate,
      memoryUsage: Object.keys(this.memory).length,
      memoryItems: Object.keys(this.memory)
    };
  }
}

module.exports = AIEngine;
