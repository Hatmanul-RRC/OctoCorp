import { useState } from 'react';
import { Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

export const LoginView = ({ onLogin }: LoginViewProps) => {
  const [user, setUser] = useState('');

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">OctoCorp</h1>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-semibold">Acces Securizat</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Nume utilizator" 
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Parolă" 
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-slate-600">Ține-mă minte</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">Am uitat parola</a>
          </div>

          <button 
            onClick={() => onLogin(user || 'Agent_Anonim')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            Autentificare
          </button>
        </div>
      </div>
    </div>
  );
};