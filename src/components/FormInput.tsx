import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    unit?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    error, 
    icon, 
    unit,
    className = '',
    ...props 
}) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-13px font-semibold text-text-primary">
                    {label}
                    {props.required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    className={`
                        w-full px-4 py-2.5 
                        bg-white border-2 border-border 
                        rounded-10 text-14px font-medium
                        text-text-primary placeholder:text-text-tertiary/60
                        outline-none transition-all duration-200
                        hover:border-primary/30
                        focus:border-primary focus:ring-4 focus:ring-primary/10
                        disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60
                        ${icon ? 'pl-10' : ''}
                        ${unit ? 'pr-12' : ''}
                        ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
                        ${className}
                    `}
                />
                {unit && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-12px font-bold text-text-tertiary">
                        {unit}
                    </span>
                )}
            </div>
            {error && (
                <span className="text-12px text-error font-medium">{error}</span>
            )}
        </div>
    );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
    label, 
    error, 
    icon,
    className = '',
    children,
    ...props 
}) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-13px font-semibold text-text-primary">
                    {label}
                    {props.required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary z-10">
                        {icon}
                    </div>
                )}
                <select
                    {...props}
                    className={`
                        w-full px-4 py-2.5 
                        bg-white border-2 border-border 
                        rounded-10 text-14px font-medium
                        text-text-primary
                        outline-none transition-all duration-200
                        hover:border-primary/30
                        focus:border-primary focus:ring-4 focus:ring-primary/10
                        disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60
                        appearance-none cursor-pointer
                        ${icon ? 'pl-10' : ''}
                        ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
                        ${className}
                    `}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                    }}
                >
                    {children}
                </select>
            </div>
            {error && (
                <span className="text-12px text-error font-medium">{error}</span>
            )}
        </div>
    );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ 
    label, 
    error, 
    className = '',
    ...props 
}) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-13px font-semibold text-text-primary">
                    {label}
                    {props.required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <textarea
                {...props}
                className={`
                    w-full px-4 py-3
                    bg-white border-2 border-border 
                    rounded-10 text-14px font-medium
                    text-text-primary placeholder:text-text-tertiary/60
                    outline-none transition-all duration-200
                    hover:border-primary/30
                    focus:border-primary focus:ring-4 focus:ring-primary/10
                    disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60
                    resize-none
                    ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
                    ${className}
                `}
            />
            {error && (
                <span className="text-12px text-error font-medium">{error}</span>
            )}
        </div>
    );
};

interface FormDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const FormDateInput: React.FC<FormDateInputProps> = ({ 
    label, 
    error, 
    className = '',
    ...props 
}) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-13px font-semibold text-text-primary">
                    {label}
                    {props.required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <input
                type="date"
                {...props}
                className={`
                    w-full px-4 py-2.5 
                    bg-white border-2 border-border 
                    rounded-10 text-14px font-medium
                    text-text-primary
                    outline-none transition-all duration-200
                    hover:border-primary/30
                    focus:border-primary focus:ring-4 focus:ring-primary/10
                    disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                    [&::-webkit-calendar-picker-indicator]:opacity-60
                    [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                    ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
                    ${className}
                `}
            />
            {error && (
                <span className="text-12px text-error font-medium">{error}</span>
            )}
        </div>
    );
};
