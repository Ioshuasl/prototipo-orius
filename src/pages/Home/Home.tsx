import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Users,
  FileText,
  Gavel,
  FolderArchive,
  Banknote,
  LogOut,
  Loader2
} from 'lucide-react';
import { useEffect } from 'react';

// --- Estrutura de dados para os módulos do sistema ---
// ALTERADO: A cor dos ícones foi trocada de azul para o laranja da marca.
const systemModules = [
  {
    title: 'Registro de Imóveis',
    description: 'Gerencie matrículas, averbações e registros de propriedades.',
    path: '/registro-imoveis/dashboard',
    icon: <Home className="h-10 w-10 text-[#dd6825]" />,
    permissionKey: 'registro-imoveis',
  },
  {
    title: 'Registro Civil',
    description: 'Emita certidões de nascimento, casamento e óbito.',
    path: '/registro-civil/dashboard',
    icon: <Users className="h-10 w-10 text-[#dd6825]" />,
    permissionKey: 'registro-civil',
  },
  {
    title: 'Tabelionato de Notas',
    description: 'Lavre escrituras, procurações, testamentos e atas notariais.',
    path: '/tabelionato-notas/dashboard',
    icon: <FileText className="h-10 w-10 text-[#dd6825]" />,
    permissionKey: 'tabelionato-notas',
  },
  {
    title: 'Protesto de Títulos',
    description: 'Registre e consulte protestos de cheques, notas e outros títulos.',
    path: '/protesto-titulos/dashboard',
    icon: <Gavel className="h-10 w-10 text-[#dd6825]" />,
    permissionKey: 'protesto-titulos',
  },
  {
    title: 'Registro de Títulos e Docs',
    description: 'Garanta a autenticidade e publicidade de documentos diversos.',
    path: '/registro-titulos-documentos/dashboard',
    icon: <FolderArchive className="h-10 w-10 text-[#dd6825]" />,
    permissionKey: 'registro-titulos-docs',
  },
  {
    title: 'Caixa',
    description: 'Controle o fluxo financeiro, pagamentos e emissão de recibos.',
    path: '/caixa',
    icon: <Banknote className="h-10 w-10 text-[#dd6825]" />,
    permissionKey: 'caixa',
  },
];

export default function DashboardPage() {
  const auth = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!auth.user) {
        auth.logout();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [auth]);

  if (!auth.user) {
    return (
      // ALTERADO: Cor do loader e do fundo da página
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#dd6825]" />
      </div>
    );
  }

  const accessibleModules = systemModules.filter(module =>
    auth.user!.permissions.includes(module.permissionKey)
  );

  return (
    // ALTERADO: Cor do fundo da página para consistência
    <div className="min-h-screen bg-gray-50">
      <title>Dashboard | Orius Tecnologia</title>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* ALTERADO: Título do sistema para a logo da empresa */}
          <Link to="/" className="flex items-center gap-3">
             <img src="/logo orius.png" alt="Logo Orius" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-700">{auth.user.name}</span>
              <p className="text-xs text-gray-500">{auth.user.role}</p>
            </div>
            <button
              onClick={auth.logout}
              className="flex items-center gap-2 rounded-md bg-red-500 py-2 px-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
           {/* ALTERADO: Cor do título principal para o cinza escuro da marca */}
          <h2 className="text-3xl font-bold text-[#4a4e51]">Painel de Controle</h2>
          <p className="text-gray-500 mt-2">Selecione um módulo para iniciar.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accessibleModules.map((module) => (
            <Link
              to={module.path}
              key={module.path}
              className="group flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-md transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-300"
            >
              <div className="mb-4">{module.icon}</div>
               {/* ALTERADO: Cor do hover no título do card para o laranja da marca */}
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#dd6825]">
                {module.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{module.description}</p>
            </Link>
          ))}
        </div>
        
        {accessibleModules.length === 0 && (
            <div className='text-center text-gray-500 bg-white p-8 rounded-lg shadow-md'>
                <p>Você não tem permissão para acessar nenhum módulo no momento.</p>
                <p className='mt-2'>Por favor, entre em contato com um administrador.</p>
            </div>
        )}
      </main>
    </div>
  );
}