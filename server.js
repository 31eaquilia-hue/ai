/**
 * PowerfulAI - Claude-like Chat Interface with Code Generation
 * Features: Chat management, code generation, persistent storage
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const PowerfulAI = require('./index');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const CHATS_DIR = path.join(DATA_DIR, 'chats');
const MODELS_DIR = path.join(DATA_DIR, 'models');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(CHATS_DIR)) fs.mkdirSync(CHATS_DIR);
if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR);

// Initialize AI
let ai = new PowerfulAI({
  modelSize: 'large',
  learningRate: 0.01,
  maxIterations: 100,
  enableNLP: true,
  enableML: true,
  enableAgents: true
});

// Load persisted model data
function loadModelData() {
  const modelFile = path.join(MODELS_DIR, 'model.json');
  if (fs.existsSync(modelFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(modelFile, 'utf-8'));
      console.log('✅ Model data loaded from disk');
      return data;
    } catch (error) {
      console.log('⚠️  Could not load model data:', error.message);
    }
  }
  return null;
}

// Save model data
function saveModelData(data) {
  const modelFile = path.join(MODELS_DIR, 'model.json');
  try {
    fs.writeFileSync(modelFile, JSON.stringify(data, null, 2));
    console.log('💾 Model data saved to disk');
  } catch (error) {
    console.log('⚠️  Could not save model data:', error.message);
  }
}

// Load chat from disk
function loadChat(chatId) {
  const chatFile = path.join(CHATS_DIR, `${chatId}.json`);
  if (fs.existsSync(chatFile)) {
    return JSON.parse(fs.readFileSync(chatFile, 'utf-8'));
  }
  return null;
}

// Save chat to disk
function saveChat(chatId, chat) {
  const chatFile = path.join(CHATS_DIR, `${chatId}.json`);
  fs.writeFileSync(chatFile, JSON.stringify(chat, null, 2));
}

// Get all chats
function getAllChats() {
  const chats = [];
  if (fs.existsSync(CHATS_DIR)) {
    const files = fs.readdirSync(CHATS_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const chatId = file.replace('.json', '');
        const chat = loadChat(chatId);
        chats.push({
          id: chatId,
          title: chat.title,
          created: chat.created,
          updated: chat.updated,
          messageCount: chat.messages.length
        });
      }
    }
  }
  return chats.sort((a, b) => new Date(b.updated) - new Date(a.updated));
}

// Generate code from AI response
async function generateCode(prompt, context) {
  try {
    // Use NLP to understand the request
    const analysis = await ai.think(prompt);
    
    // Generate code based on the intent
    let code = '';
    
    if (prompt.toLowerCase().includes('function')) {
      code = `// Generated Function\nfunction ${extractName(prompt) || 'myFunction'}(params) {\n  // TODO: Implement logic\n  return result;\n}\n\nmodule.exports = ${extractName(prompt) || 'myFunction'};`;
    } else if (prompt.toLowerCase().includes('class')) {
      code = `// Generated Class\nclass ${extractName(prompt) || 'MyClass'} {\n  constructor() {\n    // Initialize\n  }\n  \n  method() {\n    // TODO: Implement\n  }\n}\n\nmodule.exports = ${extractName(prompt) || 'MyClass'};`;
    } else if (prompt.toLowerCase().includes('react') || prompt.toLowerCase().includes('component')) {
      code = `import React, { useState } from 'react';\n\nconst ${extractName(prompt) || 'Component'} = () => {\n  const [state, setState] = useState(null);\n  \n  return (\n    <div>\n      {/* TODO: Add JSX */}\n    </div>\n  );\n};\n\nexport default ${extractName(prompt) || 'Component'};`;
    } else if (prompt.toLowerCase().includes('api') || prompt.toLowerCase().includes('fetch')) {
      code = `// API Call\nasync function fetchData() {\n  try {\n    const response = await fetch('/api/endpoint');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n    throw error;\n  }\n}`;
    } else {
      code = `// Generated Code\n// ${prompt}\n\n// TODO: Implement your code here`;
    }
    
    return code;
  } catch (error) {
    return `// Error generating code: ${error.message}`;
  }
}

function extractName(text) {
  const match = text.match(/(?:function|class|const|component)\s+(\w+)/i);
  return match ? match[1] : null;
}

