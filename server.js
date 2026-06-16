/**
 * PowerfulAI Web Server
 * Provides REST API and Web Interface
 */

const http = require('http');
const url = require('url');
const PowerfulAI = require('./index');

// Initialize AI
const ai = new PowerfulAI({
  modelSize: 'large',
  learningRate: 0.01,
  maxIterations: 100,
  enableNLP: true,
  enableML: true,
  enableAgents: true
});

const PORT = 3000;

// HTML Dashboard
const htmlDashboard = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 PowerfulAI Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .subtitle {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .card h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5em;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: 500;
        }
        
        input, textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #eee;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: transform 0.2s;
        }
        
        button:hover {
            transform: scale(1.05);
        }
        
        button:active {
            transform: scale(0.98);
        }
        
        .result {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-top: 15px;
            border-radius: 5px;
            display: none;
        }
        
        .result.show {
            display: block;
        }
        
        .result pre {
            overflow-x: auto;
            color: #333;
            font-size: 0.9em;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .stats {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 20px;
            color: white;
            margin-bottom: 30px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .stat-item {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .loading {
            display: none;
            text-align: center;
            color: #667eea;
            font-weight: 600;
        }
        
        .loading.show {
            display: block;
        }
        
        .error {
            background: #fee;
            border-left-color: #f44;
            color: #c00;
        }
        
        .success {
            background: #efe;
            border-left-color: #4f4;
            color: #040;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🤖 PowerfulAI Dashboard</h1>
            <p class="subtitle">Advanced AI Engine with NLP, ML & Autonomous Agents</p>
        </header>
        
        <div class="stats">
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value" id="neuronsCount">400+</div>
                    <div class="stat-label">Neural Neurons</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="layersCount">3</div>
                    <div class="stat-label">Network Layers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="agentsCount">0</div>
                    <div class="stat-label">Active Agents</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="memoryCount">0</div>
                    <div class="stat-label">Memory Items</div>
                </div>
            </div>
        </div>
        
        <div class="grid">
            <!-- NLP Section -->
            <div class="card">
                <h2>📝 Natural Language Processing</h2>
                <div class="form-group">
                    <label for="nlpInput">Enter text to analyze:</label>
                    <textarea id="nlpInput" placeholder="Type something..." rows="4"></textarea>
                </div>
                <button onclick="processNLP()">Analyze</button>
                <div class="loading" id="nlpLoading">Processing...</div>
                <div class="result" id="nlpResult"></div>
            </div>
            
            <!-- ML Section -->
            <div class="card">
                <h2>🧠 Machine Learning</h2>
                <div class="form-group">
                    <label for="mlInput">Input data (comma separated):</label>
                    <input type="text" id="mlInput" placeholder="e.g., 1,2,3,4,5">
                </div>
                <button onclick="makePrediction()">Predict</button>
                <div class="loading" id="mlLoading">Processing...</div>
                <div class="result" id="mlResult"></div>
            </div>
            
            <!-- Agent Section -->
            <div class="card">
                <h2>👥 Autonomous Agents</h2>
                <div class="form-group">
                    <label for="agentName">Agent Name:</label>
                    <input type="text" id="agentName" placeholder="e.g., DataAnalyzer">
                </div>
                <div class="form-group">
                    <label for="agentGoal">Goal:</label>
                    <input type="text" id="agentGoal" placeholder="e.g., Analyze data">
                </div>
                <button onclick="createAgent()">Create Agent</button>
                <div class="loading" id="agentLoading">Processing...</div>
                <div class="result" id="agentResult"></div>
            </div>
            
            <!-- Model Info Section -->
            <div class="card">
                <h2>ℹ️ Model Information</h2>
                <button onclick="getModelInfo()">Get Model Info</button>
                <div class="loading" id="infoLoading">Loading...</div>
                <div class="result" id="infoResult"></div>
            </div>
        </div>
    </div>
    
    <script>
        async function processNLP() {
            const input = document.getElementById('nlpInput').value;
            if (!input.trim()) {
                alert('Please enter some text');
                return;
            }
            
            document.getElementById('nlpLoading').classList.add('show');
            document.getElementById('nlpResult').classList.remove('show');
            
            try {
                const response = await fetch('/api/nlp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: input })
                });
                const data = await response.json();
                
                const resultDiv = document.getElementById('nlpResult');
                if (data.error) {
                    resultDiv.innerHTML = '<pre>' + data.error + '</pre>';
                    resultDiv.classList.add('error');
                } else {
                    resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    resultDiv.classList.remove('error');
                    resultDiv.classList.add('success');
                }
                resultDiv.classList.add('show');
            } catch (error) {
                console.error('Error:', error);
            } finally {
                document.getElementById('nlpLoading').classList.remove('show');
            }
        }
        
        async function makePrediction() {
            const input = document.getElementById('mlInput').value;
            if (!input.trim()) {
                alert('Please enter data');
                return;
            }
            
            document.getElementById('mlLoading').classList.add('show');
            document.getElementById('mlResult').classList.remove('show');
            
            try {
                const data = input.split(',').map(x => parseFloat(x.trim()));
                if (data.length !== 5 || data.some(isNaN)) {
                    throw new Error('Please enter exactly 5 numbers separated by commas');
                }
                
                const response = await fetch('/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: data })
                });
                const result = await response.json();
                
                const resultDiv = document.getElementById('mlResult');
                resultDiv.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                resultDiv.classList.add('success');
                resultDiv.classList.remove('error');
                resultDiv.classList.add('show');
            } catch (error) {
                const resultDiv = document.getElementById('mlResult');
                resultDiv.innerHTML = '<pre>' + error.message + '</pre>';
                resultDiv.classList.add('error');
                resultDiv.classList.remove('success');
                resultDiv.classList.add('show');
            } finally {
                document.getElementById('mlLoading').classList.remove('show');
            }
        }
        
        async function createAgent() {
            const name = document.getElementById('agentName').value;
            const goal = document.getElementById('agentGoal').value;
            
            if (!name.trim() || !goal.trim()) {
                alert('Please fill in all fields');
                return;
            }
            
            document.getElementById('agentLoading').classList.add('show');
            document.getElementById('agentResult').classList.remove('show');
            
            try {
                const response = await fetch('/api/agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name, goal: goal })
                });
                const data = await response.json();
                
                const resultDiv = document.getElementById('agentResult');
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                resultDiv.classList.add('success');
                resultDiv.classList.remove('error');
                resultDiv.classList.add('show');
                
                document.getElementById('agentName').value = '';
                document.getElementById('agentGoal').value = '';
                updateStats();
            } catch (error) {
                console.error('Error:', error);
            } finally {
                document.getElementById('agentLoading').classList.remove('show');
            }
        }
        
        async function getModelInfo() {
            document.getElementById('infoLoading').classList.add('show');
            document.getElementById('infoResult').classList.remove('show');
            
            try {
                const response = await fetch('/api/info');
                const data = await response.json();
                
                const resultDiv = document.getElementById('infoResult');
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                resultDiv.classList.add('show');
                
                updateStats();
            } catch (error) {
                console.error('Error:', error);
            } finally {
                document.getElementById('infoLoading').classList.remove('show');
            }
        }
        
        async function updateStats() {
            try {
                const response = await fetch('/api/info');
                const data = await response.json();
                
                document.getElementById('agentsCount').textContent = data.agents || 0;
                document.getElementById('memoryCount').textContent = data.engine?.memoryUsage || 0;
            } catch (error) {
                console.error('Error updating stats:', error);
            }
        }
        
        // Update stats on load
        window.addEventListener('load', updateStats);
        // Update stats every 5 seconds
        setInterval(updateStats, 5000);
    </script>
</body>
</html>
`;

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Dashboard
    if (pathname === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlDashboard);
      return;
    }

    // API: NLP Processing
    if (pathname === '/api/nlp' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { text } = JSON.parse(body);
          const result = await ai.think(text);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    // API: Prediction
    if (pathname === '/api/predict' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { data } = JSON.parse(body);
          const result = await ai.predict(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    // API: Create Agent
    if (pathname === '/api/agent' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { name, goal } = JSON.parse(body);
          const agent = ai.createAgent(name, [goal], ['analyze', 'learn', 'report']);
          const result = await agent.execute({ input: goal });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    // API: Model Info
    if (pathname === '/api/info' && req.method === 'GET') {
      const info = ai.getModelInfo();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(info));
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 PowerfulAI Server Started!');
  console.log('═'.repeat(60));
  console.log(`\n📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log('\nAvailable Endpoints:');
  console.log('  POST /api/nlp        - Natural Language Processing');
  console.log('  POST /api/predict    - Machine Learning Prediction');
  console.log('  POST /api/agent      - Create & Execute Agent');
  console.log('  GET  /api/info       - Model Information');
  console.log('\n' + '═'.repeat(60) + '\n');
});
