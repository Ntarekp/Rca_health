"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, Edit, Trash2, Check, X, AlertCircle, ArrowLeft } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface Term {
  termId?: number;
  termName: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCurrent: boolean;
  description?: string;
}

export default function TermManagementPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [formData, setFormData] = useState<Term>({
    termName: '',
    academicYear: new Date().getFullYear().toString(),
    startDate: '',
    endDate: '',
    isActive: true,
    isCurrent: false,
    description: ''
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await authenticatedFetch('/api/terms');
      if (response.ok) {
        const data = await response.json();
        setTerms(data);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTerm ? `/api/terms/${editingTerm.termId}` : '/api/terms';
      const method = editingTerm ? 'PUT' : 'POST';

      const response = await authenticatedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTerms();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving term:', error);
    }
  };

  const handleDelete = async (termId: number) => {
    if (!confirm(t('messages.confirm.delete'))) return;

    try {
      const response = await authenticatedFetch(`/api/terms/${termId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTerms();
      }
    } catch (error) {
      console.error('Error deleting term:', error);
    }
  };

  const handleSetCurrent = async (termId: number) => {
    try {
      const response = await authenticatedFetch(`/api/terms/${termId}/set-current`, {
        method: 'PUT',
      });

      if (response.ok) {
        await fetchTerms();
      }
    } catch (error) {
      console.error('Error setting current term:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      termName: '',
      academicYear: new Date().getFullYear().toString(),
      startDate: '',
      endDate: '',
      isActive: true,
      isCurrent: false,
      description: ''
    });
    setEditingTerm(null);
    setShowForm(false);
  };

  const startEdit = (term: Term) => {
    setEditingTerm(term);
    setFormData(term);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Calendar className="animate-pulse mx-auto text-primary" size={40} />
          <p className="text-14px font-medium text-slate-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-10 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          <span className="text-14px">{t('common.back')}</span>
        </button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-28px font-extrabold text-slate-900">{t('settings.termConfiguration')}</h1>
          <p className="text-14px text-slate-600 mt-1">{locale === 'en' ? 'Manage academic terms and reporting periods' : 'Gérer les trimestres académiques et les périodes de rapport'}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-colors shadow-sm"
        >
          <Plus size={18} />
          {t('settings.addTerm')}
        </button>
      </div>

      {/* Term Form */}
      {showForm && (
        <div className="bg-white border-2 border-slate-200 rounded-16 p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-20px font-extrabold text-slate-900">
              {editingTerm ? (locale === 'en' ? 'Edit Term' : 'Modifier le trimestre') : t('settings.addTerm')}
            </h2>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">
                  {t('settings.termName')}
                </label>
                <input
                  type="text"
                  value={formData.termName}
                  onChange={(e) => setFormData({ ...formData, termName: e.target.value })}
                  required
                  placeholder={locale === 'en' ? 'e.g., Term 1, First Semester' : 'ex: Trimestre 1, Premier semestre'}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">
                  {t('settings.academicYear')}
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                  placeholder={locale === 'en' ? 'e.g., 2024, 2024-2025' : 'ex: 2024, 2024-2025'}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">
                  {t('settings.termStart')}
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">
                  {t('settings.termEnd')}
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">
                {t('common.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder={locale === 'en' ? 'Optional description or notes about this term' : 'Description ou notes facultatives sur ce trimestre'}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-primary border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-14px font-bold text-slate-700">{locale === 'en' ? 'Active Term' : 'Trimestre actif'}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-5 h-5 text-primary border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-14px font-bold text-slate-700">{t('settings.currentTerm')}</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-slate-300 rounded-10 text-14px font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-10 text-14px font-bold hover:bg-primary-dark transition-colors shadow-sm"
              >
                {t('settings.saveTerm')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Terms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {terms.map((term) => (
          <div
            key={term.termId}
            className={`bg-white border-2 rounded-16 p-6 shadow-sm transition-all ${
              term.isCurrent
                ? 'border-primary shadow-primary/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-18px font-extrabold text-slate-900">{term.termName}</h3>
                <p className="text-12px text-slate-500 font-medium mt-1">{term.academicYear}</p>
              </div>
              <div className="flex gap-2">
                {term.isCurrent && (
                  <span className="px-2 py-1 bg-primary text-white text-9px font-bold rounded-full uppercase">
                    {locale === 'en' ? 'Current' : 'Actuel'}
                  </span>
                )}
                {term.isActive && !term.isCurrent && (
                  <span className="px-2 py-1 bg-success text-white text-9px font-bold rounded-full uppercase">
                    {locale === 'en' ? 'Active' : 'Actif'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-13px">
                <Calendar size={14} className="text-slate-400" />
                <span className="font-medium text-slate-600">
                  {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                </span>
              </div>
              {term.description && (
                <p className="text-12px text-slate-500 italic">{term.description}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              {!term.isCurrent && (
                <button
                  onClick={() => handleSetCurrent(term.termId!)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-8 text-11px font-bold hover:bg-primary/20 transition-colors"
                >
                  <Check size={14} />
                  {locale === 'en' ? 'Set Current' : 'Définir actuel'}
                </button>
              )}
              <button
                onClick={() => startEdit(term)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-8 text-11px font-bold hover:bg-slate-200 transition-colors"
              >
                <Edit size={14} />
                {t('common.edit')}
              </button>
              <button
                onClick={() => handleDelete(term.termId!)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-danger/10 text-danger rounded-8 text-11px font-bold hover:bg-danger/20 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {terms.length === 0 && !showForm && (
        <div className="text-center py-16">
          <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-16px font-bold text-slate-600 mb-2">{locale === 'en' ? 'No terms configured' : 'Aucun trimestre configuré'}</p>
          <p className="text-14px text-slate-500 mb-6">{locale === 'en' ? 'Create your first academic term to enable period-based reporting' : 'Créez votre premier trimestre académique pour activer les rapports par période'}</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Plus size={18} className="inline mr-2" />
            {t('settings.addTerm')}
          </button>
        </div>
      )}
    </div>
  );
}
