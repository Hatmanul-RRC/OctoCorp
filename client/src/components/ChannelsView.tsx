import { useState, useEffect } from 'react';
import { SendHorizonal, Paperclip } from 'lucide-react';

interface ChannelMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
  senderColor?: string;
}

interface ChannelsViewProps {
  selectedChannel: string;
}

// Baza de date simulată pentru canale
const channelsDatabase: Record<string, ChannelMessage[]> = {
  "# general": [
    { id: '1', sender: 'Sistem', text: 'Bun venit pe canalul principal OctoCorp.', time: '08:00', isSelf: false },
    { id: '2', sender: 'Razvan', text: 'Salutare tuturor! Spor la lucru.', time: '09:30', isSelf: false, senderColor: '#3b82f6' }
  ],
  "# securitate-cibernetica": [
    { id: '1', sender: 'Agent Alpha', text: 'Protocolul OctoShield a detectat un ping suspect.', time: '13:00', isSelf: false, senderColor: '#ef4444' },
    { id: '2', sender: 'Agent Beta', text: 'Verific firewall-ul acum.', time: '13:02', isSelf: false, senderColor: '#10b981' }
  ],
  "# proiect-octoshield": [
    { id: '1', sender: 'Tu', text: 'Am finalizat faza de frontend.', time: '10:00', isSelf: true },
    { id: '2', sender: 'Agent Gamma', text: 'Excelent. Trecem la integrarea API-ului.', time: '10:05', isSelf: false, senderColor: '#f59e0b' }
  ]
};

export const ChannelsView = ({ selectedChannel }: ChannelsViewProps) => {
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setMessages(channelsDatabase[selectedChannel] || []);
  }, [selectedChannel]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: crypto.randomUUID(),
      sender: 'Tu',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    }]);
    setNewMessage('');
  };

  return (
    <div style={{ backgroundImage: "url('/image_0.png')", backgroundSize: 'cover', backgroundPosition: 'center', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ padding: '10px 30px', backgroundColor: 'rgba(255,255,255,0.8)', borderBottom: '1px solid #ddd', fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' }}>
        CANAL ACTIV: {selectedChannel.toUpperCase()}
      </div>

      <div className="no-scrollbar" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isSelf ? 'flex-end' : 'flex-start', marginRight: msg.isSelf ? '25px' : '0' }}>
            <div style={{ maxWidth: '65%', padding: '10px 18px', borderRadius: msg.isSelf ? '18px 18px 2px 18px' : '18px 18px 18px 2px', backgroundColor: msg.isSelf ? '#2563eb' : '#f0f7ff', color: msg.isSelf ? 'white' : '#1e293b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              {!msg.isSelf && (
                <div style={{ fontSize: '10px', fontWeight: '800', marginBottom: '4px', color: msg.senderColor || '#64748b', textTransform: 'uppercase' }}>
                  {msg.sender}
                </div>
              )}
              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{msg.text}</div>
              <div style={{ fontSize: '9px', marginTop: '5px', textAlign: 'right', opacity: 0.6 }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      <footer style={{ padding: '15px 25px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Paperclip size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Trimite un mesaj pe canal..." style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #cbd5e1', outline: 'none' }} />
        <button onClick={handleSendMessage} style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SendHorizonal size={20} />
        </button>
      </footer>
    </div>
  );
};