import { MessageSquare, Hash, Plus, Trash2, FolderOpen } from 'lucide-react';

interface SidebarProps {
  activeTab: 'Chat' | 'Canale' | 'Fisiere'; // Am adăugat 'Fisiere' aici
  onTabChange: (tab: 'Chat' | 'Canale' | 'Fisiere') => void;
  userRoles: string[];
  onSelectContact: (name: string) => void;
  selectedContact: string;
  onSelectChannel: (name: string) => void;
  selectedChannel: string;
}

export const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  onSelectContact, 
  selectedContact,
  onSelectChannel,
  selectedChannel 
}: SidebarProps) => {
  
  const contacts = ["Agent Alpha", "Agent Beta", "Agent Gamma"];
  const channels = ["# general", "# securitate-cibernetica", "# proiect-octoshield"];

  return (
    <aside style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxSizing: 'border-box',
      backgroundColor: '#1e3a8a',
      color: 'white'
    }}>
      {/* Logo */}
      <div style={{ padding: '25px 0', fontSize: '22px', fontWeight: 'bold', textAlign: 'center' }}>OctoCorp</div>
      
      {/* Tab-uri principale */}
      <div style={{ padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => onTabChange('Chat')}
          style={{ 
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', 
            backgroundColor: activeTab === 'Chat' ? 'white' : 'rgba(255,255,255,0.05)', 
            color: activeTab === 'Chat' ? '#1e3a8a' : 'white', cursor: 'pointer', borderRadius: '6px', fontWeight: '500'
          }}
        >
          <MessageSquare size={18} /> Chat Privat
        </button>

        <button 
          onClick={() => onTabChange('Canale')}
          style={{ 
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', 
            backgroundColor: activeTab === 'Canale' ? 'white' : 'rgba(255,255,255,0.05)', 
            color: activeTab === 'Canale' ? '#1e3a8a' : 'white', cursor: 'pointer', borderRadius: '6px', fontWeight: '500'
          }}
        >
          <Hash size={18} /> Canale Grup
        </button>
      </div>

      {/* Zona Dinamică (Mijloc) */}
      <div style={{ marginTop: '40px', padding: '0 15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {activeTab !== 'Fisiere' ? (
          <>
            <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '15px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }}>
                {activeTab === 'Chat' ? 'CONVERSAȚII' : 'CANALE ACTIVE'}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(activeTab === 'Chat' ? contacts : channels).map(name => (
                <button 
                  key={name} 
                  onClick={() => activeTab === 'Chat' ? onSelectContact(name) : onSelectChannel(name)} 
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '10px 15px', 
                    backgroundColor: (activeTab === 'Chat' ? selectedContact === name : selectedChannel === name) ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', 
                    border: (activeTab === 'Chat' ? selectedContact === name : selectedChannel === name) ? '1px solid rgba(255,255,255,0.5)' : 'none', 
                    color: 'white', cursor: 'pointer', borderRadius: '4px', fontSize: '14px'
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* BUTONUL NOU: ACCES DOSAR FIȘIERE (Stil Indigo) */}
            <button 
              onClick={() => onTabChange('Fisiere')}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(124, 58, 237, 0.2)', // Violet transparent
                color: '#c4b5fd', // Violet deschis
                border: '1px solid rgba(196, 181, 253, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              <FolderOpen size={16} /> Vezi fișiere trimise
            </button>
          </>
        ) : (
          /* Dacă suntem deja în pagina de fișiere, arătăm un buton de înapoi */
          <button 
            onClick={() => onTabChange('Chat')}
            style={{
              width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
              cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
            }}
          >
            ← Înapoi la Chat
          </button>
        )}

        {/* Zona de Acțiuni (Jos) */}
        <div style={{ marginTop: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={{ 
            width: '100%', padding: '10px', border: '1px dashed rgba(255,255,255,0.4)', 
            backgroundColor: 'transparent', color: '#60a5fa', cursor: 'pointer', borderRadius: '4px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px'
          }}>
            <Plus size={16} /> {activeTab === 'Chat' ? 'Adaugă conversație' : 'Creează canal'}
          </button>

          <button style={{ 
            width: '100%', padding: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', 
            backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#f87171', cursor: 'pointer', borderRadius: '4px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px'
          }}>
            <Trash2 size={16} /> {activeTab === 'Chat' ? 'Șterge conversație' : 'Părăsește canal'}
          </button>
        </div>
      </div>

      <div style={{ padding: '15px', fontSize: '10px', opacity: 0.4, textAlign: 'center' }}>
        Versiune OctoCorp v1.0.0-Stable
      </div>
    </aside>
  );
};