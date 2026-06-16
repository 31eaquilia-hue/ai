/**
 * PowerfulAI - Example Usage
 */

const PowerfulAI = require('./index');

async function main() {
  console.log('🚀 Initializing PowerfulAI...\n');

  // Create AI instance
  const ai = new PowerfulAI({
    modelSize: 'large',
    learningRate: 0.01,
    maxIterations: 100,
    enableNLP: true,
    enableML: true,
    enableAgents: true
  });

  // ===== EXAMPLE 1: Natural Language Processing =====
  console.log('📝 Example 1: Natural Language Processing\n');
  
  const textExamples = [
    'Hello! I love this amazing AI system!',
    'What is machine learning?',
    'I want to create a new project'
  ];

  for (const text of textExamples) {
    const result = await ai.think(text);
    console.log(`Input: "${text}"`);
    console.log(`Tokens: ${result.tokens.join(', ')}`);
    console.log(`Intent: ${result.intent}`);
    console.log(`Sentiment: ${result.sentiment.sentiment}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(0)}%\n`);
  }

  // ===== EXAMPLE 2: Machine Learning =====
  console.log('🧠 Example 2: Machine Learning\n');

  // Training data: simple classification
  const trainingData = [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [5, 6, 7, 8, 9],
    [6, 7, 8, 9, 10],
    [1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9]
  ];
  const trainingLabels = [0, 0, 1, 1, 0, 1];

  console.log('Training ML model...');
  const trainResult = await ai.learn(trainingData, trainingLabels);
  console.log(`Model trained - Accuracy: ${(trainResult.accuracy * 100).toFixed(2)}%`);
  console.log(`Final Loss: ${trainResult.finalLoss.toFixed(4)}\n`);

  // Make predictions
  console.log('Making predictions:');
  const testData = [
    [1, 2, 3, 4, 5],
    [8, 8, 8, 8, 8]
  ];

  for (const data of testData) {
    const prediction = await ai.predict(data);
    console.log(`Input: [${data.join(', ')}]`);
    console.log(`Prediction: ${prediction.prediction.toFixed(3)}`);
    console.log(`Confidence: ${(prediction.confidence * 100).toFixed(0)}%\n`);
  }

  // ===== EXAMPLE 3: Autonomous Agents =====
  console.log('🤖 Example 3: Autonomous Agents\n');

  // Create agents with different goals
  const analyst = ai.createAgent(
    'DataAnalyst',
    ['Analyze trends', 'Find patterns', 'Report insights'],
    ['analyze', 'compute', 'report']
  );

  const researcher = ai.createAgent(
    'Researcher',
    ['Learn from data', 'Discover knowledge', 'Generate hypotheses'],
    ['research', 'learn', 'hypothesize']
  );

  // Execute agents
  const agentResults = await ai.executeAgents({
    input: 'Analyze this important data for insights',
    data: trainingData
  });

  console.log('Agent Execution Results:');
  for (const result of agentResults) {
    console.log(`\nAgent: ${result.agent.name}`);
    console.log(`Status: ${result.result.status}`);
    console.log(`Experience Gained: ${result.result.experience.toFixed(3)}`);
    console.log(`Score: ${result.result.score.toFixed(1)}`);
    console.log(`Execution Time: ${result.result.executionTime}ms`);
  }

  // ===== EXAMPLE 4: Model Information =====
  console.log('\n\n📊 Model Information:\n');
  const info = ai.getModelInfo();
  console.log(JSON.stringify(info, null, 2));

  console.log('\n✅ PowerfulAI Example Complete!');
}

// Run the example
main().catch(console.error);
