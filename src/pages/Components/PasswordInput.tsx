import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.ComponentPropsWithoutRef<'input'> {}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    return (
        <div className="relative w-full">
            <input
                {...props} // Passa todas as props (value, onChange, name, id, etc.) para o input
                type={isPasswordVisible ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-md p-2 pr-10" // pr-10 para dar espaço ao ícone
            />
            <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            >
                {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
};

export default PasswordInput;