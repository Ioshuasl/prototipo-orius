import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RevisaoAtoModal from './Components/RevisaoAtoModal';
import { gerarTextoAverbacao } from './functions/AverbacaoUtils';
import { mockAtosDatabase } from '../lib/Constants';
import EtapaSolicitacaoAverbacao from './Components/EtapaSolicitacaoAverbacao';
import EtapaRegistroAverbacao from './Components/EtapaRegistroAverbacao';
import EtapaPagamento from './Components/EtapaPagamento'; // O componente de pagamento é genérico e pode ser reutilizado.

// 1. Definindo a estrutura de estado para o processo de averbação
type EtapaAverbacao = 'SOLICITACAO' | 'REGISTRO' | 'PAGAMENTO';
type StatusAverbacao = 'Montagem' | 'Aguardando Registro' | 'Aguardando Pagamento' | 'Finalizado' | 'Cancelado';

export interface ProcessoAverbacaoState {
    etapa: EtapaAverbacao;
    status: StatusAverbacao;
    atoEncontrado: any | null;
    requerente: { tipo: 'fisica' | 'juridica'; nome?: string; cpf?: string; razaoSocial?: string; cnpj?: string; };
    dadosAverbacao: { // Contém os dados para o formulário específico da averbação
        tipoAverbacao: string;
        [key: string]: any; // Permite outros campos dinâmicos
    };
    textoAverbacao: string; // O texto do termo gerado
    valores: { emolumentos: number; fundos: number; taxas: number; total: number; };
    pagamento: { metodo: string; status: 'pendente' | 'pago'; comprovante: File | null };
}

// 2. Estado inicial do processo
const initialAverbacaoState: ProcessoAverbacaoState = {
    etapa: 'SOLICITACAO',
    status: 'Montagem',
    atoEncontrado: null,
    requerente: { tipo: 'fisica' },
    dadosAverbacao: { tipoAverbacao: '' },
    textoAverbacao: '',
    valores: { emolumentos: 0, fundos: 0, taxas: 0, total: 0 },
    pagamento: { metodo: '', status: 'pendente', comprovante: null },
};


export default function EmissaoAverbacao() {
    const [processo, setProcesso] = useState<ProcessoAverbacaoState>(initialAverbacaoState);
    const [isSearching, setIsSearching] = useState(false);
    const [headerTitle, setHeaderTitle] = useState("Nova Averbação");
    const [isRevisaoModalOpen, setIsRevisaoModalOpen] = useState(false);
    const navigate = useNavigate();

    // Função de busca do ato original (idêntica à da emissão de certidão)
    const handleSearch = (criteria: { tipo: 'protocolo' | 'termo' | 'livroFolha', valor?: string, livro?: string, folha?: string }) => {
        setIsSearching(true);
        toast.info(`Buscando ato...`);

        setTimeout(() => {
            const ato = mockAtosDatabase.find(r => {
                if (criteria.tipo === 'livroFolha') {
                    return r.livro === criteria.livro && r.folha === criteria.folha;
                }
                return r[criteria.tipo] === criteria.valor;
            });

            if (ato) {
                setProcesso(prev => ({ ...prev, atoEncontrado: ato }));
                setHeaderTitle(`Averbação em Ato de ${ato.nomePrincipal}`);
                toast.success("Ato encontrado com sucesso!");
            } else {
                toast.error("Nenhum ato encontrado para averbar.");
            }
            setIsSearching(false);
        }, 1500);
    };

    // Função para concluir a primeira etapa
    const handleConcluirSolicitacao = () => {
        if (!processo.requerente.nome && !processo.requerente.razaoSocial) {
            return toast.warn("É necessário preencher os dados do requerente.");
        }
        if (!processo.dadosAverbacao.tipoAverbacao) {
            return toast.warn("É necessário selecionar o tipo de averbação.");
        }

        // Utiliza nossa nova função para gerar o texto do termo
        const textoGerado = gerarTextoAverbacao(processo.atoEncontrado, processo.dadosAverbacao);

        // Simulação de cálculo de valores para averbação
        const emolumentos = 25.30;
        const fundos = 5.15;
        const taxas = 2.55;
        const total = emolumentos + fundos + taxas;

        setProcesso(prev => ({
            ...prev,
            etapa: 'REGISTRO',
            status: 'Aguardando Registro',
            textoAverbacao: textoGerado,
            valores: { emolumentos, fundos, taxas, total }
        }));
        setHeaderTitle("Registro do Termo de Averbação");
        toast.success("Solicitação concluída. Prossiga para o registro.");
    };

    // Função para concluir a segunda etapa (registro)
    const handleConcluirRegistro = () => {
        setProcesso(prev => ({ ...prev, etapa: 'PAGAMENTO', status: 'Aguardando Pagamento' }));
        setHeaderTitle("Finalização e Pagamento");
        toast.success("Termo de averbação pronto para pagamento.");
    };

    // Função para confirmar o pagamento
    const handleConfirmarPagamento = () => {
        setProcesso(prev => ({
            ...prev,
            status: 'Finalizado',
            pagamento: { ...prev.pagamento, status: 'pago' }
        }));
        toast.success("Averbação finalizada e pagamento confirmado!");
    };

    // Funções de navegação e desistência
    const handleVoltar = () => {
        setProcesso(prev => {
            if (prev.etapa === 'REGISTRO') return { ...prev, etapa: 'SOLICITACAO', status: 'Montagem' };
            if (prev.etapa === 'PAGAMENTO') return { ...prev, etapa: 'REGISTRO', status: 'Aguardando Registro' };
            return prev;
        });
    };

    const handleDesistir = () => {
        setProcesso(initialAverbacaoState);
        setHeaderTitle("Nova Averbação");
        navigate('/registro-civil/averbacoes'); // Navega de volta para a tela de gerenciamento
    };

    const renderEtapaAtual = () => {
        switch (processo.etapa) {
            case 'SOLICITACAO':
                // Este componente será criado no próximo passo
                return (
                    <EtapaSolicitacaoAverbacao
                        processo={processo}
                        setProcesso={setProcesso}
                        onConcluir={handleConcluirSolicitacao}
                        isSearching={isSearching}
                        handleSearch={handleSearch}
                        onRevisarAto={() => setIsRevisaoModalOpen(true)}
                        onDesistir={handleDesistir}
                    />
                );
            case 'REGISTRO':
                // Este componente será criado futuramente
                return (
                    <EtapaRegistroAverbacao
                        processo={processo}
                        onConcluir={handleConcluirRegistro}
                        onVoltar={handleVoltar}
                    />
                );
            case 'PAGAMENTO':
                // Reutilizaremos o componente EtapaPagamento
                return (
                    <EtapaPagamento
                        pedido={processo} // Passamos o processo como 'pedido'
                        setPedido={setProcesso}
                        onConfirmarPagamento={handleConfirmarPagamento}
                        onVoltar={handleVoltar}
                    />
                );
            default:
                return <div>Etapa desconhecida.</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 transition-colors duration-500">{headerTitle}</h1>
                <p className="text-md text-gray-500 mt-1">Fluxo de trabalho para registro de averbações nos atos civis.</p>
            </header>

            {renderEtapaAtual()}

            <RevisaoAtoModal
                isOpen={isRevisaoModalOpen}
                onClose={() => setIsRevisaoModalOpen(false)}
                ato={processo.atoEncontrado}
            />
        </div>
    );
}