import { MessageSquare, Hash, Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  activeTab: 'Chat' | 'Canale';
  onTabChange: (tab: 'Chat' | 'Canale') => void;
  userRoles: string[];
  onSelectContact: (name: string) => void;
  selectedContact: string;
}

export const Sidebar = ({ activeTab, onTabChange, onSelectContact, selectedContact }: SidebarProps) => {
  const contacts = ["Agent Alpha", "Agent Beta", "Agent Gamma"];

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

      {/* Zona de Contacte (Mijloc) */}
      <div style={{ marginTop: '40px', padding: '0 15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'Chat' && (
          <>
            <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '15px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }}>
                CONVERSAȚII
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {contacts.map(name => (
                <button 
                  key={name} 
                  onClick={() => onSelectContact(name)} 
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '10px 15px', 
                    backgroundColor: selectedContact === name ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', 
                    border: selectedContact === name ? '1px solid rgba(255,255,255,0.5)' : 'none', 
                    color: 'white', cursor: 'pointer', borderRadius: '4px', fontSize: '14px'
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Zona de Acțiuni (Jos) */}
            <div style={{ marginTop: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{ 
                width: '100%', padding: '10px', border: '1px dashed rgba(255,255,255,0.4)', 
                backgroundColor: 'transparent', color: '#60a5fa', cursor: 'pointer', borderRadius: '4px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px'
              }}>
                <Plus size={16} /> Adaugă conversație
              </button>

              <button style={{ 
                width: '100%', padding: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', 
                backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#f87171', cursor: 'pointer', borderRadius: '4px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px'
              }}>
                <Trash2 size={16} /> Șterge conversație
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '15px', fontSize: '10px', opacity: 0.4, textAlign: 'center' }}>
        Versiune OctoCorp v1.0.0-Stable
      </div>
    </aside>
  );
};