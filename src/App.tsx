import { Route, Routes, Link, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassowrd'
import HomePage from './pages/Home/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CivilRegistryLayout from './pages/Civil/Layouts/CivilRegistryLayout'
import CivilRegistryDashboard from './pages/Civil/Dashboard'
import BirthRecordsManagementPage from './pages/Civil/Atos/Nascimento/Gerenciamento-Nascimento'
import RegistroNascimentoForm from './pages/Civil/Atos/Nascimento/Cadastrar-Ato-Nascimento'
import MarriageRecordsManagementPage from './pages/Civil/Atos/Casamento/Gerenciamentos-Casamento'
import DeathRecordsManagementPage from './pages/Civil/Atos/Obito/Gerenciamento-Obito'
import StillbornRecordsManagementPage from './pages/Civil/Atos/Natimorto/Gerenciamento-Natimorto'
import BookERecordsManagementPage from './pages/Civil/Atos/LivroE/Gerenciamento-LivroE'
import RegistroCasamentoForm from './pages/Civil/Atos/Casamento/Ato-Casamento'
import AtoObitoForm from './pages/Civil/Atos/Obito/Cadastrar-Ato-Obito'
import CadastrarAtoNatimortoForm from './pages/Civil/Atos/Natimorto/Cadastrar-Ato-Natimorto'
import CadastrarAtoLivroE from './pages/Civil/Atos/LivroE/Cadastrar-Ato-LivroE'
import EmissaoCertidao from './pages/Civil/Certidao/EmissaoCertidao'
import GerenciamentoCertidoesPage from './pages/Civil/Certidao/Gerenciamento-Certidoes'
import ConfiguracaoCartorio from './pages/Civil/Config/DadosCartorio/DadosCartorio'
import GerenciamentoLivrosPage from './pages/Civil/Livro/GerenciamentoLivros'
import LivroFormPage from './pages/Civil/Livro/Livro'
import GerenciamentoAverbacoesPage from './pages/Civil/Averbacao/Gerenciamento-Averbacoes'
import EmissaoAverbacao from './pages/Civil/Averbacao/EmissaoAverbacao'
import GerenciamentoPessoasPage from './pages/Civil/Config/PessoaCadastradas/Gerenciamento-Pessoas'
import CadastroPessoaPage from './pages/Civil/Config/PessoaCadastradas/Cadastro-Pessoa'
import GerenciamentoCargos from './pages/Civil/Config/Users/Role-Permissions/GerenciamentoCargos'
import CadastroCargoPage from './pages/Civil/Config/Users/Role-Permissions/CadastroCargoPage'
import GerenciamentoUsuarios from './pages/Civil/Config/Users/GerenciamentoUsuarios'
import CadastroUsuarioPage from './pages/Civil/Config/Users/UsuarioPage'
import GerenciamentoTemplates from './pages/Civil/Config/Cabecalho-Rodape/GerenciamentoTemplates'
import CadastroTemplatePage from './pages/Civil/Config/Cabecalho-Rodape/CadastroTemplatePage'
import GerenciamentoCertidoes from './pages/Civil/Config/Certidao/GerenciamentoCertidoes'
import CadastroCertidaoPage from './pages/Civil/Config/Certidao/CadastroCertidaoPage'
import GerenciamentoAverbacoes from './pages/Civil/Config/Averbacao/GerenciamentoAverbacoes'
import CadastroAverbacaoPage from './pages/Civil/Config/Averbacao/CadastroAverbacaoPage'
import TabelaEmolumentosPage from './pages/Civil/Config/Emolumentos/TabelaEmolumentosPage'
import GerenciamentoRecibos from './pages/Civil/Config/Recibo/GerenciamentoRecibos'
import CadastroReciboPage from './pages/Civil/Config/Recibo/CadastroReciboPage'
import GerenciamentoSelosAvulsosPage from './pages/Civil/Selo-Avulso/Gerenciamento-Selos-Avulsos'
import EmissaoSeloAvulso from './pages/Civil/Selo-Avulso/Emissao-Selo-Avulso'
import LivroProtocoloPage from './pages/Civil/Impressao/Livro-Protocolo/LivroProtocoloPage'
import RelatorioAtividadesPage from './pages/Civil/Impressao/Relatorio-Atividade/RelatorioAtividadesPage'
import CRCDashboard from './pages/Civil/Integracao/CRC/CRCDashboard'
import SIRCDashboard from './pages/Civil/Integracao/SIRC/SIRCDashboard'
import ConfiguracaoIntegracoes from './pages/Civil/Config/Integracoes/ConfiguracaoIntegracoes'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold'>{title}</h1>
      <p className='mt-4'>Em desenvolvimento...</p>
      <Link to="/home" className='text-blue-500 hover:underline mt-4 inline-block'>Voltar ao Dashboard</Link>
    </div>
  );
}

