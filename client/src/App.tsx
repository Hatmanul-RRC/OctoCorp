import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { LoginView } from './components/LoginView';
import { ChannelsView } from './components/ChannelsView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'Chat' | 'Canale'>('Chat');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedContact, setSelectedContact] = useState('Agent Alpha');
  const [selectedChannel, setSelectedChannel] = useState('# general');

  const handleLogin = (username: string) => {
    const roles = username.toLowerCase() === 'admin' ? ['Admin'] : ['Membru'];
    const user = { username, roles };
    localStorage.setItem('octocorp_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn || !currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      fontFamily: 'sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* MODIFICARE: Injectăm un stil CSS scurt pentru a ascunde bara de scroll 
        și a asigura spațierea corectă a mesajelor.
      */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
            padding-right: 40px !important; /* Împinge mesajele din dreapta mai la stânga */
          }
        `}
      </style>
      
      {/* 1. Sidebar */}
      <div style={{
        width: '260px',
        height: '100%',
        backgroundColor: '#1e3a8a',
        color: 'white',
        flexShrink: 0,
      }}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRoles={currentUser.roles}
          onSelectContact={setSelectedContact}
          selectedContact={selectedContact}
          onSelectChannel={setSelectedChannel}
          selectedChannel={selectedChannel}
        />
      </div>

      {/* 2. Zona Principală */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}>
        
        <Header currentUser={currentUser} />
        
        <main style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {activeTab === 'Chat' ? (
            /* MODIFICARE: ChatView va sta într-un container care aplică 
               clasa "no-scrollbar" definită mai sus.
            */
            <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto' }}>
                <ChatView selectedContact={selectedContact} />
            </div>
          ) : (
            <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto' }}>
              <ChannelsView selectedChannel={selectedChannel} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;