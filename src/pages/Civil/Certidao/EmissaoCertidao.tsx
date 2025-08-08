import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EtapaSolicitacao from './Components/EtapaSolicitacao';
import RevisaoAtoModal from './Components/RevisaoAtoModal';
import EtapaEmissao from './Components/EtapaEmissao';
import EtapaPagamento from './Components/EtapaPagamento';
import { preencherTemplate, preencherTemplateVerso } from './functions/CertidaoUtils';
import { type PedidoState } from '../types';
import { mockAtosDatabase } from '../lib/Constants';


const initialPedidoState: PedidoState = {
    etapa: 'SOLICITACAO',
    status: 'Montagem',
    ato_id: null,
    requerente: { tipo: 'fisica' },
    configuracao: {
        tipoCertidao: '',
        formato: 'Física (Papel de Segurança)',
        valores: { emolumentos: 0, fundos: 0, taxas: 0, total: 0 }
    },
    textoCertidao: '',
    textoCertidaoVerso: '',
    selo: null,
    pagamento: { metodo: '', status: 'pendente', comprovante: null },
};

export default function EmissaoCertidao() {
    const [pedido, setPedido] = useState<PedidoState>(initialPedidoState);
    const [isSearching, setIsSearching] = useState(false);
    const [headerTitle, setHeaderTitle] = useState("Emissão de Certidão");
    const [isRevisaoModalOpen, setIsRevisaoModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (criteria: { tipo: 'protocolo' | 'termo' | 'livroFolha', valor?: string, livro?: string, folha?: string }) => {
        setIsSearching(true);
        toast.info(`Buscando ato...`);

        setTimeout(() => {
            let ato = null;

            if (criteria.tipo === 'livroFolha') {
                ato = mockAtosDatabase.find(r => r.livro === criteria.livro && r.folha === criteria.folha);
            } else {
                ato = mockAtosDatabase.find(r => r[criteria.tipo] === criteria.valor);
            }

            if (ato) {
                setPedido(prev => ({ ...prev, ato_id: ato }));
                setHeaderTitle(`Certidão de ${ato.nomePrincipal}`);
                toast.success("Ato encontrado com sucesso!");
            } else {
                toast.error("Nenhum ato encontrado. Verifique os dados e tente novamente.");
            }
            setIsSearching(false);
        }, 1500);
    };

    const handleConcluirSolicitacao = () => {
        if (!pedido.requerente.nome && !pedido.requerente.razaoSocial) {
            toast.warn("É necessário preencher os dados do requerente.");
            return;
        }
        if (!pedido.configuracao.tipoCertidao) {
            toast.warn("É necessário selecionar o tipo de certidão.");
            return;
        }

        const textoFrenteCertidao = preencherTemplate(pedido.ato_id, pedido.configuracao);
        const textoVersoCertidao = preencherTemplateVerso(pedido.ato_id);

        const emolumentos = 45.50;
        const fundos = 10.25;
        const taxas = 5.75;
        const total = emolumentos + fundos + taxas;

        setPedido(prev => ({
            ...prev,
            etapa: 'EMISSAO',
            status: 'Solicitacao',
            textoCertidao: textoFrenteCertidao,
            textoCertidaoVerso: textoVersoCertidao,
            configuracao: {
                ...prev.configuracao,
                valores: { emolumentos, fundos, taxas, total }
            }
        }));
        setHeaderTitle("Emissão da Certidão");
        toast.success("Solicitação concluída com sucesso!");
    };

    const handleVoltarParaSolicitacao = () => {
        setPedido(prev => ({
            ...prev,
            etapa: 'SOLICITACAO',
            status: 'Montagem', 
            selo: null, 
            textoCertidao: '', 
            textoCertidaoVerso: '', 
        }));
        setHeaderTitle(`Certidão de ${pedido.ato_id.nomePrincipal}`); 
        toast.info("Retornando para a etapa de solicitação.");
    };

    const handleConcluirEmissao = () => {
        setPedido(prev => ({ ...prev, etapa: 'PAGAMENTO', status: 'Pagamento Pendente' }));
        setHeaderTitle("Finalização e Pagamento");
        toast.success("Processo de emissão finalizado com sucesso!");
    };

    const handleVoltarParaEmissao = () => {
        setPedido(prev => ({
            ...prev,
            etapa: 'EMISSAO',
            status: 'Emitido'
        }));
        setHeaderTitle("Emissão da Certidão");
        toast.info("Retornando para a etapa de emissão.");
    };

    const handleConfirmarPagamento = () => {
        setPedido(prev => ({
            ...prev,
            status: 'Finalizado',
            pagamento: {
                ...prev.pagamento,
                status: 'pago'
            }
        }));
        toast.success("Pagamento confirmado e processo finalizado!");
    };
    
    const handleDesistirEmissao = () => {
        setPedido(initialPedidoState); // Reseta o estado para o inicial
        setHeaderTitle("Emissão de Certidão"); // Reseta o título
        toast.info("A emissão da certidão foi cancelada.");
        navigate('/registro-civil/certidoes');
    };

    const renderEtapaAtual = () => {
        switch (pedido.etapa) {
            case 'SOLICITACAO':
                return (
                    <EtapaSolicitacao
                        pedido={pedido}
                        setPedido={setPedido}
                        onConcluir={handleConcluirSolicitacao}
                        isSearching={isSearching}
                        handleSearch={handleSearch}
                        onRevisarAto={() => setIsRevisaoModalOpen(true)}
                        onDesistir={handleDesistirEmissao}
                    />
                );
            case 'EMISSAO':
                return (
                    <EtapaEmissao
                        pedido={pedido}
                        setPedido={setPedido}
                        onConcluir={handleConcluirEmissao}
                        onVoltar={handleVoltarParaSolicitacao}
                    />
                );
            case 'PAGAMENTO':
                return <EtapaPagamento 
                            pedido={pedido}
                            setPedido={setPedido}
                            onConfirmarPagamento={handleConfirmarPagamento}
                            onVoltar={handleVoltarParaEmissao}
                        />;
            default:
                return <div>Etapa desconhecida.</div>;
        }
    };

    return (
        <div className="mx-auto space-y-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 transition-colors duration-500">{headerTitle}</h1>
                <p className="text-md text-gray-500 mt-1">Fluxo de trabalho para solicitação, montagem e emissão de certidões.</p>
            </header>

            {renderEtapaAtual()}

            <RevisaoAtoModal
                isOpen={isRevisaoModalOpen}
                onClose={() => setIsRevisaoModalOpen(false)}
                ato={pedido.ato_id}
            />
        </div>
    );
}