import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { LoginView } from './components/LoginView';
import { ChannelsView } from './components/ChannelsView';
import { FilesView } from './components/FilesView'; // <--- Pasul 1: Importăm noua componentă

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Pasul 2: Extindem tipul activeTab pentru a accepta și 'Fisiere'
  const [activeTab, setActiveTab] = useState<'Chat' | 'Canale' | 'Fisiere'>('Chat');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedContact, setSelectedContact] = useState('Agent Alpha');
  const [selectedChannel, setSelectedChannel] = useState('# general');
  const [lastContext, setLastContext] = useState<'Chat' | 'Canale'>('Chat');
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
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
            padding-right: 40px !important;
          }
        `}
      </style>
      
      {/* 1. Sidebar - Rămâne neschimbat ca structură, doar primește noul activeTab */}
      <div style={{
        width: '260px',
        height: '100%',
        backgroundColor: '#1e3a8a',
        color: 'white',
        flexShrink: 0,
      }}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            if (tab === 'Chat' || tab === 'Canale') {
              setLastContext(tab);
            }
            setActiveTab(tab);
          }} 
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
          {/* LOGICA DE AFISARE REZOLVATĂ: Am adăugat a treia condiție */}
          {activeTab === 'Chat' && (
            <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto' }}>
                <ChatView selectedContact={selectedContact} />
            </div>
          )}

          {activeTab === 'Canale' && (
            <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto' }}>
              <ChannelsView selectedChannel={selectedChannel} />
            </div>
          )}

          {activeTab === 'Fisiere' && (
            /* Determinăm sursa numelui în funcție de ultimul context (Contact sau Canal) */
            <FilesView 
               sourceName={lastContext === 'Chat' ? selectedContact : selectedChannel} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;