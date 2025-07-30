import { createContext, useState, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Tipagem para nosso usuário
export interface User {
  id: number;
  name: string;
  role: string;
  permissions: string[]; // Ex: ['registro-imoveis', 'caixa']
}

// 2. Tipagem para o contexto
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 3. Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Criação do Provedor (AuthProvider)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (userData: User) => {
    setUser(userData);
    navigate('/home');
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}