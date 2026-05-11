<button id="connect">Connect</button>
<input type="file" id="fileInput" disabled />
<progress id="progress" value="0" max="100"></progress>
<p id="status">Disconnected</p>

<script>
const CHUNK_SIZE = 16384; // 16KB chunks
const pc = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});
const ws = new WebSocket('ws://localhost:8080');
let dataChannel;
let receivedBuffers = [];
let receivedSize = 0;
let fileSize = 0;
let fileName = '';

// ── Signaling ──────────────────────────────────────────
ws.onmessage = async ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.type === 'offer') {
    await pc.setRemoteDescription(msg.sdp);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    ws.send(JSON.stringify({ type: 'answer', sdp: answer }));
  } else if (msg.type === 'answer') {
    await pc.setRemoteDescription(msg.sdp);
  } else if (msg.type === 'candidate') {
    await pc.addIceCandidate(msg.candidate);
  }
};

pc.onicecandidate = ({ candidate }) => {
  if (candidate) ws.send(JSON.stringify({ type: 'candidate', candidate }));
};

// ── Connect button: this peer becomes the caller ───────
document.getElementById('connect').onclick = async () => {
  dataChannel = pc.createDataChannel('fileTransfer');
  dataChannel.binaryType = 'arraybuffer';
  setupSendChannel(dataChannel);

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  ws.send(JSON.stringify({ type: 'offer', sdp: offer }));
};

// ── Callee receives the data channel ──────────────────
pc.ondatachannel = ({ channel }) => {
  channel.binaryType = 'arraybuffer';
  setupReceiveChannel(channel);
};

// ── Sender side ────────────────────────────────────────
function setupSendChannel(channel) {
  channel.onopen = () => {
    document.getElementById('status').textContent = 'Connected — pick a file';
    document.getElementById('fileInput').disabled = false;
  };
  channel.onclose = () => {
    document.getElementById('status').textContent = 'Disconnected';
  };
}

document.getElementById('fileInput').onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Send metadata first so receiver knows filename + size
  dataChannel.send(JSON.stringify({ name: file.name, size: file.size }));

  const buffer = await file.arrayBuffer();
  let offset = 0;

  const sendChunk = () => {
    while (offset < buffer.byteLength) {
      if (dataChannel.bufferedAmount > CHUNK_SIZE * 8) {
        // Back off if buffer is filling up
        dataChannel.onbufferedamountlow = sendChunk;
        dataChannel.bufferedAmountLowThreshold = CHUNK_SIZE * 4;
        return;
      }
      const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
      dataChannel.send(chunk);
      offset += chunk.byteLength;
      document.getElementById('progress').value = (offset / buffer.byteLength) * 100;
    }
    document.getElementById('status').textContent = 'File sent!';
  };
  sendChunk();
};

// ── Receiver side ──────────────────────────────────────
function setupReceiveChannel(channel) {
  document.getElementById('status').textContent = 'Connected — waiting for file';

  channel.onmessage = ({ data }) => {
    if (typeof data === 'string') {
      // First message is metadata
      ({ name: fileName, size: fileSize } = JSON.parse(data));
    } else {
      receivedBuffers.push(data);
      receivedSize += data.byteLength;
      document.getElementById('progress').value = (receivedSize / fileSize) * 100;

      if (receivedSize === fileSize) {
        const blob = new Blob(receivedBuffers);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        // Reset
        receivedBuffers = [];
        receivedSize = 0;
        document.getElementById('status').textContent = 'File received!';
      }
    }
  };
}
</script>