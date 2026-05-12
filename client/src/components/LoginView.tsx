import { useState } from 'react';
import { ShieldCheck, User as UserIcon, Lock } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

export const LoginView = ({ onLogin }: LoginViewProps) => {
  const [user, setUser] = useState('');

  return (
    <div style={{
      backgroundColor: '#2563eb', // Albastru normal (nici închis, nici deschis)
      height: '100vh',           // Fixăm înălțimea la ecran (elimină scroll-ul vertical)
      width: '100vw',            // Fixăm lățimea la ecran (elimină scroll-ul orizontal)
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',  // Centrăm tot conținutul vertical pe ecran
      fontFamily: 'sans-serif',
      margin: 0,
      padding: 0,
      overflow: 'hidden',        // Eliminăm forțat scroll-ul
      position: 'fixed',         // Forțăm acoperirea marginilor albe (fixed positioning)
      top: 0,
      left: 0
    }}>
      
      {/* 1. OctoCorp - Sus */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          backgroundColor: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          color: '#2563eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <ShieldCheck size={35} />
        </div>
        <h1 style={{ color: 'white', fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>OctoCorp</h1>
        
        {/* REZOLVAT: Am adăugat marginTop specific pentru a separa textul de p-ul din CORP */}
        <p style={{ 
          color: '#dbeafe', 
          marginTop: '25px',       // Distanta verticala mai mare fata de CORP
          marginBottom: '5px',
          letterSpacing: '2px', 
          fontSize: '0.9rem' 
        }}>
          ACCES SECURIZAT
        </p>
      </div>

      {/* 2. Casetele de Login */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        width: '400px', // Puțin mai lat pentru a arăta mai bine
        boxShadow: '0 20px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ position: 'relative' }}>
          <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Utilizator" 
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }} 
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input 
            type="password" 
            placeholder="Parolă" 
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }} 
          />
        </div>
      </div>

      {/* 3. Randul de mijloc: Tine-ma minte (Stanga) & Am uitat parola (Dreapta) */}
      <div style={{
        width: '400px',
        display: 'flex',
        justifyContent: 'space-between', // Aceasta pune unul la stanga, unul la dreapta (Tine-ma minte si Am uitat parola pe aceeasi linie)
        alignItems: 'center',
        marginTop: '25px',              // Distanta egala fata de cardul de sus
        marginBottom: '25px'           // Distanta egala fata de butonul de jos
      }}>
        <label style={{ color: 'white', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" style={{ marginRight: '8px' }} />
          Ține-mă minte
        </label>
        
        {/* REZOLVAT AICI: Am schimbat color: 'black' în color: 'white' */}
        <a href="#" style={{ 
          color: 'white',         // REZOLVAT: Acum este alb, la fel ca restul scrisului
          textDecoration: 'none', 
          fontSize: '0.9rem', 
          fontWeight: 'bold' 
        }}>
          Am uitat parola
        </a>
      </div>

      {/* 4. Butonul Autentificare - Jos */}
      <button 
        onClick={() => onLogin(user || 'Agent_Anonim')}
        style={{
          backgroundColor: '#1d4ed8', // Albastru mai închis pentru buton (consistent)
          color: 'white',
          border: 'none',
          padding: '15px 80px',
          borderRadius: '12px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          width: '300px' // Fixăm lățimea ca să fie centrat frumos
        }}>
        Autentificare
      </button>

    </div>
  );
};