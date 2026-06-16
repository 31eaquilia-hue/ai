/**
 * Machine Learning Trainer
 * Implements:
 * - Supervised learning
 * - Clustering
 * - Classification
 * - Regression
 */

class MachineLearning {
  constructor(config = {}) {
    this.config = config;
    this.models = new Map();
    this.trainingData = [];
    this.learningRate = config.learningRate || 0.01;
    this.maxIterations = config.maxIterations || 1000;
  }

  /**
   * Train a model on data
   */
  async train(data, labels, modelName = 'default') {
    if (data.length !== labels.length) {
      throw new Error('Data and labels must have same length');
    }

    const model = {
      data,
      labels,
      weights: this._initializeWeights(data[0].length),
      bias: 0,
      accuracy: 0,
      loss: [],
      trained: false
    };

    // Training loop
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      let totalLoss = 0;
      const predictions = [];

      for (let i = 0; i < data.length; i++) {
        const prediction = this._predict(data[i], model.weights, model.bias);
        predictions.push(prediction);
        totalLoss += Math.pow(prediction - labels[i], 2);
      }

      // Update weights
      const gradient = this._calculateGradient(data, labels, model.weights, predictions);
      model.weights = model.weights.map((w, i) => w - this.learningRate * gradient[i]);

      totalLoss /= data.length;
      model.loss.push(totalLoss);

      if (iteration % 100 === 0) {
        console.log(`Training iteration ${iteration}, Loss: ${totalLoss.toFixed(4)}`);
      }
    }

    model.accuracy = this._calculateAccuracy(data, labels, model.weights, model.bias);
    model.trained = true;
    this.models.set(modelName, model);

    return {
      modelName,
      accuracy: model.accuracy,
      finalLoss: model.loss[model.loss.length - 1],
      iterations: this.maxIterations
    };
  }

  /**
   * Make predictions
   */
  async predict(input, modelName = 'default') {
    const model = this.models.get(modelName);
    if (!model || !model.trained) {
      throw new Error(`Model ${modelName} not found or not trained`);
    }

    const prediction = this._predict(input, model.weights, model.bias);
    return {
      prediction,
      confidence: Math.abs(prediction - Math.round(prediction)) < 0.5 ? 0.9 : 0.7
    };
  }

  /**
   * Cluster data (K-means)
   */
  cluster(data, k = 3) {
    const centroids = this._initializeCentroids(data, k);
    let assignments = new Array(data.length).fill(0);
    let changed = true;
    let iterations = 0;

    while (changed && iterations < 100) {
      // Assign points to nearest centroid
      const newAssignments = data.map(point =>
        centroids.reduce((min, c, i) => {
          const dist = this._euclideanDistance(point, c);
          return dist < this._euclideanDistance(point, centroids[min]) ? i : min;
        }, 0)
      );

      // Check if assignments changed
      changed = !newAssignments.every((a, i) => a === assignments[i]);
      assignments = newAssignments;

      // Update centroids
      for (let i = 0; i < k; i++) {
        const points = data.filter((_, j) => assignments[j] === i);
        if (points.length > 0) {
          centroids[i] = this._calculateMean(points);
        }
      }

      iterations++;
    }

    return {
      clusters: centroids,
      assignments,
      iterations
    };
  }

  /**
   * Calculate prediction
   */
  _predict(input, weights, bias) {
    let sum = bias;
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * weights[i];
    }
    return 1 / (1 + Math.exp(-sum)); // Sigmoid
  }

  /**
   * Calculate gradient
   */
  _calculateGradient(data, labels, weights, predictions) {
    const gradient = new Array(weights.length).fill(0);
    for (let i = 0; i < data.length; i++) {
      const error = predictions[i] - labels[i];
      for (let j = 0; j < weights.length; j++) {
        gradient[j] += error * data[i][j];
      }
    }
    return gradient.map(g => g / data.length);
  }

  /**
   * Calculate accuracy
   */
  _calculateAccuracy(data, labels, weights, bias) {
    let correct = 0;
    for (let i = 0; i < data.length; i++) {
      const prediction = this._predict(data[i], weights, bias) > 0.5 ? 1 : 0;
      if (prediction === labels[i]) correct++;
    }
    return correct / data.length;
  }

  /**
   * Initialize weights
   */
  _initializeWeights(size) {
    return new Array(size).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }

  /**
   * Initialize centroids
   */
  _initializeCentroids(data, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
      centroids.push(data[Math.floor(Math.random() * data.length)]);
    }
    return centroids;
  }

  /**
   * Euclidean distance
   */
  _euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }

  /**
   * Calculate mean
   */
  _calculateMean(data) {
    const mean = new Array(data[0].length).fill(0);
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        mean[j] += data[i][j];
      }
    }
    return mean.map(m => m / data.length);
  }

  /**
   * Get ML info
   */
  getInfo() {
    return {
      type: 'Machine Learning Engine',
      models: this.models.size,
      trainedModels: Array.from(this.models.keys()),
      learningRate: this.learningRate,
      maxIterations: this.maxIterations
    };
  }
}

module.exports = MachineLearning;
