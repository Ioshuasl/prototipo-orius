import { type LucideProps } from 'lucide-react'; // Importe o tipo LucideProps

interface EmptyStateProps {
    icon: React.ComponentType<LucideProps>;
    title: string;
    message: string;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, message, action }) => {
    return (
        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="flex justify-center items-center mb-4">
                <Icon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};

export default EmptyState;