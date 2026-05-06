import type{ User } from '../types';

// Folosim interfața User definită la pasul 1 pentru tipare
interface HeaderProps {
  currentUser: User;
}

export const Header = ({ currentUser }: HeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">{currentUser.username}</p>
          {/* Afișăm rolurile utilizatorului conform cerințelor SRS */}
          <p className="text-xs text-blue-600 font-medium">
            {currentUser.roles.join(' • ')}
          </p>
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
          {currentUser.username[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
};