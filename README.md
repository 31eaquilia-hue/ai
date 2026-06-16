## 🚀 PowerfulAI - Advanced AI Engine

A comprehensive, production-ready JavaScript AI engine combining neural networks, natural language processing, machine learning, and autonomous agents.

### Features

- 🧠 **Neural Networks** - Multi-layer perceptron with ReLU, Sigmoid, and Tanh activation functions
- 📝 **Natural Language Processing** - Tokenization, sentiment analysis, entity extraction, intent recognition
- 🤖 **Machine Learning** - Supervised learning, clustering, classification, regression
- 👥 **Autonomous Agents** - Self-directed entities with goals, learning, and decision-making
- 💾 **Memory System** - Long-term and short-term memory with TTL support
- 📊 **Advanced Math** - Backpropagation, gradient descent, softmax, normalization

### Installation

```bash
npm install
```

### Quick Start

```javascript
const PowerfulAI = require('./index');

// Create an AI instance
const ai = new PowerfulAI({
  modelSize: 'large',
  learningRate: 0.01,
  maxIterations: 1000
});

// Process natural language
const result = await ai.think('Hello! I love this amazing AI!');
console.log(result.sentiment); // { sentiment: 'positive', ... }

// Train a machine learning model
await ai.learn(trainingData, trainingLabels);

// Make predictions
const prediction = await ai.predict(newData);

// Create autonomous agents
const agent = ai.createAgent('Explorer', ['Explore', 'Learn', 'Report']);
await agent.execute({ input: 'Analyze this data' });
```

### Core Components

#### 1. Neural Network Engine (`src/core/engine.js`)

Multi-layer neural network with:
- Customizable layer architecture
- Forward and backward propagation
- Multiple activation functions (ReLU, Sigmoid, Tanh)
- Memory system for knowledge storage

```javascript
ai.engine.forward(inputArray);          // Forward pass
ai.engine.backward(gradientArray);      // Backward pass
ai.engine.remember('key', value);       // Store memory
ai.engine.recall('key');                // Retrieve memory
```

#### 2. Natural Language Processor (`src/nlp/processor.js`)

Complete NLP pipeline:
- **Tokenization** - Break text into tokens
- **Sentiment Analysis** - Classify sentiment with scoring
- **Entity Extraction** - Extract emails, URLs, dates, numbers
- **Intent Recognition** - Classify user intent
- **Vocabulary Management** - Build and manage vocabulary

```javascript
const result = await ai.nlp.process(text);
// Returns: tokens, sentiment, entities, intent, confidence

ai.nlp.analyzeSentiment(text);          // Detailed sentiment
ai.nlp.extractEntities(text);           // Named entities
ai.nlp.tokenize(text);                  // Tokenization
```

#### 3. Machine Learning (`src/ml/trainer.js`)

Powerful ML capabilities:
- **Supervised Learning** - Classification and regression
- **Clustering** - K-means clustering
- **Training** - Iterative learning with loss calculation
- **Prediction** - Inference on new data

```javascript
// Train a model
await ai.learn(trainingData, trainingLabels);

// Make predictions
const pred = await ai.predict(newData);

// Cluster data
const clusters = ai.ml.cluster(data, k=3);
```

#### 4. Autonomous Agents (`src/agents/agent.js`)

Self-directed AI agents:
- Goal-oriented execution
- Decision making
- Experience and learning
- Memory management
- Status tracking

```javascript
const agent = ai.createAgent(
  'AgentName',
  ['Goal 1', 'Goal 2'],
  ['capability1', 'capability2']
);

const result = await agent.execute(context);
// Returns: decisions, results, success, experience gained, score
```

### Advanced Usage Examples

#### NLP Example
```javascript
const text = 'I absolutely love this fantastic product!';
const analysis = await ai.think(text);

console.log(analysis.sentiment);      // { sentiment: 'positive', score: 3, ... }
console.log(analysis.tokens);         // ['i', 'absolutely', 'love', ...]
console.log(analysis.intent);         // 'sentiment_positive'
console.log(analysis.confidence);     // 0.85
```

#### ML Training Example
```javascript
// Prepare data
const data = [[1,2,3], [2,3,4], [8,9,10], [9,10,11]];
const labels = [0, 0, 1, 1];

// Train
const result = await ai.learn(data, labels);
console.log(`Accuracy: ${result.accuracy * 100}%`);

// Predict
const prediction = await ai.predict([1.5, 2.5, 3.5]);
console.log(prediction.prediction);   // 0.23
console.log(prediction.confidence);   // 0.9
```

#### Agent Swarm Example
```javascript
// Create multiple agents
const agents = [
  ai.createAgent('Analyzer', ['Analyze data', 'Find patterns']),
  ai.createAgent('Optimizer', ['Optimize', 'Improve', 'Enhance']),
  ai.createAgent('Reporter', ['Report', 'Document', 'Communicate'])
];

// Execute them in parallel
const results = await ai.executeAgents({
  input: 'Process this data',
  data: complexData
});
```

#### Memory System Example
```javascript
// Store information
ai.engine.remember('user_preference', { theme: 'dark' });
ai.engine.remember('temp_data', largeData, 60000); // TTL: 60 seconds

// Retrieve
const pref = ai.engine.recall('user_preference');

// Information expires automatically
setTimeout(() => {
  console.log(ai.engine.recall('temp_data')); // null (expired)
}, 61000);
```

### Architecture Overview

```
PowerfulAI
├── Core Engine
│   ├── Neural Layers
│   ├── Forward/Backward Pass
│   ├── Weight Optimization
│   └── Memory System
├── NLP Processor
│   ├── Tokenizer
│   ├── Sentiment Analyzer
│   ├── Entity Extractor
│   └── Intent Classifier
├── Machine Learning
│   ├── Neural Networks
│   ├── Classification
│   ├── Regression
│   └── Clustering
└── Agent System
    ├── Autonomous Agents
    ├── Goal Management
    ├── Decision Making
    └── Learning & Experience
```

### Performance Characteristics

- **Neural Network**: 3 hidden layers, ~400 total neurons
- **Training**: Gradient descent with adjustable learning rate
- **Clustering**: K-means algorithm with convergence detection
- **NLP**: Real-time tokenization and sentiment analysis
- **Agents**: Asynchronous execution with parallel processing support

### Configuration Options

```javascript
const ai = new PowerfulAI({
  modelSize: 'large',              // Model size
  learningRate: 0.01,              // Learning rate for training
  maxIterations: 1000,             // Max training iterations
  enableNLP: true,                 // Enable NLP module
  enableML: true,                  // Enable ML module
  enableAgents: true               // Enable agent system
});
```

### Running the Example

```bash
npm start
```

This will run `example.js` which demonstrates:
1. Natural Language Processing
2. Machine Learning Training & Prediction
3. Autonomous Agents Execution
4. Model Information Display

### API Reference

```javascript
// AI Creation
const ai = new PowerfulAI(config);

// NLP
await ai.think(text);
ai.nlp.tokenize(text);
ai.nlp.analyzeSentiment(text);
ai.nlp.extractEntities(text);

// Machine Learning
await ai.learn(data, labels);
await ai.predict(input);
ai.ml.cluster(data, k);

// Agents
ai.createAgent(name, goals, capabilities);
await ai.executeAgents(context);

// Engine
ai.engine.forward(input);
ai.engine.backward(gradient);
ai.engine.remember(key, value);
ai.engine.recall(key);

// Info
ai.getModelInfo();
```

### License

MIT

### Author

31eaquilia-hue

---

**PowerfulAI**: Building the future of JavaScript-based artificial intelligence. 🚀
