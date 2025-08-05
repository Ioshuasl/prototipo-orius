import React from 'react';
import { type LucideProps, CheckCircle } from 'lucide-react';

interface TriagemCardProps {
    icon: React.ComponentType<LucideProps>;
    title: string;
    text: string;
    isActive: boolean;
    onClick: () => void;
}

export default function TriagemCasoEspecialCard({
    icon: Icon, // Renomeia a prop 'icon' para 'Icon' para poder usá-la como um componente JSX
    title,
    text,
    isActive,
    onClick
}: TriagemCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative text-left p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                isActive
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                    : 'bg-white border-gray-300'
            }`}
        >
            <div className="flex items-start gap-4">
                <Icon
                    className={`h-8 w-8 mt-1 flex-shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}
                />
                <div>
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{text}</p>
                </div>
            </div>
            {isActive && (
                <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600 bg-white rounded-full" />
            )}
        </button>
    );
}