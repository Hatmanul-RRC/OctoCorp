import { MessageSquare, Hash, ShieldAlert } from 'lucide-react';

// Definim ce date poate primi Sidebar-ul (Props)
interface SidebarProps {
  activeTab: 'Chat' | 'Canale';
  onTabChange: (tab: 'Chat' | 'Canale') => void;
  userRoles: string[]; // Rolurile primite din App.tsx
}

export const Sidebar = ({ activeTab, onTabChange, userRoles }: SidebarProps) => {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col p-4 shadow-xl">
      <div className="mb-10 px-2 text-2xl font-bold text-blue-500">OctoCorp</div>
      
      <nav className="flex-1 space-y-2">
        {/* Buton Chat */}
        <button 
          onClick={() => onTabChange('Chat')}
          className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
            activeTab === 'Chat' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          <MessageSquare size={20} />
          <span>Chat</span>
        </button>

        {/* Buton Canale */}
        <button 
          onClick={() => onTabChange('Canale')}
          className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
            activeTab === 'Canale' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          <Hash size={20} />
          <span>Canale</span>
        </button>

        {/* --- LOGICA RBAC --- */}
        {/* Butonul de Admin apare DOAR dacă utilizatorul are rolul de 'Admin' */}
        {userRoles.includes('Admin') && (
          <div className="pt-10">
            <p className="text-[10px] text-slate-500 font-bold uppercase px-3 mb-2">Administrare</p>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg text-amber-400 hover:bg-slate-800 transition-all border border-amber-900/30">
              <ShieldAlert size={20} />
              <span className="font-bold">Panou Control</span>
            </button>
          </div>
        )}
      </nav>
      
      <div className="mt-auto p-2 text-[10px] text-slate-600 text-center border-t border-slate-800">
        Versiune OctoCorp v1.0.0-Stable
      </div>
    </aside>
  );
};