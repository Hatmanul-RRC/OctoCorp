const CHUNK = 16384;

let pc = null;
let dataChannel = null;
let ws = null;

// Callbacks — the frontend sets these to react to events
export const on = {
  connected: null,       // () => void
  peerLeft: null,        // () => void
  fileReceived: null,    // (blob, filename) => void
  progress: null,        // (percent) => void
  error: null,           // (message) => void
};

// ── Connect to signaling server and join a room ──────────────────
export function joinRoom(room) {
  ws = new WebSocket(`ws://${location.host}`);
  createPeerConnection();

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'join', room }));
  };

  ws.onmessage = async ({ data }) => {
    const msg = JSON.parse(data);

    if (msg.type === 'start') {
      // We are the caller — create the offer
      createDataChannel();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      ws.send(JSON.stringify({ type: 'offer', sdp: offer }));

    } else if (msg.type === 'offer') {
      await pc.setRemoteDescription(msg.sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ws.send(JSON.stringify({ type: 'answer', sdp: answer }));

    } else if (msg.type === 'answer') {
      await pc.setRemoteDescription(msg.sdp);

    } else if (msg.type === 'candidate') {
      await pc.addIceCandidate(msg.candidate);

    } else if (msg.type === 'peer-left') {
      if (on.peerLeft) on.peerLeft();

    } else if (msg.type === 'error') {
      if (on.error) on.error(msg.message);
    }
  };
}

// ── Send a file to the connected peer ───────────────────────────
export async function sendFile(file) {
  if (!dataChannel || dataChannel.readyState !== 'open') {
    if (on.error) on.error('Not connected to a peer');
    return;
  }

  // Send metadata first so receiver knows the filename and size
  dataChannel.send(JSON.stringify({ name: file.name, size: file.size }));

  const buffer = await file.arrayBuffer();
  let offset = 0;

  function sendNext() {
    while (offset < buffer.byteLength) {
      if (dataChannel.bufferedAmount > CHUNK * 8) {
        dataChannel.bufferedAmountLowThreshold = CHUNK;
        dataChannel.onbufferedamountlow = sendNext;
        return;
      }
      dataChannel.send(buffer.slice(offset, offset + CHUNK));
      offset += CHUNK;
      if (on.progress) on.progress(Math.round((offset / buffer.byteLength) * 100));
    }
  }

  sendNext();
}

// ── Internal: set up RTCPeerConnection ──────────────────────────
function createPeerConnection() {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) ws.send(JSON.stringify({ type: 'candidate', candidate }));
  };

  // Callee receives the data channel this way
  pc.ondatachannel = ({ channel }) => {
    channel.binaryType = 'arraybuffer';
    setupReceiver(channel);
  };
}

// ── Internal: caller creates the data channel ───────────────────
function createDataChannel() {
  dataChannel = pc.createDataChannel('fileTransfer');
  dataChannel.binaryType = 'arraybuffer';
  dataChannel.onopen = () => {
    if (on.connected) on.connected();
  };
}

// ── Internal: handle incoming file chunks ───────────────────────
function setupReceiver(channel) {
  if (on.connected) on.connected();

  let meta = null;
  let chunks = [];
  let received = 0;

  channel.onmessage = ({ data }) => {
    if (typeof data === 'string') {
      // First message is always the file metadata
      meta = JSON.parse(data);
    } else {
      chunks.push(data);
      received += data.byteLength;
      if (on.progress) on.progress(Math.round((received / meta.size) * 100));

      if (received >= meta.size) {
        const blob = new Blob(chunks);
        if (on.fileReceived) on.fileReceived(blob, meta.name);
        // Reset for next file
        chunks = [];
        received = 0;
        meta = null;
      }
    }
  };
}