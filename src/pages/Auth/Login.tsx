import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth, type User } from '../../contexts/AuthContext';
import logo from '../../assets/logo-orius-branco-sidebar.png'

const MOCK_USERS: (User & { email: string, senha_plana: string })[] = [
  { id: 1, name: 'Admin Geral', email: 'admin@cartorio.com', role: 'Administrador', permissions: ['registro-imoveis', 'registro-civil', 'tabelionato-notas', 'protesto-titulos', 'registro-titulos-docs', 'caixa'], senha_plana: 'admin123', },
  { id: 2, name: 'João da Silva', email: 'joao.civil@cartorio.com', role: 'Escrevente de Registro Civil', permissions: ['registro-civil', 'caixa'], senha_plana: 'joao123', },
  { id: 3, name: 'Maria Oliveira', email: 'maria.notas@cartorio.com', role: 'Tabeliã', permissions: ['tabelionato-notas'], senha_plana: 'maria123', },
  { id: 4, name: 'Luciano Oliveira', email: 'luciano.civil@cartorio.com', role: 'Tabeliã', permissions: ['registro-civil'], senha_plana: 'luciano123', },
  { id: 5, name: 'Suporte Técnico', email: 'suporte@cartorio.com', role: 'Suporte Técnico', permissions: ['registro-imoveis', 'registro-civil', 'tabelionato-notas', 'protesto-titulos', 'registro-titulos-docs', 'caixa'], senha_plana: 'suporte123', },
];


export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    if (!email || !senha) {
      toast.error('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const foundUser = MOCK_USERS.find(
        (user) => user.email.toLowerCase() === email.toLowerCase() && user.senha_plana === senha
      );

      if (foundUser) {
        toast.success(`Bem-vindo(a), ${foundUser.name}!`);
        const { senha_plana, ...userToLogin } = foundUser;
        login(userToLogin);

        if (userToLogin.role === 'Suporte Técnico') {
          navigate('/selecionar-cartorio');
        } else {
          navigate('/home');
        }
      } else {
        toast.error('E-mail ou senha inválidos.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <title>Login | Orius Tecnologia</title>
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-xl border border-gray-200">
        
        <div className="text-center">
          <img src={logo} alt="Logo Orius Tecnologia" className="mx-auto h-24 w-auto mb-4"/>
          <h1 className="text-3xl font-bold text-[#4a4e51]">Acesso ao Sistema</h1>
          <p className="mt-2 text-gray-500">Faça login para continuar</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="relative">
            <label htmlFor="email" className="sr-only">E-mail</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-gray-300 p-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#dd6825] focus:outline-none focus:ring-[#dd6825] sm:text-sm"
              placeholder="E-mail de acesso"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label htmlFor="senha" className="sr-only">Senha</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-gray-300 p-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#dd6825] focus:outline-none focus:ring-[#dd6825] sm:text-sm"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input id="lembrar-me" name="lembrar-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#dd6825] focus:ring-[#dd6825]" />
              <label htmlFor="lembrar-me" className="ml-2 block text-gray-900">Lembrar-me</label>
            </div>
            <Link to="/forgot-password" className="font-medium text-[#dd6825] hover:text-[#c25a1f]">
              Esqueceu sua senha?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#dd6825] py-3 px-4 text-sm font-semibold text-white hover:bg-[#c25a1f] focus:outline-none focus:ring-2 focus:ring-[#dd6825] focus:ring-offset-2 transition-colors disabled:bg-[#dd6825]/50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Orius Tecnologia. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}