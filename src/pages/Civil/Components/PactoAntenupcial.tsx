import React from 'react';
import { Info, XCircle } from 'lucide-react';

// Interface para as props do componente
interface PactoAntenupcialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PactoAntenupcialModal: React.FC<PactoAntenupcialModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Info className="h-7 w-7 text-blue-600" />
                        Pacto Antenupcial
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full"
                    >
                        <XCircle size={28} />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6 text-gray-700">
                    <p className="text-base">
                        Com base no <strong>CÓDIGO DE NORMAS E PROCEDIMENTOS DO FORO EXTRAJUDICIAL</strong>, o pacto antenupcial é um contrato formal, celebrado por meio de escritura pública, onde os noivos estabelecem as regras sobre o regime de bens que vigorará em seu casamento. Ele serve para que o casal possa escolher um regime diferente do padrão legal (que é o da comunhão parcial de bens) ou para detalhar outras questões patrimoniais.
                    </p>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Como Funciona o Pacto Antenupcial</h3>
                        <p>
                            O procedimento para que um pacto antenupcial tenha validade e produza todos os seus efeitos legais envolve etapas em diferentes serventias extrajudiciais, conforme detalhado nas normas:
                        </p>
                        <ul className="space-y-4 list-none pl-2">
                            <li>
                                <strong className="block text-gray-800">1. Elaboração no Tabelionato de Notas:</strong>
                                <p className="mt-1">Antes do casamento, os noivos devem procurar um Tabelionato de Notas de sua livre escolha para elaborar o pacto por meio de uma escritura pública. Nesta escritura, eles definirão o regime de bens desejado (como separação total, comunhão universal, participação final nos aquestos, ou um regime misto). É dever do oficial de registro civil esclarecer aos noivos sobre os diferentes regimes existentes.</p>
                            </li>
                            <li>
                                <strong className="block text-gray-800">2. Registro no Cartório de Registro de Imóveis:</strong>
                                <p className="mt-1">Para que o pacto tenha eficácia perante terceiros, a escritura pública deve ser registrada no Livro n° 3 – Registro Auxiliar do Cartório de Registro de Imóveis do domicílio dos cônjuges. Este registro é uma condição fundamental para a validade do que foi acordado no pacto. O registro no Livro 3 mencionará os dados da escritura, o nome dos noivos e o regime de bens escolhido.</p>
                            </li>
                            <li>
                                <strong className="block text-gray-800">3. Apresentação no Processo de Habilitação para o Casamento:</strong>
                                <p className="mt-1">Durante o processo de habilitação para o casamento, no Registro Civil de Pessoas Naturais, os noivos devem informar sobre a existência do pacto antenupcial. A existência do pacto é uma condição que será, obrigatoriamente, mencionada no registro do casamento (assento de casamento) e na respectiva certidão de casamento que será emitida após a celebração.</p>
                            </li>
                            <li>
                                <strong className="block text-gray-800">4. Averbação na Matrícula dos Imóveis:</strong>
                                <p className="mt-1">Além do registro no Livro 3 do domicílio do casal, é obrigatório que o pacto seja averbado (anotado) na matrícula de cada imóvel que o casal já possua ou venha a adquirir, para que as regras do pacto se apliquem àquele bem específico e sejam de conhecimento público.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Pontos Importantes</h3>
                        <ul className="space-y-3 list-disc pl-5">
                            <li>
                                <strong>Condição de Validade:</strong> O pacto antenupcial só se torna eficaz após a realização do casamento. Se o casamento não ocorrer, o pacto não produz efeito.
                            </li>
                            <li>
                                <strong>Obrigatoriedade:</strong> A lei exige o pacto antenupcial sempre que os noivos desejarem um regime de bens diferente do regime legal da comunhão parcial. Contudo, é lícito que os noivos celebrem o pacto mesmo que optem pela comunhão parcial, para detalhar questões patrimoniais específicas.
                            </li>
                            <li>
                                <strong>Segurança Jurídica:</strong> Todo esse processo garante que a vontade do casal sobre seus bens seja formalizada e tenha segurança jurídica, sendo válida não apenas entre eles, mas também perante toda a sociedade.
                            </li>
                        </ul>
                    </div>
                </main>

                <footer className="p-4 bg-gray-50 text-right sticky bottom-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Entendi
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PactoAntenupcialModal;