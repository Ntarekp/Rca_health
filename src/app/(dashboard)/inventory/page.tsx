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
    X,
    ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { authenticatedFetch } from '@/utils/api';
const COMMON_UNITS = [
    'grams',
    'milligrams',
    'milliliters',
    'liters',
    'tablets',
    'capsules',
    'packets',
    'sachets',
    'bottles',
    'boxes',
    'pieces',
    'vials',
    'ampoules'
];

const getStockStatus = (stock: number, t: any) => {
    if (stock <= 0) return t('inventory.outOfStock');
    if (stock <= 5) return t('inventory.lowStock');
    if (stock <= 15) return t('inventory.watch');
    return t('inventory.inStock');
};

const InventoryPage = () => {
    const { t, locale } = useLanguage();
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
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
    const [stockTarget, setStockTarget] = useState<any | null>(null);
    const [stockMode, setStockMode] = useState<'in' | 'out'>('in');
    const [stockAmount, setStockAmount] = useState(1);
    const [stockLoading, setStockLoading] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            // Updated fetch call to use dynamic endpoint if needed
            const response = await authenticatedFetch('/api/inventory');
            if (response.ok) {
                const data = await response.json();
                const mappedData = data.map((item: any) => {
                    const stock = Number(item.stock ?? 0);

                    return {
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    stock,
                    unit: (item.unit || '').trim(),
                    status: getStockStatus(stock, t),
                    lastRestocked: item.lastRestocked || new Date().toISOString().split('T')[0]
                }});
                setInventoryItems(mappedData);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const openStockModal = (item: any, mode: 'in' | 'out') => {
        setStockTarget(item);
        setStockMode(mode);
        setStockAmount(1);
    };

    const handleStockAdjust = async () => {
        if (!stockTarget) return;

        const currentStock = Number(stockTarget.stock ?? 0);
        const amount = Number(stockAmount || 0);
        if (amount <= 0) return;

        if (stockMode === 'out' && amount > currentStock) {
            return;
        }

        const nextStock = stockMode === 'in' ? currentStock + amount : currentStock - amount;

        setStockLoading(true);
        try {
            const payload = {
                name: stockTarget.name,
                category: stockTarget.category,
                stock: nextStock,
                unit: stockTarget.unit,
                lastRestocked: new Date().toISOString().split('T')[0]
            };

            const response = await authenticatedFetch(`/api/inventory/${stockTarget.id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setStockTarget(null);
                fetchInventory();
            } else {
                console.error('Error updating stock', await response.text());
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        } finally {
            setStockLoading(false);
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
        setIsUnitDropdownOpen(false);
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

    const handleUnitSelect = (unit: string) => {
        setFormData(prev => ({
            ...prev,
            unit
        }));
        setIsUnitDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        if (!formData.unit.trim()) {
            setActionLoading(false);
            return;
        }

        try {
            const method = modalMode === 'create' ? 'POST' : 'PUT';

            const payload = {
                name: formData.name.trim(),
                category: formData.category,
                stock: formData.stock,
                unit: formData.unit.trim(),
                lastRestocked: formData.lastRestocked
            };

            const response = await authenticatedFetch(`/api/inventory${modalMode === 'create' ? '' : `/${formData.id}`}`, {
                method,
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

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);

        try {
            const response = await authenticatedFetch(`/api/inventory/${deleteTarget.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setDeleteTarget(null);
                fetchInventory();
            } else {
                console.error('Error deleting item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'In Stock': return 'bg-success/10 text-success border-success/20';
            case 'Low Stock': return 'bg-warning/10 text-warning border-warning/20';
            case 'Watch': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Out of Stock': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'In Stock': return <CheckCircle2 size={14} />;
            case 'Low Stock': return <AlertTriangle size={14} />;
            case 'Watch': return <AlertTriangle size={14} />;
            case 'Out of Stock': return <XCircle size={14} />;
            default: return null;
        }
    };

    const filteredUnitOptions = COMMON_UNITS.filter((unit) =>
        unit.toLowerCase().includes(formData.unit.toLowerCase())
    );

    const filteredItems = inventoryItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-7 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-32px font-extrabold text-slate-900 tracking-tight">{t('inventory.title')}</h1>
                    <p className="text-slate-500 text-15px mt-1.5 font-medium">{t('inventory.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-12 text-14px font-bold text-text-secondary hover:bg-slate-50 transition-all shadow-sm">
                        <FileDown size={18} />
                        {t('inventory.export')}
                    </button>
                    <button 
                        onClick={() => handleOpenModal('create')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
                    >
                        <Plus size={18} />
                        {t('inventory.newItem')}
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {[
                    { label: t('inventory.totalItems'), value: inventoryItems.length.toString(), icon: Package, color: 'primary', trend: '+0%', up: true },
                    { label: t('inventory.lowStock'), value: inventoryItems.filter(i => i.status === t('inventory.lowStock')).length.toString(), icon: AlertTriangle, color: 'warning', trend: '0', up: false },
                    { label: t('inventory.outOfStock'), value: inventoryItems.filter(i => i.status === t('inventory.outOfStock')).length.toString(), icon: XCircle, color: 'danger', trend: 'Stable', up: null },
                    { label: t('inventory.watchLevel'), value: inventoryItems.filter(i => i.status === t('inventory.watch')).length.toString(), icon: History, color: 'success', trend: '6-15', up: true },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-20 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
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
            <div className="bg-white rounded-24 border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                {/* Internal Header/Filters */}
                <div className="px-5 py-5 sm:px-6 sm:py-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('inventory.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-12 text-14px font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-12 text-14px font-semibold text-text-secondary cursor-pointer hover:bg-slate-50 transition-all">
                            <Filter size={16} />
                            {t('inventory.allCategories')}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-12 text-14px font-semibold text-text-secondary cursor-pointer hover:bg-slate-50 transition-all">
                            {t('inventory.statusAll')}
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
                                    <th className="px-6 py-4 text-left text-12px font-bold text-slate-600 uppercase tracking-wider">{t('inventory.itemDetails')}</th>
                                    <th className="px-6 py-4 text-left text-12px font-bold text-slate-600 uppercase tracking-wider">{t('inventory.category')}</th>
                                    <th className="px-6 py-4 text-left text-12px font-bold text-slate-600 uppercase tracking-wider">{t('inventory.currentStock')}</th>
                                    <th className="px-6 py-4 text-left text-12px font-bold text-slate-600 uppercase tracking-wider">{t('inventory.status')}</th>
                                    <th className="px-6 py-4 text-left text-12px font-bold text-slate-600 uppercase tracking-wider">{t('inventory.lastRestock')}</th>
                                    <th className="px-6 py-4 text-left text-12px font-bold text-slate-600 uppercase tracking-wider">{t('inventory.actions')}</th>
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
                                                    {item.status === 'Low Stock' && (
                                                        <span className="text-11px text-warning font-semibold mt-1">Small amount</span>
                                                    )}
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
                                                        onClick={() => openStockModal(item, 'in')}
                                                        className="px-3.5 py-2 text-12px font-bold rounded-10 bg-success/10 text-success hover:bg-success/15 transition-colors"
                                                        title="Stock In"
                                                    >
                                                        {t('inventory.stockIn')}
                                                    </button>
                                                    <button
                                                        onClick={() => openStockModal(item, 'out')}
                                                        className="px-3.5 py-2 text-12px font-bold rounded-10 bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                                                        title="Stock Out"
                                                    >
                                                        {t('inventory.stockOut')}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenModal('edit', item)}
                                                        className="p-2 hover:bg-slate-200 hover:text-primary rounded-8 transition-colors"
                                                        title="Edit Item"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
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
                    <div className="text-center text-14px text-slate-500 font-medium mt-6">
                        {t('inventory.showingItems', { count: filteredItems.length })}
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-border rounded-10 text-13px font-bold text-text-secondary hover:bg-slate-100 transition-all disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 bg-primary text-white rounded-10 text-13px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-24 w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border/60">
                        <div className="flex items-center justify-between px-7 py-6 border-b border-border/70">
                            <h2 className="text-20px font-bold text-text-primary">
                                {modalMode === 'create' ? t('inventory.modal.createTitle') : t('inventory.modal.editTitle')}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-text-tertiary transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-13px font-bold text-text-secondary ml-1">{t('inventory.modal.itemName')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50/60 border border-border/80 rounded-14 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder={t('inventory.modal.itemNamePlaceholder')}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-13px font-bold text-text-secondary ml-1">{t('inventory.modal.category')}</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50/60 border border-border/80 rounded-14 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    <option value="" disabled>{t('inventory.modal.selectCategory')}</option>
                                    <option value="Medicine">{t('inventory.medicine')}</option>
                                    <option value="Equipment">{t('inventory.equipment')}</option>
                                    <option value="Consumable">{t('inventory.supplies')}</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-13px font-bold text-text-secondary ml-1">{t('inventory.modal.stock')}</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="1"
                                        className="w-full px-4 py-3.5 bg-slate-50/60 border border-border/80 rounded-14 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-13px font-bold text-text-secondary ml-1">{t('inventory.modal.unit')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="unit"
                                            value={formData.unit}
                                            onFocus={() => setIsUnitDropdownOpen(true)}
                                            onBlur={() => setTimeout(() => setIsUnitDropdownOpen(false), 120)}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setIsUnitDropdownOpen(true);
                                            }}
                                            required
                                            className="w-full pl-4 pr-10 py-3.5 bg-slate-50/60 border border-border/80 rounded-14 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder={t('inventory.modal.unitPlaceholder')}
                                        />
                                        <button
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => setIsUnitDropdownOpen(prev => !prev)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-secondary"
                                            aria-label="Toggle units"
                                        >
                                            <ChevronDown size={16} />
                                        </button>

                                        {isUnitDropdownOpen && (
                                            <div className="absolute z-20 mt-2 w-full bg-white border border-border rounded-12 shadow-lg max-h-52 overflow-y-auto">
                                                {filteredUnitOptions.map((unit) => (
                                                        <button
                                                            key={unit}
                                                            type="button"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={() => handleUnitSelect(unit)}
                                                            className="w-full text-left px-4 py-2.5 text-14px text-text-secondary hover:bg-slate-50 transition-colors"
                                                        >
                                                            {unit}
                                                        </button>
                                                    ))}
                                                {filteredUnitOptions.length === 0 && (
                                                    <div className="px-4 py-3 text-13px text-text-tertiary">No matching unit. Keep typing to use a custom unit.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-13px font-bold text-text-secondary ml-1">{t('inventory.modal.lastRestocked')}</label>
                                <input
                                    type="date"
                                    name="lastRestocked"
                                    value={formData.lastRestocked}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50/60 border border-border/80 rounded-14 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            <div className="pt-5 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-3 rounded-12 text-14px font-bold text-text-secondary hover:bg-slate-100 transition-all font-medium"
                                >
                                    {t('inventory.modal.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-6 py-3 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                                >
                                    {actionLoading ? t('inventory.modal.saving') : t('inventory.modal.saveItem')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {stockTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-24 w-full max-w-md shadow-2xl overflow-hidden border border-border/60">
                        <div className="p-6 border-b border-border/70">
                            <h2 className="text-20px font-bold text-text-primary">
                                {stockMode === 'in' ? t('inventory.stockModal.stockInTitle') : t('inventory.stockModal.stockOutTitle')}
                            </h2>
                            <p className="text-14px text-text-tertiary mt-2">
                                {t('inventory.stockModal.adjustStock')} <span className="font-semibold text-text-secondary">{stockTarget.name}</span> ({stockTarget.unit}).
                            </p>
                            <p className="text-13px text-text-tertiary mt-1">
                                {t('inventory.stockModal.currentStock')} <span className="font-semibold text-text-secondary">{stockTarget.stock}</span>
                            </p>
                            <p className="text-13px text-text-tertiary mt-1">
                                {t('inventory.stockModal.afterUpdate')} {stockMode === 'in'
                                    ? Number(stockTarget.stock ?? 0) + Number(stockAmount || 0)
                                    : Math.max(0, Number(stockTarget.stock ?? 0) - Number(stockAmount || 0))}
                            </p>
                        </div>
                        <div className="p-6 space-y-3">
                            <label className="text-13px font-bold text-text-secondary ml-1">{t('inventory.stockModal.quantity')}</label>
                            <input
                                type="number"
                                min="1"
                                max={stockMode === 'out' ? Number(stockTarget.stock ?? 0) : undefined}
                                step="1"
                                value={stockAmount}
                                onChange={(e) => setStockAmount(Math.max(1, Number(e.target.value) || 1))}
                                className="w-full px-4 py-3.5 bg-slate-50/60 border border-border/80 rounded-14 text-14px focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {stockMode === 'out' && (
                                <p className="text-12px text-text-tertiary">{t('inventory.stockModal.maxRemovable')} {Number(stockTarget.stock ?? 0)}</p>
                            )}
                        </div>
                        <div className="p-6 pt-0 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setStockTarget(null)}
                                className="px-5 py-3 rounded-12 text-14px font-bold text-text-secondary hover:bg-slate-100 transition-all"
                            >
                                {t('inventory.modal.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleStockAdjust}
                                disabled={stockLoading || stockAmount < 1}
                                className={`px-6 py-3 text-white rounded-12 text-14px font-bold transition-all disabled:opacity-50 ${stockMode === 'in' ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'}`}
                            >
                                {stockLoading ? t('inventory.modal.saving') : stockMode === 'in' ? t('inventory.stockModal.confirmStockIn') : t('inventory.stockModal.confirmStockOut')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-24 w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-20px font-bold text-text-primary">{t('inventory.deleteModal.title')}</h2>
                            <p className="text-14px text-text-tertiary mt-2">
                                {t('inventory.deleteModal.message')} <span className="font-semibold text-text-secondary">{deleteTarget.name}</span>.
                                {t('inventory.deleteModal.warning')}
                            </p>
                        </div>
                        <div className="p-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="px-5 py-2.5 rounded-12 text-14px font-bold text-text-secondary hover:bg-slate-100 transition-all"
                            >
                                {t('inventory.deleteModal.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                                className="px-6 py-2.5 bg-danger text-white rounded-12 text-14px font-bold hover:bg-danger/90 transition-all disabled:opacity-50"
                            >
                                {deleteLoading ? t('inventory.deleteModal.deleting') : t('inventory.deleteModal.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
