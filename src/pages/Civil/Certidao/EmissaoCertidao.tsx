import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EtapaSolicitacao from './Components/EtapaSolicitacao';
import RevisaoAtoModal from './Components/RevisaoAtoModal';
import EtapaEmissao from './Components/EtapaEmissao';
import EtapaPagamento from './Components/EtapaPagamento';
import { preencherTemplate, preencherTemplateVerso } from './functions/CertidaoUtils';


const mockAtosDatabase: any[] = [
    // --- DADOS PARA CERTIDÃO DE NASCIMENTO ---
    {
        protocolo: '2025-N-12345',
        termo: '5890',
        livro: 'A-101',
        folha: '15',
        tipoAto: 'Nascimento',
        nomePrincipal: 'Helena da Silva Santos',
        matricula: '123456 01 55 2025 1 00101 015 0005890 10',
        dadosCompletos: {
            cpf: '111.222.333-44',
            dataNascimento: '2025-03-15T09:30:00',
            localNascimento: 'Hospital Materno Infantil',
            municipioNascimento: 'Goiânia',
            ufNascimento: 'GO',
            sexo: 'Feminino',
            filiacao: [
                {
                    nome: 'Marcos de Oliveira Santos',
                    naturalidade: 'Anápolis',
                    ufNaturalidade: 'GO',
                    avos: [
                        { nome: 'José Santos' },
                        { nome: 'Maria Aparecida de Oliveira' }
                    ]
                },
                {
                    nome: 'Ana Luíza da Silva',
                    naturalidade: 'Palmas',
                    ufNaturalidade: 'TO',
                    avos: [
                        { nome: 'Carlos da Silva' },
                        { nome: 'Joana Pereira da Silva' }
                    ]
                }
            ],
            gemeo: null, // ou { nome: '...', matricula: '...' }
            dataRegistro: '2025-03-18',
            dnv: '4589987-1',
            anotacoesAverbacoes: 'Nenhuma.',
            anotacoesCadastro: 'Documento de identidade do pai: 123456 SSP/GO.'
        }
    },
    // --- DADOS PARA CERTIDÃO DE CASAMENTO ---
    {
        protocolo: '2024-C-67890',
        termo: '1122',
        livro: 'B-AUX-05',
        folha: '112',
        tipoAto: 'Casamento',
        nomePrincipal: 'Arthur Pereira & Julia Martins',
        matricula: '987654 01 55 2024 2 00005 112 0001122 25',
        dadosCompletos: {
            dataCelebracao: '2024-11-20',
            dataRegistro: '2024-11-20',
            regimeBens: 'Comunhão Parcial de Bens',
            anotacoesAverbacoes: 'Alteração de regime de bens para Comunhão Universal, conforme pacto antenupcial lavrado no 2º Tabelionato de Notas.',
            anotacoesCadastro: null,
            conjuges: [
                {
                    nomeHabilitacao: 'Arthur Pereira Rocha',
                    nomeAtual: 'Arthur Pereira Rocha',
                    cpf: '444.555.666-77',
                    dataNascimento: '1995-05-10',
                    nacionalidade: 'Brasileira',
                    estadoCivilAnterior: 'Solteiro',
                    municipioNascimento: 'Rio de Janeiro',
                    ufNascimento: 'RJ',
                    genitores: [
                        { nome: 'Ricardo Pereira Rocha' },
                        { nome: 'Sandra Marques Pereira' }
                    ]
                },
                {
                    nomeHabilitacao: 'Julia Martins Costa',
                    nomeAtual: 'Julia Martins Costa Pereira',
                    cpf: '777.888.999-00',
                    dataNascimento: '1997-02-15',
                    nacionalidade: 'Brasileira',
                    estadoCivilAnterior: 'Solteira',
                    municipioNascimento: 'São Paulo',
                    ufNascimento: 'SP',
                    genitores: [
                        { nome: 'Fernando Costa' },
                        { nome: 'Beatriz Martins Costa' }
                    ]
                }
            ]
        }
    },
    // --- DADOS PARA CERTIDÃO DE ÓBITO ---
    {
        protocolo: '2025-O-54321',
        termo: '987',
        livro: 'C-22',
        folha: '250',
        tipoAto: 'Obito',
        nomePrincipal: 'Roberto Almeida',
        matricula: '543210 01 55 2025 3 00022 250 0000987 99',
        dadosCompletos: {
            cpf: '999.888.777-66',
            dataObito: '2025-07-20T14:00:00',
            dataNascimento: '1950-01-25',
            idade: '75 anos',
            sexo: 'Masculino',
            estadoCivil: 'Viúvo',
            ultimoConjuge: 'Maria Souza Almeida',
            localFalecimento: 'Hospital Santa Casa',
            municipioFalecimento: 'Goiânia',
            ufFalecimento: 'GO',
            causaMorte: ['Insuficiência respiratória', 'Pneumonia bacteriana'],
            medico: {
                nome: 'Dr. Carlos Andrade',
                documento: 'CRM/GO 12345'
            },
            localSepultamento: 'Cemitério Jardim das Palmeiras',
            municipioSepultamento: 'Goiânia',
            ufSepultamento: 'GO',
            dataRegistro: '2025-07-21',
            declarante: 'Fernanda Almeida (Filha)',
            bens: 'Sim, a inventariar.',
            filhos: [
                { nome: 'Fernanda Almeida', idade: '45' },
                { nome: 'Ricardo Almeida', idade: '42' }
            ],
            genitores: [
                { nome: 'João Almeida' },
                { nome: 'Catarina Pires de Almeida' }
            ],
            anotacoesAverbacoes: 'Nenhuma.',
            anotacoesCadastro: null,
        }
    },
    // --- DADOS PARA LIVRO E ---
    {
        protocolo: '2023-E-11111',
        termo: '203',
        livro: 'E-01',
        folha: '45',
        tipoAto: 'Livro E',
        nomePrincipal: 'Interdição de Maria Abadia',
        matricula: '111111 01 55 2023 4 00001 045 0000203 50',
        dadosCompletos: {
            tipoAtoLivroE: 'Interdição',
            interditado: {
                nome: 'Maria Abadia da Conceição',
                cpf: '123.456.789-00'
            },
            curador: {
                nome: 'João da Conceição (Filho)'
            },
            dataSentenca: '2023-10-05',
            juizo: 'Vara de Família e Sucessões da Comarca de Trindade - GO',
            anotacoesAverbacoes: 'Curatela provisória convertida em definitiva.'
        }
    },
];



