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
// A chave 'permissionKey' é essencial para a lógica de autorização.
const systemModules = [
  {
    title: 'Registro de Imóveis',
    description: 'Gerencie matrículas, averbações e registros de propriedades.',
    path: '/registro-imoveis/dashboard',
    icon: <Home className="h-10 w-10 text-blue-500" />,
    permissionKey: 'registro-imoveis',
  },
  {
    title: 'Registro Civil',
    description: 'Emita certidões de nascimento, casamento e óbito.',
    path: '/registro-civil/dashboard',
    icon: <Users className="h-10 w-10 text-blue-500" />,
    permissionKey: 'registro-civil',
  },
  {
    title: 'Tabelionato de Notas',
    description: 'Lavre escrituras, procurações, testamentos e atas notariais.',
    path: '/tabelionato-notas/dashboard',
    icon: <FileText className="h-10 w-10 text-blue-500" />,
    permissionKey: 'tabelionato-notas',
  },
  {
    title: 'Protesto de Títulos',
    description: 'Registre e consulte protestos de cheques, notas e outros títulos.',
    path: '/protesto-titulos/dashboard',
    icon: <Gavel className="h-10 w-10 text-blue-500" />,
    permissionKey: 'protesto-titulos',
  },
  {
    title: 'Registro de Títulos e Docs',
    description: 'Garanta a autenticidade e publicidade de documentos diversos.',
    path: '/registro-titulos-documentos/dashboard',
    icon: <FolderArchive className="h-10 w-10 text-blue-500" />,
    permissionKey: 'registro-titulos-docs',
  },
  {
    title: 'Caixa',
    description: 'Controle o fluxo financeiro, pagamentos e emissão de recibos.',
    path: '/caixa',
    icon: <Banknote className="h-10 w-10 text-blue-500" />,
    permissionKey: 'caixa',
  },
];

export default function DashboardPage() {
  // Hook para acessar o contexto de autenticação
  const auth = useAuth();

  // Efeito para garantir que, se o usuário não estiver logado, ele seja redirecionado.
  // Isso protege a rota contra acesso direto pela URL.
  useEffect(() => {
    // A verificação é feita num timeout para dar tempo ao contexto de inicializar
    const timer = setTimeout(() => {
      if (!auth.user) {
        auth.logout();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [auth]);

  // Enquanto o contexto está sendo populado, exibe um loading.
  // Isso previne um "flash" da tela de login antes do redirecionamento.
  if (!auth.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Filtra os módulos com base nas permissões do usuário logado
  const accessibleModules = systemModules.filter(module =>
    auth.user!.permissions.includes(module.permissionKey)
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <title>Dashboard | Sistema Cartorário</title>

      {/* Cabeçalho Personalizado */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-gray-800">Sistema Cartorário</h1>
          <div className="flex items-center gap-4">
            {/* Exibe o nome e o cargo do usuário do contexto */}
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-700">{auth.user.name}</span>
              <p className="text-xs text-gray-500">{auth.user.role}</p>
            </div>
            <button
              onClick={auth.logout} // Usa a função de logout centralizada do contexto
              className="flex items-center gap-2 rounded-md bg-red-500 py-2 px-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700">Painel de Controle</h2>
          <p className="text-gray-500 mt-2">Selecione um módulo para iniciar.</p>
        </div>

        {/* Grade de Módulos Renderizada Dinamicamente */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accessibleModules.map((module) => (
            <Link
              to={module.path}
              key={module.path}
              className="group flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4">{module.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600">
                {module.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{module.description}</p>
            </Link>
          ))}
        </div>
        {/* Mensagem caso o usuário não tenha acesso a nenhum módulo */}
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