import { X } from 'lucide-react';

interface RevisaoAtoModalProps {
  isOpen: boolean;
  onClose: () => void;
  ato: any;
}

// Componente auxiliar para renderizar um campo de detalhe (sem alteração)
const DetalheCampo = ({ label, value }: { label: string; value: any }) => {
    if (!value) return null;
    return (
        <div className="py-2 px-3 bg-gray-50 rounded-md">
            <p className="text-xs font-semibold text-gray-500">{label}</p>
            <p className="text-md text-gray-800">{String(value)}</p>
        </div>
    );
};

// Componente auxiliar para seções
const Secao = ({ titulo, children }: { titulo: string, children: React.ReactNode }) => (
    <div className="space-y-3">
        {/* ALTERADO: Cor do título da seção para o cinza escuro da marca */}
        <h4 className="text-lg font-semibold text-[#4a4e51] border-b pb-2 mb-3">{titulo}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
        </div>
    </div>
);


export default function RevisaoAtoModal({ isOpen, onClose, ato }: RevisaoAtoModalProps) {
  if (!isOpen || !ato) {
    return null;
  }

  const { tipoAto, nomePrincipal, matricula, dadosCompletos } = ato;

  const renderDetalhesAto = () => {
    switch (tipoAto) {
      case 'Nascimento':
        return (
            <>
                <Secao titulo="Dados do Registro">
                    <DetalheCampo label="Nome Principal" value={nomePrincipal} />
                    <DetalheCampo label="Matrícula" value={matricula} />
                    <DetalheCampo label="CPF" value={dadosCompletos.cpf} />
                    <DetalheCampo label="Sexo" value={dadosCompletos.sexo} />
                    <DetalheCampo label="Data do Registro" value={new Date(dadosCompletos.dataRegistro).toLocaleDateString('pt-BR')} />
                    <DetalheCampo label="DNV" value={dadosCompletos.dnv} />
                </Secao>
                 <Secao titulo="Nascimento">
                    <DetalheCampo label="Data de Nascimento" value={new Date(dadosCompletos.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
                    <DetalheCampo label="Horário" value={new Date(dadosCompletos.dataNascimento).toLocaleTimeString('pt-BR', {timeZone: 'UTC'})} />
                    <DetalheCampo label="Local de Nascimento" value={dadosCompletos.localNascimento} />
                    <DetalheCampo label="Município / UF" value={`${dadosCompletos.municipioNascimento} / ${dadosCompletos.ufNascimento}`} />
                </Secao>
                 <Secao titulo="Filiação">
                    {dadosCompletos.filiacao?.map((genitor: any, index: number) => (
                        // ALTERADO: Cor de fundo e borda da seção de filiação para cinza neutro
                        <div key={index} className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                             <DetalheCampo label={`Genitor(a) ${index + 1}`} value={genitor.nome} />
                             <DetalheCampo label="Naturalidade" value={`${genitor.naturalidade} / ${genitor.ufNaturalidade}`} />
                             <div className="md:col-span-2">
                                <DetalheCampo label="Avós" value={genitor.avos?.map((avo: any) => avo.nome).join('; ')} />
                             </div>
                        </div>
                    ))}
                </Secao>
                <Secao titulo="Anotações e Averbações">
                    <div className="md:col-span-3">
                        <DetalheCampo label="Anotações / Averbações" value={dadosCompletos.anotacoesAverbacoes} />
                        <DetalheCampo label="Anotações de Cadastro" value={dadosCompletos.anotacoesCadastro} />
                    </div>
                </Secao>
            </>
        );
      
      case 'Casamento':
        return (
            <>
                <Secao titulo="Dados da Celebração">
                    <DetalheCampo label="Protagonistas" value={nomePrincipal} />
                    <DetalheCampo label="Matrícula" value={matricula} />
                    <DetalheCampo label="Data da Celebração" value={new Date(dadosCompletos.dataCelebracao).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
                    <DetalheCampo label="Data do Registro" value={new Date(dadosCompletos.dataRegistro).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
                    <DetalheCampo label="Regime de Bens" value={dadosCompletos.regimeBens} />
                </Secao>
                {dadosCompletos.conjuges?.map((conjuge: any, index: number) => (
                    <Secao key={index} titulo={`${index + 1}º Cônjuge`}>
                        <DetalheCampo label="Nome Atual" value={conjuge.nomeAtual} />
                        <DetalheCampo label="Nome de Habilitação" value={conjuge.nomeHabilitacao} />
                        <DetalheCampo label="CPF" value={conjuge.cpf} />
                        <DetalheCampo label="Data de Nascimento" value={new Date(conjuge.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
                        <DetalheCampo label="Nacionalidade" value={conjuge.nacionalidade} />
                        <DetalheCampo label="Estado Civil Anterior" value={conjuge.estadoCivilAnterior} />
                        <DetalheCampo label="Naturalidade" value={`${conjuge.municipioNascimento} / ${conjuge.ufNascimento}`} />
                        <div className="md:col-span-3">
                            <DetalheCampo label="Genitores" value={conjuge.genitores?.map((p: any) => p.nome).join('; ')} />
                        </div>
                    </Secao>
                ))}
                 <Secao titulo="Anotações e Averbações">
                    <div className="md:col-span-3">
                        <DetalheCampo label="Anotações / Averbações" value={dadosCompletos.anotacoesAverbacoes} />
                    </div>
                </Secao>
            </>
        );

      case 'Obito':
        return (
             <>
                <Secao titulo="Dados do Falecido">
                    <DetalheCampo label="Nome" value={nomePrincipal} />
                    <DetalheCampo label="Matrícula" value={matricula} />
                    <DetalheCampo label="CPF" value={dadosCompletos.cpf} />
                    <DetalheCampo label="Sexo" value={dadosCompletos.sexo} />
                     <DetalheCampo label="Idade" value={dadosCompletos.idade} />
                    <DetalheCampo label="Estado Civil" value={dadosCompletos.estadoCivil} />
                    <DetalheCampo label="Último Cônjuge" value={dadosCompletos.ultimoConjuge} />
                     <DetalheCampo label="Genitores" value={dadosCompletos.genitores?.map((p: any) => p.nome).join('; ')} />
                </Secao>
                <Secao titulo="Dados do Óbito">
                    <DetalheCampo label="Data do Óbito" value={new Date(dadosCompletos.dataObito).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
                     <DetalheCampo label="Horário" value={new Date(dadosCompletos.dataObito).toLocaleTimeString('pt-BR', {timeZone: 'UTC'})} />
                     <DetalheCampo label="Local do Falecimento" value={dadosCompletos.localFalecimento} />
                     <DetalheCampo label="Município / UF" value={`${dadosCompletos.municipioFalecimento} / ${dadosCompletos.ufFalecimento}`} />
                     <div className="md:col-span-3">
                        <DetalheCampo label="Causa da Morte" value={dadosCompletos.causaMorte?.join(', ')} />
                     </div>
                     <DetalheCampo label="Médico" value={`${dadosCompletos.medico.nome} (${dadosCompletos.medico.documento})`} />
                </Secao>
                <Secao titulo="Informações do Registro">
                    <DetalheCampo label="Local de Sepultamento" value={`${dadosCompletos.localSepultamento} - ${dadosCompletos.municipioSepultamento}/${dadosCompletos.ufSepultamento}`} />
                    <DetalheCampo label="Declarante" value={dadosCompletos.declarante} />
                    <DetalheCampo label="Deixou Bens?" value={dadosCompletos.bens} />
                    <div className="md:col-span-3">
                        <DetalheCampo label="Filhos" value={dadosCompletos.filhos?.map((f: any) => `${f.nome} (${f.idade} anos)`).join('; ')} />
                    </div>
                </Secao>
            </>
        )

      case 'Livro E':
        return (
            <Secao titulo={`Detalhes do Ato de ${dadosCompletos.tipoAtoLivroE}`}>
                 <DetalheCampo label="Protagonista" value={nomePrincipal} />
                 <DetalheCampo label="Matrícula" value={matricula} />
                 <DetalheCampo label="Interditado(a)" value={`${dadosCompletos.interditado.nome} (CPF: ${dadosCompletos.interditado.cpf})`} />
                 <DetalheCampo label="Curador(a)" value={dadosCompletos.curador.nome} />
                 <DetalheCampo label="Data da Sentença" value={new Date(dadosCompletos.dataSentenca).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
                 <DetalheCampo label="Juízo" value={dadosCompletos.juizo} />
                 <div className="md:col-span-3">
                    <DetalheCampo label="Anotações / Averbações" value={dadosCompletos.anotacoesAverbacoes} />
                 </div>
            </Secao>
        );

      default:
        return <p>Não há um layout de visualização para este tipo de ato.</p>;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-100 rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 bg-white rounded-t-lg sticky top-0">
          <div>
            {/* ALTERADO: Cor do título do modal */}
             <h2 className="text-xl font-bold text-[#4a4e51]">Revisão do Ato Completo</h2>
             <p className="text-sm text-gray-500">Ato de {tipoAto} - {nomePrincipal}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 rounded-full hover:bg-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto space-y-6 pb-24">
            {renderDetalhesAto()}
        </main>
      </div>
    </div>
  );
}