type Etapa = 'SOLICITACAO' | 'EMISSAO' | 'PAGAMENTO';
type StatusPedido = 'Montagem' | 'Solicitacao' | 'Emitido' | 'Pagamento Pendente' | 'Finalizado' | 'Cancelado';
interface PedidoState {
    etapa: Etapa;
    status: StatusPedido ;
    atoEncontrado: any | null;
    requerente: { tipo: 'fisica' | 'juridica'; nome?: string; cpf?: string; razaoSocial?: string; cnpj?: string; };
    configuracao: { tipoCertidao: number | ''; formato: 'Física (Papel de Segurança)' | 'Digital (PDF)'; valores: { emolumentos: number; fundos: number; taxas: number; total: number; }; };
    textoCertidao: string;
    textoCertidaoVerso: string;
    selo: string | null;
    pagamento: {
        metodo: 'dinheiro' | 'credito' | 'debito' | 'pix' | 'boleto' | 'caixa' | '';
        status: 'pendente' | 'pago';
        comprovante: File | null;
    };
    motivoCancelamento?: string;
}
const initialPedidoState: PedidoState = {
    etapa: 'SOLICITACAO',
    status: 'Montagem',
    atoEncontrado: null,
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
                setPedido(prev => ({ ...prev, atoEncontrado: ato }));
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

        const textoFrenteCertidao = preencherTemplate(pedido.atoEncontrado, pedido.configuracao);
        const textoVersoCertidao = preencherTemplateVerso(pedido.atoEncontrado);

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
        setHeaderTitle(`Certidão de ${pedido.atoEncontrado.nomePrincipal}`); 
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
        <div className="max-w-7xl mx-auto space-y-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 transition-colors duration-500">{headerTitle}</h1>
                <p className="text-md text-gray-500 mt-1">Fluxo de trabalho para solicitação, montagem e emissão de certidões.</p>
            </header>

            {renderEtapaAtual()}

            <RevisaoAtoModal
                isOpen={isRevisaoModalOpen}
                onClose={() => setIsRevisaoModalOpen(false)}
                ato={pedido.atoEncontrado}
            />
        </div>
    );
}