// HTML Dashboard
const htmlDashboard = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PowerfulAI - Claude-like Chat</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            background: #fff;
            height: 100vh;
            overflow: hidden;
        }
        
        .container {
            display: flex;
            height: 100vh;
        }
        
        .sidebar {
            width: 260px;
            background: #f7f7f8;
            border-right: 1px solid #d1d5db;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        
        .sidebar-header {
            padding: 16px;
            border-bottom: 1px solid #d1d5db;
        }
        
        .new-chat-btn {
            width: 100%;
            padding: 10px 16px;
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .new-chat-btn:hover {
            background: #0d9269;
        }
        
        .chat-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
        }
        
        .chat-item {
            padding: 12px 16px;
            margin: 4px 0;
            background: transparent;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-align: left;
            transition: background 0.2s;
            word-break: break-word;
            font-size: 0.95em;
            color: #666;
        }
        
        .chat-item:hover {
            background: #e5e5e5;
        }
        
        .chat-item.active {
            background: #10a37f;
            color: white;
        }
        
        .main {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #fff;
        }
        
        .chat-header {
            padding: 16px;
            border-bottom: 1px solid #d1d5db;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-header h1 {
            font-size: 1.2em;
            color: #333;
        }
        
        .header-buttons {
            display: flex;
            gap: 8px;
        }
        
        .header-btn {
            padding: 8px 16px;
            background: #f0f0f0;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            transition: background 0.2s;
        }
        
        .header-btn:hover {
            background: #e0e0e0;
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .message {
            display: flex;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .message.user {
            justify-content: flex-end;
        }
        
        .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 12px;
            line-height: 1.5;
            word-wrap: break-word;
        }
        
        .message.assistant .message-content {
            background: #f0f0f0;
            color: #333;
        }
        
        .message.user .message-content {
            background: #10a37f;
            color: white;
        }
        
        .code-block {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 8px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
        }
        
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #333;
        }
        
        .copy-btn {
            padding: 4px 8px;
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8em;
        }
        
        .copy-btn:hover {
            background: #0d9269;
        }
        
        .input-area {
            padding: 16px;
            border-top: 1px solid #d1d5db;
            background: #fff;
        }
        
        .input-wrapper {
            display: flex;
            gap: 8px;
        }
        
        #messageInput {
            flex: 1;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1em;
            font-family: inherit;
            resize: none;
            max-height: 100px;
        }
        
        #messageInput:focus {
            outline: none;
            border-color: #10a37f;
            box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.1);
        }
        
        .send-btn {
            padding: 12px 16px;
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .send-btn:hover {
            background: #0d9269;
        }
        
        .send-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .loading {
            display: inline-block;
            width: 4px;
            height: 4px;
            background: #10a37f;
            border-radius: 50%;
            animation: blink 1s infinite;
        }
        
        .loading:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .loading:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        .training-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .training-modal.show {
            display: flex;
        }
        
        .training-content {
            background: white;
            border-radius: 12px;
            padding: 24px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .training-content h2 {
            margin-bottom: 16px;
            color: #333;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group textarea, .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-family: inherit;
        }
        
        .modal-buttons {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
        
        .modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .modal-btn.primary {
            background: #10a37f;
            color: white;
        }
        
        .modal-btn.secondary {
            background: #f0f0f0;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">
                <button class="new-chat-btn" onclick="createNewChat()">+ New Chat</button>
            </div>
            <div class="chat-list" id="chatList"></div>
            <div style="padding: 12px; border-top: 1px solid #d1d5db;">
                <button class="header-btn" style="width: 100%; background: #f0f0f0;" onclick="openTrainingModal()">🎓 Train AI</button>
            </div>
        </div>
        
        <!-- Main Chat Area -->
        <div class="main">
            <div class="chat-header">
                <h1 id="chatTitle">PowerfulAI</h1>
                <div class="header-buttons">
                    <button class="header-btn" onclick="downloadChat()">⬇️ Download</button>
                    <button class="header-btn" onclick="deleteChat()">🗑️ Delete</button>
                </div>
            </div>
            
            <div class="messages" id="messages"></div>
            
            <div class="input-area">
                <div class="input-wrapper">
                    <textarea id="messageInput" placeholder="Ask me anything... (Shift+Enter to send)" rows="1"></textarea>
                    <button class="send-btn" id="sendBtn" onclick="sendMessage()">Send</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Training Modal -->
    <div class="training-modal" id="trainingModal">
        <div class="training-content">
            <h2>🎓 Train the AI</h2>
            <div class="form-group">
                <label>Training Data (one example per line, format: input,label)</label>
                <textarea id="trainingData" placeholder="1,2,3,4,5,0&#10;2,3,4,5,6,0&#10;8,9,10,11,12,1" rows="6"></textarea>
            </div>
            <div class="form-group">
                <label>Model Name:</label>
                <input type="text" id="modelName" placeholder="my_model" value="default">
            </div>
            <div class="modal-buttons">
                <button class="modal-btn secondary" onclick="closeTrainingModal()">Cancel</button>
                <button class="modal-btn primary" onclick="trainModel()">Train Model</button>
            </div>
        </div>
    </div>
    
    <script>
        let currentChatId = null;
        let chats = {};
        
        // Initialize
        async function init() {
            await loadAllChats();
            createNewChat();
        }
        
        // Load all chats
        async function loadAllChats() {
            const response = await fetch('/api/chats');
            const data = await response.json();
            chats = data;
            renderChatList();
        }
        
        // Render chat list
        function renderChatList() {
            const list = document.getElementById('chatList');
            list.innerHTML = '';
            
            Object.keys(chats).forEach(chatId => {
                const chat = chats[chatId];
                const div = document.createElement('button');
                div.className = 'chat-item' + (chatId === currentChatId ? ' active' : '');
                div.textContent = chat.title;
                div.onclick = () => selectChat(chatId);
                list.appendChild(div);
            });
        }
        
        // Create new chat
        function createNewChat() {
            fetch('/api/chat', { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    chats[data.id] = data;
                    selectChat(data.id);
                    renderChatList();
                });
        }
        
        // Select chat
        function selectChat(chatId) {
            currentChatId = chatId;
            document.getElementById('chatTitle').textContent = chats[chatId].title;
            renderMessages();
            renderChatList();
        }
        
        // Render messages
        function renderMessages() {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';
            
            const messages = chats[currentChatId].messages || [];
            messages.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'message ' + msg.role;
                
                const content = document.createElement('div');
                content.className = 'message-content';
                
                if (msg.code) {
                    const codeBlock = document.createElement('div');
                    codeBlock.className = 'code-block';
                    
                    const header = document.createElement('div');
                    header.className = 'code-header';
                    header.innerHTML = '<span>Code</span><button class="copy-btn" onclick="copyCode(this)">Copy</button>';
                    
                    const pre = document.createElement('pre');
                    pre.textContent = msg.code;
                    
                    codeBlock.appendChild(header);
                    codeBlock.appendChild(pre);
                    content.appendChild(codeBlock);
                    
                    const text = document.createElement('div');
                    text.textContent = msg.content;
                    content.appendChild(text);
                } else {
                    content.textContent = msg.content;
                }
                
                div.appendChild(content);
                messagesDiv.appendChild(div);
            });
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        // Send message
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            input.value = '';
            document.getElementById('sendBtn').disabled = true;
            
            // Add user message
            const userMsg = { role: 'user', content: message };
            chats[currentChatId].messages.push(userMsg);
            renderMessages();
            
            try {
                // Send to AI
                const response = await fetch('/api/message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chatId: currentChatId,
                        message: message
                    })
                });
                
                const data = await response.json();
                
                // Add AI response
                chats[currentChatId].messages.push({
                    role: 'assistant',
                    content: data.response,
                    code: data.code || null
                });
                
                // Update chat title if first message
                if (chats[currentChatId].messages.length === 2) {
                    chats[currentChatId].title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
                }
                
                renderMessages();
                renderChatList();
            } catch (error) {
                console.error('Error:', error);
            }
            
            document.getElementById('sendBtn').disabled = false;
        }
        
        // Copy code
        function copyCode(btn) {
            const code = btn.closest('.code-block').querySelector('pre').textContent;
            navigator.clipboard.writeText(code);
            btn.textContent = '✓ Copied';
            setTimeout(() => btn.textContent = 'Copy', 2000);
        }
        
        // Download chat
        function downloadChat() {
            if (!currentChatId) return;
            const chat = chats[currentChatId];
            const data = JSON.stringify(chat, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`chat-\${chat.title.replace(/\\s+/g, '-')}-\${new Date().toISOString().split('T')[0]}.json\`;
            a.click();
        }
        
        // Delete chat
        function deleteChat() {
            if (!currentChatId || confirm('Delete this chat?')) {
                fetch(\`/api/chat/\${currentChatId}\`, { method: 'DELETE' })
                    .then(() => {
                        delete chats[currentChatId];
                        createNewChat();
                        renderChatList();
                    });
            }
        }
        
        // Training modal
        function openTrainingModal() {
            document.getElementById('trainingModal').classList.add('show');
        }
        
        function closeTrainingModal() {
            document.getElementById('trainingModal').classList.remove('show');
        }
        
        async function trainModel() {
            const data = document.getElementById('trainingData').value;
            const modelName = document.getElementById('modelName').value;
            
            if (!data) {
                alert('Please enter training data');
                return;
            }
            
            const lines = data.split('\\n').filter(l => l.trim());
            const trainingData = lines.map(line => {
                const parts = line.split(',').map(p => parseFloat(p.trim()));
                return parts;
            });
            
            try {
                const response = await fetch('/api/train', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        modelName: modelName,
                        data: trainingData
                    })
                });
                
                const result = await response.json();
                alert('✅ Model trained!\\nAccuracy: ' + (result.accuracy * 100).toFixed(2) + '%');
                closeTrainingModal();
            } catch (error) {
                alert('Error training model: ' + error.message);
            }
        }
        
        // Auto-save on message input
        document.getElementById('messageInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                sendMessage();
            }
        });
        
        // Initialize on load
        window.addEventListener('load', init);
    </script>
</body>
</html>
`;

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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

    // API: Get all chats
    if (pathname === '/api/chats' && req.method === 'GET') {
      const chats = getAllChats();
      const result = {};
      for (const chat of chats) {
        result[chat.id] = loadChat(chat.id);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // API: Create new chat
    if (pathname === '/api/chat' && req.method === 'POST') {
      const chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const chat = {
        id: chatId,
        title: 'New Chat',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        messages: []
      };
      saveChat(chatId, chat);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(chat));
      return;
    }

    // API: Delete chat
    if (pathname.match(/^\/api\/chat\/[\w_]+$/) && req.method === 'DELETE') {
      const chatId = pathname.split('/').pop();
      const chatFile = path.join(CHATS_DIR, `${chatId}.json`);
      if (fs.existsSync(chatFile)) {
        fs.unlinkSync(chatFile);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      }
      return;
    }

    // API: Send message
    if (pathname === '/api/message' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { chatId, message } = JSON.parse(body);
          const chat = loadChat(chatId);

          // Get AI response
          const analysis = await ai.think(message);
          let aiResponse = analysis.sentiment.sentiment === 'positive' 
            ? 'I understand! That sounds great. ' 
            : 'I see. ';
          
          aiResponse += `Intent: ${analysis.intent}. ${message.substring(0, 50)}...`;

          // Generate code if requested
          let code = null;
          if (message.toLowerCase().includes('code') || 
              message.toLowerCase().includes('function') ||
              message.toLowerCase().includes('class')) {
            code = await generateCode(message, chat);
          }

          // Update chat
          chat.updated = new Date().toISOString();
          saveChat(chatId, chat);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ response: aiResponse, code: code }));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    // API: Train model
    if (pathname === '/api/train' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { modelName, data } = JSON.parse(body);
          
          if (data.length < 2) {
            throw new Error('Need at least 2 training examples');
          }

          // Extract labels from last column
          const labels = data.map(d => d[d.length - 1]);
          const trainingData = data.map(d => d.slice(0, -1));

          // Train model
          const result = await ai.learn(trainingData, labels);

          // Save model
          saveModelData({
            modelName: modelName,
            accuracy: result.accuracy,
            trained: new Date().toISOString(),
            numExamples: trainingData.length
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

// Auto-open browser
const { spawn } = require('child_process');

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('\n' + '═'.repeat(70));
  console.log('🚀 PowerfulAI Server Started!');
  console.log('═'.repeat(70));
  console.log(`\n📱 Opening: ${url}`);
  console.log('\n✨ Features:');
  console.log('   • Claude-like chat interface');
  console.log('   • AI code generation');
  console.log('   • Model training');
  console.log('   • Persistent chat storage');
  console.log('   • Download chats as JSON');
  console.log('\n' + '═'.repeat(70) + '\n');

  // Auto-open browser
  const platform = process.platform;
  if (platform === 'darwin') spawn('open', [url]);
  else if (platform === 'win32') spawn('cmd', ['/c', 'start', url]);
  else spawn('xdg-open', [url]);
});
