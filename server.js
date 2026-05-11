const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Serve files from /public
const httpServer = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = { '.html': 'text/html', '.js': 'application/javascript' }[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// WebSocket signaling
const wss = new WebSocket.Server({ server: httpServer });
const rooms = {};

// On new client connection
wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);

    // Join a room by code
    if (msg.type === 'join') {
      currentRoom = msg.room;
      if (!rooms[currentRoom]) rooms[currentRoom] = [];
      rooms[currentRoom].push(ws);

      const peers = rooms[currentRoom].length;
      if (peers === 2) {
        // Tell the first peer to start the connection
        rooms[currentRoom][0].send(JSON.stringify({ type: 'start' }));
      } else if (peers > 2) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
      }
    }

    // Relay signaling messages to the other peer in the room
    if (['offer', 'answer', 'candidate'].includes(msg.type)) {
      if (!rooms[currentRoom]) return;
      rooms[currentRoom].forEach(peer => {
        if (peer !== ws && peer.readyState === WebSocket.OPEN) {
          peer.send(raw.toString());
        }
      });
    }
  });

  ws.on('close', () => {
    if (!currentRoom || !rooms[currentRoom]) return;
    rooms[currentRoom] = rooms[currentRoom].filter(p => p !== ws);
    // Notify remaining peer
    rooms[currentRoom].forEach(peer => {
      peer.send(JSON.stringify({ type: 'peer-left' }));
    });
    if (rooms[currentRoom].length === 0) delete rooms[currentRoom];
  });
});

httpServer.listen(8080, () => console.log('Server running at http://localhost:8080'));