// Definim tipurile de date ca să avem autocompletare și erori dacă greșim
export type Role = 'Admin' | 'Membru' | 'Moderator';

export interface User {
  id: string; // UUID-ul unic despre care scrie în documentație
  username: string;
  roles: Role[]; // Un utilizator poate avea mai multe roluri
}

export interface NavItem {
  label: 'Chat' | 'Canale';
  id: string;
}

export interface Message {
  id: string; // UUID
  sender: string;
  text: string;
  timestamp: string; // Formatat pentru afișare
  isSelf: boolean; // Ca să știm pe ce parte a ecranului îl punem
}