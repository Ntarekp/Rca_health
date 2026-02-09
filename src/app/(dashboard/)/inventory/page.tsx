"use client";

import React, { useState } from 'react';
import {
    Package,
    Search,
    Filter,
    Plus,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    MoreVertical,
    History,
    FileDown,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const InventoryPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const inventoryItems = [
        { id: 1, name: 'Paracetamol 500mg', category: 'Medicines', stock: 450, unit: 'Tablets', status: 'In Stock', lastRestocked: '2024-02-05' },
        { id: 2, name: 'Sterile Bandages', category: 'Equipment', stock: 12, unit: 'Rolls', status: 'Low Stock', lastRestocked: '2024-01-15' },
        { id: 3, name: 'Surgical Masks', category: 'Consumables', stock: 0, unit: 'Boxes', status: 'Out of Stock', lastRestocked: '2023-12-20' },
        { id: 4, name: 'Amoxicillin 250mg', category: 'Medicines', stock: 85, unit: 'Bottles', status: 'In Stock', lastRestocked: '2024-02-01' },
        { id: 5, name: 'Adrenaline Auto-injector', category: 'Emergency', stock: 5, unit: 'Pens', status: 'Low Stock', lastRestocked: '2023-11-10' },
        { id: 6, name: 'Disposable Gloves', category: 'Consumables', stock: 120, unit: 'Pairs', status: 'In Stock', lastRestocked: '2024-02-03' },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'In Stock': return 'bg-success/10 text-success border-success/20';
            case 'Low Stock': return 'bg-warning/10 text-warning border-warning/20';
            case 'Out of Stock': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'In Stock': return <CheckCircle2 size={14} />;
            case 'Low Stock': return <AlertTriangle size={14} />;
            case 'Out of Stock': return <XCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-32px font-bold text-text-primary tracking-tight">Inventory Management</h1>
                    <p className="text-text-tertiary text-15px mt-1 font-medium italic">Track and manage medical materials & supplies</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-12 text-14px font-bold text-text-secondary hover:bg-slate-50 transition-all shadow-sm">
                        <FileDown size={18} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20">
                        <Plus size={18} />
                        New Item
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Items', value: '1,248', icon: Package, color: 'primary', trend: '+12%', up: true },
                    { label: 'Low Stock', value: '14', icon: AlertTriangle, color: 'warning', trend: '-2', up: false },
                    { label: 'Out of Stock', value: '3', icon: XCircle, color: 'danger', trend: 'Stable', up: null },
                    { label: 'Recently Added', value: '28', icon: History, color: 'success', trend: '+5', up: true },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-20 border border-border/50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex items-center justify-between relative z-10">
                            <div className={`w-12 h-12 rounded-14 bg-${stat.color}/10 flex items-center justify-center text-${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            {stat.up !== null && (
                                <div className={`flex items-center gap-1 text-12px font-bold ${stat.up ? 'text-success' : 'text-danger'}`}>
                                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.trend}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 relative z-10">
                            <p className="text-14px font-bold text-text-tertiary uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-28px font-bold text-text-primary mt-1">{stat.value}</h3>
                        </div>
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}/5 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-24 border border-border shadow-sm overflow-hidden min-h-[500px]">
                {/* Internal Header/Filters */}
                <div className="p-6 border-b border-border bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder="Search materials, medicines..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-border rounded-12 text-14px outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-12 text-14px font-semibold text-text-secondary cursor-pointer hover:bg-slate-50 transition-all">
                            <Filter size={16} />
                            All Categories
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-12 text-14px font-semibold text-text-secondary cursor-pointer hover:bg-slate-50 transition-all">
                            Status: All
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-text-tertiary text-13px font-bold uppercase tracking-wider border-b border-border">
                                <th className="px-8 py-4">Item Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Restock</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {inventoryItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-10 bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <Package size={20} />
                                            </div>
                                            <span className="text-15px font-bold text-text-primary group-hover:text-primary transition-colors">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-12px font-bold">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-15px font-bold text-text-primary">{item.stock}</span>
                                            <span className="text-12px text-text-tertiary font-medium">{item.unit}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-12px font-bold ${getStatusStyle(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-14px text-text-secondary font-medium italic">
                                        {item.lastRestocked}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 hover:bg-slate-200 rounded-8 transition-colors text-text-tertiary">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer/Pagination Placeholder */}
                <div className="p-6 border-t border-border flex items-center justify-between bg-slate-50/30">
                    <p className="text-14px text-text-tertiary font-medium italic">Showing 6 of 1,248 items</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-border rounded-10 text-13px font-bold text-text-secondary hover:bg-slate-100 transition-all disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 bg-primary text-white rounded-10 text-13px font-bold hover:bg-primary-dark transition-all shadow-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
