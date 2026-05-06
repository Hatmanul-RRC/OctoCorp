import { useState } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '../types';

export const ChatView = () => {
  // Statul care ține lista de mesaje (Strongly Typed!)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Sistem', text: 'Conexiune securizată stabilită.', timestamp: '12:00', isSelf: false }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(), // Generăm un ID unic local
      sender: 'Tu',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages([...messages, newMessage]);
    setInputText(''); // Resetăm câmpul de text
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Lista de mesaje - cu scroll automat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
              msg.isSelf ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border'
            }`}>
              <p className="text-[10px] font-bold mb-1 opacity-70">{msg.sender}</p>
              <p className="text-sm">{msg.text}</p>
              <p className="text-[9px] text-right mt-1 opacity-50">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input de trimitere */}
      <div className="p-4 border-t flex gap-2 bg-white">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Scrie un mesaj securizat..." 
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          onClick={handleSend}
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};