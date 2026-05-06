import { File, Download, Upload } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  author: string;
  size: string;
}

interface ChannelsViewProps {
  userRoles: string[];
}

export const ChannelsView = ({ userRoles }: ChannelsViewProps) => {
  // Simulăm datele extrase din MariaDB
  const mockFiles: FileItem[] = [
    { id: '1', name: 'Plan_Operatiune.pdf', author: 'Agent_002', size: '2.4 MB' },
    { id: '2', name: 'Protocol_Securitate.docx', author: 'Admin', size: '1.1 MB' },
  ];

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Canale de Colaborare</h2>
          <p className="text-slate-500 text-sm">Documente partajate în rețeaua locală.</p>
        </div>
        
        {/* Butonul de Upload apare doar dacă userul are permisiuni de Write/Upload */}
        {(userRoles.includes('Admin') || userRoles.includes('Moderator')) && (
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md">
            <Upload size={18} />
            <span>Încarcă Fișier</span>
          </button>
        )}
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b text-slate-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">Nume Fișier</th>
              <th className="p-4 font-semibold">Autor</th>
              <th className="p-4 font-semibold">Dimensiune</th>
              <th className="p-4 font-semibold text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {mockFiles.map((file) => (
              <tr key={file.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-4 flex items-center space-x-3">
                  <File size={18} className="text-blue-500" />
                  <span className="font-medium">{file.name}</span>
                </td>
                <td className="p-4 text-sm">{file.author}</td>
                <td className="p-4 text-sm text-slate-500">{file.size}</td>
                <td className="p-4 text-right">
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors" title="Download securizat">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};