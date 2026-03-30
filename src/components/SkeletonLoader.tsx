import React from 'react';

interface SkeletonLoaderProps {
    type?: 'text' | 'card' | 'table' | 'stat';
    count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'text', count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'stat':
                return (
                    <div className="bg-white p-6 rounded-12 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 skeleton rounded-10" />
                            <div className="w-16 h-4 skeleton rounded" />
                        </div>
                        <div className="w-24 h-4 skeleton rounded mb-2" />
                        <div className="w-32 h-8 skeleton rounded" />
                    </div>
                );
            case 'card':
                return (
                    <div className="bg-white p-6 rounded-12 border border-border shadow-sm space-y-4">
                        <div className="w-3/4 h-6 skeleton rounded" />
                        <div className="w-full h-4 skeleton rounded" />
                        <div className="w-5/6 h-4 skeleton rounded" />
                        <div className="flex gap-2 mt-4">
                            <div className="w-20 h-8 skeleton rounded" />
                            <div className="w-20 h-8 skeleton rounded" />
                        </div>
                    </div>
                );
            case 'table':
                return (
                    <div className="bg-white rounded-12 border border-border overflow-hidden">
                        <div className="p-4 border-b border-border">
                            <div className="w-48 h-6 skeleton rounded" />
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-4 border-b border-border flex gap-4">
                                <div className="w-1/4 h-4 skeleton rounded" />
                                <div className="w-1/4 h-4 skeleton rounded" />
                                <div className="w-1/4 h-4 skeleton rounded" />
                                <div className="w-1/4 h-4 skeleton rounded" />
                            </div>
                        ))}
                    </div>
                );
            default:
                return <div className="w-full h-4 skeleton rounded" />;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </>
    );
};

export default SkeletonLoader;
