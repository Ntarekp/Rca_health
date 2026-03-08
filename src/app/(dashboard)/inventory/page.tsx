"use client";

import React, { useState, useEffect } from 'react';
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
    ArrowDownRight,
    Edit,
    Trash2,
    X
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8081/health/api/inventory';

const InventoryPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        category: '',
        stock: 0,
        unit: '',
        lastRestocked: new Date().toISOString().split('T')[0]
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            // Updated fetch call to use dynamic endpoint if needed
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                const mappedData = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    stock: item.stock,
                    unit: item.unit,
                    status: item.stock === 0 ? 'Out of Stock' : item.stock < 10 ? 'Low Stock' : 'In Stock',
                    lastRestocked: item.lastRestocked || new Date().toISOString().split('T')[0]
                }));
                setInventoryItems(mappedData);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stock' ? Number(value) : value
        }));
    };

    const handleOpenModal = (mode: 'create' | 'edit', item?: any) => {
        setModalMode(mode);
        if (mode === 'edit' && item) {
            setFormData({
                id: item.id,
                name: item.name,
                category: item.category,
                stock: item.stock,
                unit: item.unit,
                lastRestocked: item.lastRestocked
            });
        } else {
            setFormData({
                id: null,
                name: '',
                category: '',
                stock: 0,
                unit: '',
                lastRestocked: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            const url = modalMode === 'create' ? API_URL : `${API_URL}/${formData.id}`;
            const method = modalMode === 'create' ? 'POST' : 'PUT';

            const payload = {
                name: formData.name,
                category: formData.category,
                stock: formData.stock,
                unit: formData.unit,
                lastRestocked: formData.lastRestocked
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchInventory(); // Reload data
            } else {
                console.error(`Error ${modalMode}ing item`, await response.text());
            }
        } catch (error) {
            console.error(`Error ${modalMode}ing item:`, error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchInventory();
            } else {
                console.error('Error deleting item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

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

    const filteredItems = inventoryItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 relative">
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
                    <button 
                        onClick={() => handleOpenModal('create')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
                    >
                        <Plus size={18} />
                        New Item
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Items', value: inventoryItems.length.toString(), icon: Package, color: 'primary', trend: '+0%', up: true },
                    { label: 'Low Stock', value: inventoryItems.filter(i => i.status === 'Low Stock').length.toString(), icon: AlertTriangle, color: 'warning', trend: '0', up: false },
                    { label: 'Out of Stock', value: inventoryItems.filter(i => i.status === 'Out of Stock').length.toString(), icon: XCircle, color: 'danger', trend: 'Stable', up: null },
                    { label: 'Recently Added', value: '0', icon: History, color: 'success', trend: '+0', up: true },
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
                    {loading ? (
                        <div className="p-8 text-center text-text-tertiary">Loading inventory...</div>
                    ) : (
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
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-5 text-center text-text-tertiary">No inventory items found.</td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
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
                                                <div className="flex items-center justify-end gap-2 text-text-tertiary">
                                                    <button 
                                                        onClick={() => handleOpenModal('edit', item)}
                                                        className="p-2 hover:bg-slate-200 hover:text-primary rounded-8 transition-colors"
                                                        title="Edit Item"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 hover:bg-danger/10 hover:text-danger rounded-8 transition-colors"
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer/Pagination Placeholder */}
                <div className="p-6 border-t border-border flex items-center justify-between bg-slate-50/30">
                    <p className="text-14px text-text-tertiary font-medium italic">Showing {filteredItems.length} items</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-border rounded-10 text-13px font-bold text-text-secondary hover:bg-slate-100 transition-all disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 bg-primary text-white rounded-10 text-13px font-bold hover:bg-primary-dark transition-all shadow-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-24 w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-20px font-bold text-text-primary">
                                {modalMode === 'create' ? 'New Inventory Item' : 'Edit Inventory Item'}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-text-tertiary transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-13px font-bold text-text-secondary ml-1">Item Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-border rounded-12 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="e.g. Paracetamol"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-13px font-bold text-text-secondary ml-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-border rounded-12 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    <option value="" disabled>Select category...</option>
                                    <option value="Medicine">Medicine</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Consumable">Consumable</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-13px font-bold text-text-secondary ml-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-border rounded-12 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-13px font-bold text-text-secondary ml-1">Unit</label>
                                    <input
                                        type="text"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-border rounded-12 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. Tablets, Boxes"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-13px font-bold text-text-secondary ml-1">Last Restocked</label>
                                <input
                                    type="date"
                                    name="lastRestocked"
                                    value={formData.lastRestocked}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-border rounded-12 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-12 text-14px font-bold text-text-secondary hover:bg-slate-100 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-6 py-2.5 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                                >
                                    {actionLoading ? 'Saving...' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
