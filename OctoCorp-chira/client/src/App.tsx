import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { ChannelsView } from './components/ChannelsView'; // Modulul nou de fișiere
import { LoginView } from './components/LoginView';       // Modulul de acces
import type { User } from './types'; 

function App() {
  // 1. Statul pentru autentificare (esențial pentru securitatea OctoCorp)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 2. Statul pentru navigare SPA (Single Page Application)
  const [activeTab, setActiveTab] = useState<'Chat' | 'Canale'>('Chat');

  // Funcția de login care simulează alocarea rolurilor RBAC
  const handleLogin = (username: string) => {
    const user: User = {
      id: crypto.randomUUID(), // Generăm UUID local conform ADD
      username: username,
      roles: username.toLowerCase() === 'admin' ? ['Admin'] : ['Membru']
    };
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  // --- LOGICA DE REDARE (GATING) ---
  // Dacă nu este logat, afișăm DOAR ecranul de Login
  if (!isLoggedIn || !currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Dacă este logat, afișăm interfața principală a consolei
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar cu navigare și verificarea rolurilor pentru butonul de Admin */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRoles={currentUser.roles} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header-ul care afișează identitatea și rolurile curente */}
        <Header currentUser={currentUser} />
        
        <main className="flex-1 overflow-hidden p-6">
          {activeTab === 'Chat' ? (
            /* Modulul de Mesagerie Securizată */
            <div className="h-full bg-white rounded-xl shadow-sm border overflow-hidden">
              <ChatView />
            </div>
          ) : (
            /* Modulul de Gestiune Fișiere (Canale) cu verificare permisiuni */
            <div className="h-full bg-white rounded-xl shadow-sm border overflow-hidden">
              <ChannelsView userRoles={currentUser.roles} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;