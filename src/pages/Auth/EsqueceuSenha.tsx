import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ChevronLeft, MailCheck } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Controla qual tela mostrar

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    if (!email) {
      toast.error('Por favor, digite seu e-mail.');
      return;
    }

    setIsLoading(true);

    // Simulação de uma chamada de API
    setTimeout(() => {
      // Aqui iria a lógica para enviar o e-mail de recuperação
      console.log(`Link de recuperação solicitado para: ${email}`);
      
      toast.success("Link de recuperação enviado!");
      setIsLoading(false);
      setIsSubmitted(true); // Muda para a tela de confirmação
    }, 1500);
  };

  // Componente visual para a tela de solicitação
  const RenderRequestForm = () => (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#4a4e51]">Recuperar Senha</h1>
        <p className="mt-2 text-gray-500">Digite seu e-mail para receber o link de recuperação.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <label htmlFor="email" className="sr-only">E-mail</label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-gray-300 p-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#dd6825] focus:outline-none focus:ring-[#dd6825] sm:text-sm"
            placeholder="seu.email@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
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
              'Enviar Link de Recuperação'
            )}
          </button>
        </div>
      </form>
    </>
  );

  // Componente visual para a tela de confirmação
  const RenderConfirmationScreen = () => (
    <div className="text-center">
        <MailCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-[#4a4e51]">Verifique seu e-mail</h1>
        <p className="mt-4 text-gray-600">
            Se o e-mail <strong className="text-[#dd6825]">{email}</strong> estiver em nossa base de dados,
            você receberá um link para redefinir sua senha.
        </p>
        <p className="mt-2 text-sm text-gray-500">
            (Não se esqueça de checar sua caixa de spam)
        </p>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <title>Recuperar Senha | Orius Tecnologia</title>
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-xl border border-gray-200">
        
        {/* Renderiza um dos dois estados: o formulário ou a confirmação */}
        {isSubmitted ? <RenderConfirmationScreen /> : <RenderRequestForm />}
        
        <div className="text-center">
            <Link
                to="/" // Altere para a rota da sua tela de login
                className="flex items-center justify-center gap-2 font-medium text-sm text-[#dd6825] hover:text-[#c25a1f]"
            >
                <ChevronLeft className="h-4 w-4" />
                Voltar para o Login
            </Link>
        </div>

      </div>
    </div>
  );
}