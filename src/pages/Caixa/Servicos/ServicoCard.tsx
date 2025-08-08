interface ServiceCardProps {
    service: {
        id: string;
        type: string;
        date: string;
        value: number;
        status: 'Pago' | 'Aguardando Pagamento';
        sealInfo: string;
    };
    onEmitReceipt: (id: string) => void;
    onPrintReport: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEmitReceipt, onPrintReport }) => {
    const statusColor = service.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Serviço #{service.id} - {service.type}</h3>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">Data:</span> {service.date}
                </p>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">Valor:</span> R$ {service.value.toFixed(2)}
                </p>
                <p className="text-gray-600 mb-2">
                    <span className="font-medium">Selo:</span> {service.sealInfo}
                </p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                    {service.status}
                </span>
            </div>
            <div className="flex flex-col space-y-2">
                <button
                    onClick={() => onEmitReceipt(service.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Emitir Recibo
                </button>
                <button
                    onClick={() => onPrintReport(service.id)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                    Imprimir Relatório
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;