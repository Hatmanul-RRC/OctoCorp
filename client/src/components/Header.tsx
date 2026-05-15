import type { User } from '../types';

interface HeaderProps {
  currentUser: User;
}

export const Header = ({ currentUser }: HeaderProps) => {
  return (
    <header style={{ 
      height: '64px', 
      backgroundColor: 'white', 
      borderBottom: '1px solid #e2e8f0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'flex-end', 
      padding: '0 32px' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{currentUser.username}</p>
          <p style={{ margin: 0, fontSize: '11px', color: '#2563eb', fontWeight: '600', textTransform: 'uppercase' }}>
            {currentUser.roles.join(' • ')}
          </p>
        </div>
        
        {/* Avatarul simplu, conform primei poze */}
        <div style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold', 
          color: '#64748b',
          border: '1px solid #e2e8f0'
        }}>
          {currentUser.username[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
};