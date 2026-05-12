import { useState } from 'react';
import { SendHorizonal, Paperclip } from 'lucide-react';

interface ChannelMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
  color?: string; // Putem da culori diferite numelor pentru varietate
}

export const ChannelsView = () => {
  const [messages, setMessages] = useState<ChannelMessage[]>([
    { id: '1', sender: 'Sistem', text: 'Te-ai alăturat canalului #Securitate-Cibernetică.', time: '09:00', isSelf: false },
    { id: '2', sender: 'Agent Beta', text: 'Avem un update pe serverul de producție.', time: '10:15', isSelf: false, color: '#e11d48' },
    { id: '3', sender: 'Agent Gamma', text: 'Confirm. Verific logurile acum.', time: '10:17', isSelf: false, color: '#059669' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: crypto.randomUUID(),
      sender: 'Tu', // Sau numele utilizatorului logat
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    }]);
    setNewMessage('');
  };

  return (
    <div style={{
      backgroundImage: "url('/image_0.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Indicator Canal */}
      <div style={{ padding: '10px 30px', backgroundColor: 'rgba(255,255,255,0.8)', borderBottom: '1px solid #ddd', fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' }}>
        CANAL ACTIV: #SECURITATE-CIBERNETICA
      </div>

      <div className="no-scrollbar" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            display: 'flex', 
            justifyContent: msg.isSelf ? 'flex-end' : 'flex-start',
            marginRight: msg.isSelf ? '25px' : '0'
          }}>
            <div style={{
              maxWidth: '65%',
              padding: '10px 18px',
              borderRadius: msg.isSelf ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              backgroundColor: msg.isSelf ? '#2563eb' : '#f0f7ff',
              color: msg.isSelf ? 'white' : '#1e293b',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {/* Numele utilizatorului mic, sus în chenar (doar pentru alții) */}
              {!msg.isSelf && (
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '800', 
                  marginBottom: '4px', 
                  color: msg.color || '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
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
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Trimite un mesaj pe grup..."
          style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
        <button onClick={handleSendMessage} style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SendHorizonal size={20} />
        </button>
      </footer>
    </div>
  );
};