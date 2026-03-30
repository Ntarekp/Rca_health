import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md', 
    text = 'Loading...', 
    fullScreen = false 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    const containerClasses = fullScreen 
        ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50'
        : 'flex flex-col items-center justify-center p-8';

    return (
        <div className={containerClasses}>
            <div className={`${sizeClasses[size]} border-primary/20 border-t-primary rounded-full animate-spin`} />
            {text && (
                <p className="mt-4 text-14px text-text-secondary font-medium animate-pulse">{text}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;
