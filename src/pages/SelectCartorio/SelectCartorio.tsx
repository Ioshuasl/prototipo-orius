import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState, useMemo } from 'react'; // Adicionado useMemo
import { Loader2, LogOut, Eye, Pencil, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'; // Adicionados ícones de navegação
import logo from '../../assets/logo-orius-branco-sidebar.png';

interface Cartorio {
  id: number;
  name: string;
  oficial: string;
  cns: string;
  email: string;
  telefone: string;
  city: string;
  state: string;
  sistemas: string[];
}

// MOCK de cartórios para simular os dados
const MOCK_CARTORIOS: Cartorio[] = [
  {
    id: 1,
    name: 'Cartório de Registro de Imóveis - Centro',
    oficial: 'Ana Clara Souza',
    cns: '01.234-5',
    email: 'imoveis.centro@cartorio.com',
    telefone: '(11) 5555-1234',
    city: 'São Paulo',
    state: 'SP',
    sistemas: ['registro-imoveis', 'caixa']
  },
  {
    id: 2,
    name: 'Cartório de Notas e Protesto - Santo André',
    oficial: 'Roberto Santos',
    cns: '02.456-7',
    email: 'notas.protesto.sa@cartorio.com',
    telefone: '(11) 5555-5678',
    city: 'Santo André',
    state: 'SP',
    sistemas: ['tabelionato-notas', 'protesto-titulos', 'caixa']
  },
  {
    id: 3,
    name: 'Tabelionato de Notas - Pinheiros',
    oficial: 'Juliana Costa',
    cns: '03.789-0',
    email: 'notas.pinheiros@cartorio.com',
    telefone: '(11) 5555-9012',
    city: 'São Paulo',
    state: 'SP',
    sistemas: ['tabelionato-notas']
  },
  {
    id: 4,
    name: 'Registro Civil de Pessoas Naturais - Vila Mariana',
    oficial: 'Fernando Mendes',
    cns: '04.101-1',
    email: 'civil.vm@cartorio.com',
    telefone: '(11) 5555-3456',
    city: 'São Paulo',
    state: 'SP',
    sistemas: ['registro-civil', 'caixa']
  },
  {
    id: 5,
    name: 'Tabelionato de Notas - Boa Vista',
    oficial: 'Paula Ribeiro',
    cns: '05.223-2',
    email: 'notas.boavista@cartorio.com',
    telefone: '(95) 5555-7890',
    city: 'Boa Vista',
    state: 'RR',
    sistemas: ['tabelionato-notas', 'protesto-titulos']
  },
  {
    id: 6,
    name: 'Registro de Títulos e Documentos - Cuiabá',
    oficial: 'Carlos Silva',
    cns: '06.345-3',
    email: 'rtd.cuiaba@cartorio.com',
    telefone: '(65) 5555-1122',
    city: 'Cuiabá',
    state: 'MT',
    sistemas: ['registro-titulos-docs', 'registro-imoveis', 'caixa']
  },
  {
    id: 7,
    name: 'Cartório de Protesto de Títulos - Belo Horizonte',
    oficial: 'Marcos Oliveira',
    cns: '07.567-4',
    email: 'protesto.bh@cartorio.com',
    telefone: '(31) 5555-3344',
    city: 'Belo Horizonte',
    state: 'MG',
    sistemas: ['protesto-titulos']
  },
];

const ITEMS_PER_PAGE = 5; // Número de itens por página

export function SelectCartorio() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCartorio, setSelectedCartorio] = useState<Cartorio | null>(null);



  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);



  // Filtra os cartórios com base no termo de busca
  const filteredCartorios = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return MOCK_CARTORIOS.filter(cartorio =>
      cartorio.name.toLowerCase().includes(lowercasedTerm) ||
      cartorio.oficial.toLowerCase().includes(lowercasedTerm) ||
      cartorio.city.toLowerCase().includes(lowercasedTerm) ||
      cartorio.state.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredCartorios.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredCartorios.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleViewCartorio = (cartorio: Cartorio) => {
    setSelectedCartorio(cartorio);
    setIsModalOpen(true);
  };

  const handleEditCartorio = (cartorio: Cartorio) => {
    setSelectedCartorio(cartorio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCartorio(null);
    
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#dd6825]" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Logo Orius" className="h-16 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-md bg-red-500 py-2 px-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="py-10">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center mb-6 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3" />
              <input
                type="text"
                placeholder="Buscar por cartório, oficial, cidade ou estado..."
                className="w-full rounded-md border border-gray-300 p-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#dd6825] focus:outline-none focus:ring-[#dd6825] sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {currentItems.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-200">
                  {currentItems.map((cartorio) => (
                    <li key={cartorio.id} className="py-4 px-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <Link to={'/home'}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {cartorio.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {cartorio.city}, {cartorio.state} - Oficial: {cartorio.oficial}
                            </p>
                          </div>
                        </Link>
                        <div className="ml-4 flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCartorio(cartorio)}
                            className="text-gray-500 hover:text-[#dd6825] p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditCartorio(cartorio)}
                            className="text-gray-500 hover:text-[#dd6825] p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Nenhum cartório encontrado.
                </div>
              )}
            </div>

            {/* Controles de Paginação */}
            {filteredCartorios.length > ITEMS_PER_PAGE && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Exibindo <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, filteredCartorios.length)}</span> de <span className="font-medium">{filteredCartorios.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Anterior</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10 bg-[#fef2e8] border-[#dd6825] text-[#dd6825]' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Próxima</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Total de Cartórios */}
            <div className="mt-4 text-center text-gray-500">
              <p>Total de cartórios cadastrados: <span className="font-bold">{MOCK_CARTORIOS.length}</span></p>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && selectedCartorio && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalhes do Cartório</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome do Cartório</p>
                <p className="mt-1 text-sm text-gray-900">{selectedCartorio.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Oficial</p>
                <p className="mt-1 text-sm text-gray-900">{selectedCartorio.oficial}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CNS</p>
                <p className="mt-1 text-sm text-gray-900">{selectedCartorio.cns}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="mt-1 text-sm text-gray-900">{selectedCartorio.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="mt-1 text-sm text-gray-900">{selectedCartorio.telefone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cidade/Estado</p>
                <p className="mt-1 text-sm text-gray-900">{selectedCartorio.city}, {selectedCartorio.state}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Sistemas</p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedCartorio.sistemas.length > 0
                    ? selectedCartorio.sistemas.map(s => s.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase())).join(', ')
                    : 'Nenhum'
                  }
                </p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}