function App() {

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={<Navigate to={'/login'} />}
        />
        <Route
          index
          path='/login'
          element={<Login />}
        />
        <Route
          path='/forgot-password'
          element={<ForgotPassword />}
        />
        <Route
          path='/home'
          element={<HomePage />}
        />

        {/* Rotas dos sistemas Registro de Imóveis */}
        <Route path="/registro-imoveis/dashboard" element={<PlaceholderPage title="Registro de Imóveis" />} />

        {/* Rotas dos sistemas Registro Civil */}
        {/* Rota principal do layout de Registro Civil */}
        <Route path="/registro-civil" element={<CivilRegistryLayout />}>

          {/* A rota "index" é a página padrão para "/registro-civil" */}
          <Route path='dashboard' element={<CivilRegistryDashboard />} />

          {/* Rotas aninhadas para Nascimento */}
          <Route path="nascimento" element={<BirthRecordsManagementPage />} />
          <Route path="nascimento/cadastrar" element={<RegistroNascimentoForm />} />
          {/* SUGESTÃO: Rota para editar um registro específico */}
          <Route path="nascimento/:id" element={<RegistroNascimentoForm />} />

          {/* Rotas aninhadas para Casamento */}
          <Route path="casamento" element={<MarriageRecordsManagementPage />} />
          <Route path="casamento/cadastrar" element={<RegistroCasamentoForm />} />
          <Route path="casamento/:id" element={<RegistroCasamentoForm />} />

          {/* Rotas aninhadas para Óbito */}
          <Route path="obito" element={<DeathRecordsManagementPage />} />
          <Route path="obito/cadastrar" element={<AtoObitoForm />} />
          <Route path="obito/:id" element={<AtoObitoForm />} />

          {/* Rotas aninhadas para Natimorto */}
          <Route path="natimorto" element={<StillbornRecordsManagementPage />} />
          <Route path="natimorto/cadastrar" element={< CadastrarAtoNatimortoForm />} />
          <Route path="natimorto/:id" element={< CadastrarAtoNatimortoForm />} />

          {/* Rotas aninhadas para Livro E */}
          <Route path="livro-e" element={<BookERecordsManagementPage />} />
          <Route path="livro-e/cadastrar" element={<CadastrarAtoLivroE />} />
          <Route path="livro-e/:id" element={<CadastrarAtoLivroE />} />

          {/* Rotas aninhadas para Certidão */}
          <Route path="certidoes" element={<GerenciamentoCertidoesPage />} />
          <Route path="certidoes/emitir" element={<EmissaoCertidao />} />
          <Route path="certidoes/:id" element={<EmissaoCertidao />} />

          <Route path="selo-avulso" element={<GerenciamentoSelosAvulsosPage />} />
          <Route path="selo-avulso/emitir" element={<EmissaoSeloAvulso />} />
          <Route path="selo-avulso/:id" element={<EmissaoSeloAvulso />} />

          {/* Rotas aninhadas para Averbações */}
          <Route path="averbacoes" element={<GerenciamentoAverbacoesPage />} />
          <Route path="averbacoes/emitir" element={<EmissaoAverbacao />} />
          <Route path="averbacoes/:id" element={<EmissaoAverbacao />} />

          {/* Rotas de Livro */}
          <Route path="livros" element={<GerenciamentoLivrosPage />} />
          <Route path="livros/cadastrar" element={<LivroFormPage />} />
          <Route path="livros/:id" element={<LivroFormPage />} />

          {/* Rotas de Integração */}
          <Route path="integracoes/crc" element={<CRCDashboard />} />
          <Route path="integracoes/sirc" element={<SIRCDashboard />} />

          {/* Rotas de Impressão */}
          <Route path="impressao/livro-protocolo" element={<LivroProtocoloPage />} />
          <Route path="impressao/relatorio-atividades" element={<RelatorioAtividadesPage />} />

          {/* Rotas de Configuração */}
          <Route path="config/cartorio" element={<ConfiguracaoCartorio />} />
          <Route path="config/certidao" element={<GerenciamentoCertidoes />} />
          <Route path="config/certidao/cadastrar" element={<CadastroCertidaoPage />} />
          <Route path="config/certidao/:id" element={<CadastroCertidaoPage />} />

          <Route path="config/averbacao" element={<GerenciamentoAverbacoes />} />
          <Route path="config/averbacao/cadastrar" element={<CadastroAverbacaoPage />} />
          <Route path="config/averbacao/:id" element={<CadastroAverbacaoPage />} />

          <Route path="config/pessoas" element={<GerenciamentoPessoasPage />} />
          <Route path="config/pessoas/cadastrar" element={<CadastroPessoaPage />} />
          <Route path="config/pessoas/:id" element={<CadastroPessoaPage />} />

          <Route path="config/users" element={<GerenciamentoUsuarios />} />
          <Route path="config/users/cadastrar" element={<CadastroUsuarioPage />} />
          <Route path="config/users/:id" element={<CadastroUsuarioPage />} />

          <Route path="config/roles-permissions" element={<GerenciamentoCargos />} />
          <Route path="config/roles-permissions/cadastrar" element={<CadastroCargoPage />} />
          <Route path="config/roles-permissions/:id" element={<CadastroCargoPage />} />

          <Route path="config/templates-cabecalho-rodape" element={<GerenciamentoTemplates />} />
          <Route path="config/templates-cabecalho-rodape/cadastrar" element={<CadastroTemplatePage />} />
          <Route path="config/templates-cabecalho-rodape/:id" element={<CadastroTemplatePage />} />

          <Route path="config/recibo" element={<GerenciamentoRecibos />} />
          <Route path="config/recibo/cadastrar" element={<CadastroReciboPage />} />
          <Route path="config/recibo/:id" element={<CadastroReciboPage />} />

          <Route path="config/emolumentos" element={<TabelaEmolumentosPage />} />

          <Route path="config/integracoes" element={<ConfiguracaoIntegracoes />} />

        </Route>

        {/* Rotas dos sistemas Registro de Pessoas Físicas */}

        {/* Rotas dos sistemas Registro de Pessoas Jurídicas */}

        {/* Rotas dos sistemas Tabelionato de notas */}
        <Route path="/tabelionato-notas/dashboard" element={<PlaceholderPage title="Tabelionato de Notas" />} />

        {/* Rotas dos sistemas Protesto */}
        <Route path="/protesto-titulos/dashboard" element={<PlaceholderPage title="Protesto de Títulos" />} />

        {/* Rotas dos sistemas RTD */}
        <Route path="/registro-titulos-documentos/dashboard" element={<PlaceholderPage title="Registro de Títulos e Documentos" />} />

        {/* Rotas dos sistemas Caixa */}
        <Route path="/caixa/dashboard" element={<PlaceholderPage title="Caixa" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
