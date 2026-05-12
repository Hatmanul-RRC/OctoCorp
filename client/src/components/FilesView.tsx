import { FileText, ShieldCheck, HardDrive } from 'lucide-react';

interface FilesViewProps {
  sourceName: string;
}

export const FilesView = ({ sourceName }: FilesViewProps) => {
  return (
    <div style={{
      height: '100%',
      backgroundColor: '#f5f3ff', // Fundal violet pal
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease-in'
    }}>
      {/* Header Secțiune Fișiere */}
      <div style={{
        padding: '25px 40px',
        background: 'linear-gradient(90deg, #4c1d95 0%, #6d28d9 100%)', // Gradient violet
        color: 'white', // Textul principal devine alb
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }}>
        <div>
            <h1 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '800', 
            color: '#ffffff',
            letterSpacing: '1px'
            }}>
                DOCUMENTE SECURIZATE
            </h1>
            <p style={{ 
                margin: '5px 0 0 0', 
                fontSize: '13px', 
                color: '#ddd6fe' // VIOLET DESCHIS (nu negru, nu gri)
            }}>
            Sursă: <span style={{ fontWeight: 'bold', color: '#a5b4fc' }}>{sourceName}</span>
            </p>
        </div>
        <HardDrive size={24} color="#ddd6fe" />
    </div>

      {/* Zona de Vizualizare Conținut */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
          textAlign: 'center',
          maxWidth: '550px',
          border: '1px solid #ddd6fe'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#ede9fe', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <ShieldCheck size={40} color="#7c3aed" />
          </div>
          
          <h2 style={{ color: '#1e1b4b', fontSize: '24px', marginBottom: '12px' }}>
            Arhivă OctoCorp
          </h2>
          
          <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' }}>
            Aici vor fi listate toate fișierele trimise în conversația cu <strong>{sourceName}</strong>. 
            Sistemul păstrează o copie criptată a fiecărui document pentru acces rapid.
          </p>

          <div style={{
            padding: '20px',
            backgroundColor: '#f9f5ff',
            borderRadius: '12px',
            border: '1px dashed #c4b5fd',
            color: '#7c3aed',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <FileText size={18} />
            MODUL DE DESCĂRCARE ÎN CURS DE CONFIGURARE
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};