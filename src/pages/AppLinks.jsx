import React, { useState, useEffect } from 'react';
import { appLinkService } from '../services/entityServices';
import { getAssetUrl } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/Pagination';
import {
  Link2,
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  X,
  Star,
  Grid,
  Shield,
  Share2,
  Globe,
  Send,
  PlayCircle,
  Mail,
  MessageSquare,
  Info,
  BookOpen,
  Heart,
  HelpCircle,
  Code,
  Users,
  Camera,
  MessageCircle,
  Briefcase,
  ShoppingCart,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Settings,
  Headphones,
  Bell
} from 'lucide-react';

const PRESET_ICONS = [
  { key: 'star', label: 'Star / Rate', icon: Star, color: 'text-amber-400 bg-amber-500/10' },
  { key: 'apps', label: 'Apps / Store', icon: Grid, color: 'text-orange-400 bg-orange-500/10' },
  { key: 'shield', label: 'Shield / Privacy', icon: Shield, color: 'text-emerald-400 bg-emerald-500/10' },
  { key: 'telegram', label: 'Telegram', icon: Send, color: 'text-sky-400 bg-sky-500/10' },
  { key: 'youtube', label: 'YouTube / Video', icon: PlayCircle, color: 'text-rose-400 bg-rose-500/10' },
  { key: 'facebook', label: 'Facebook', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
  { key: 'instagram', label: 'Instagram', icon: Camera, color: 'text-pink-500 bg-pink-500/10' },
  { key: 'twitter', label: 'Twitter / X', icon: MessageCircle, color: 'text-sky-400 bg-sky-400/10' },
  { key: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: 'text-blue-600 bg-blue-600/10' },
  { key: 'github', label: 'GitHub / Code', icon: Code, color: 'text-slate-300 bg-slate-500/10' },
  { key: 'globe', label: 'Website / Web', icon: Globe, color: 'text-blue-400 bg-blue-500/10' },
  { key: 'share', label: 'Share', icon: Share2, color: 'text-purple-400 bg-purple-500/10' },
  { key: 'mail', label: 'Email / Contact', icon: Mail, color: 'text-indigo-400 bg-indigo-500/10' },
  { key: 'discord', label: 'Discord', icon: MessageSquare, color: 'text-indigo-400 bg-indigo-500/10' },
  { key: 'chat', label: 'Chat / Support', icon: MessageSquare, color: 'text-sky-400 bg-sky-500/10' },
  { key: 'info', label: 'About / Info', icon: Info, color: 'text-cyan-400 bg-cyan-500/10' },
  { key: 'book', label: 'Academic', icon: BookOpen, color: 'text-amber-400 bg-amber-500/10' },
  { key: 'heart', label: 'Donate / Love', icon: Heart, color: 'text-pink-400 bg-pink-500/10' },
  { key: 'help', label: 'Help / Support', icon: HelpCircle, color: 'text-teal-400 bg-teal-500/10' },
  { key: 'shopping', label: 'Store / Shop', icon: ShoppingCart, color: 'text-orange-500 bg-orange-500/10' },
  { key: 'location', label: 'Location / Map', icon: MapPin, color: 'text-red-500 bg-red-500/10' },
  { key: 'phone', label: 'Phone / Call', icon: Phone, color: 'text-emerald-500 bg-emerald-500/10' },
  { key: 'calendar', label: 'Events / Date', icon: Calendar, color: 'text-violet-500 bg-violet-500/10' },
  { key: 'file', label: 'Document / File', icon: FileText, color: 'text-slate-400 bg-slate-500/10' },
  { key: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-500 bg-slate-600/10' },
  { key: 'headset', label: 'Live Support', icon: Headphones, color: 'text-cyan-500 bg-cyan-500/10' },
  { key: 'bell', label: 'Notifications', icon: Bell, color: 'text-amber-500 bg-amber-500/10' },
];

export const AppLinks = () => {
  const [links, setLinks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('more');
  const [selectedIcon, setSelectedIcon] = useState('globe');
  const [iconFile, setIconFile] = useState(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const fetchLinks = () => {
    setLoading(true);
    appLinkService.getAdminAll({ page, limit: 20, search, category: categoryFilter })
      .then((res) => {
        if (res.success) {
          setLinks(res.data);
          setPagination(res.pagination);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLinks();
  }, [page, search, categoryFilter]);

  const openCreateModal = () => {
    setEditingLink(null);
    setTitle('');
    setSubtitle('');
    setUrl('');
    setCategory('more');
    setSelectedIcon('globe');
    setIconFile(null);
    setSortOrder(links.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingLink(item);
    setTitle(item.title);
    setSubtitle(item.subtitle || '');
    setUrl(item.url);
    setCategory(item.category);
    setSelectedIcon(item.icon || 'globe');
    setIconFile(null);
    setSortOrder(item.sort_order || 0);
    setIsActive(item.is_active);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error('Link title and target URL are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    if (subtitle.trim()) formData.append('subtitle', subtitle.trim());
    formData.append('url', url.trim());
    formData.append('category', category);
    formData.append('icon', selectedIcon);
    formData.append('sort_order', sortOrder);
    formData.append('is_active', isActive ? 1 : 0);
    if (iconFile) formData.append('icon_file', iconFile);

    setSubmitting(true);
    try {
      if (editingLink) {
        const res = await appLinkService.update(editingLink.id, formData);
        if (res.success) {
          toast.success('Link updated successfully.');
          setModalOpen(false);
          fetchLinks();
        }
      } else {
        const res = await appLinkService.create(formData);
        if (res.success) {
          toast.success('Link created successfully.');
          setModalOpen(false);
          fetchLinks();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save link.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (item) => {
    setLinkToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;
    try {
      const res = await appLinkService.delete(linkToDelete.id);
      if (res.success) {
        toast.success('Link removed successfully.');
        setDeleteModalOpen(false);
        setLinkToDelete(null);
        fetchLinks();
      }
    } catch (err) {
      toast.error('Failed to delete link.');
    }
  };

  const renderIconPreview = (iconStr, size = 18) => {
    if (iconStr && (iconStr.startsWith('http://') || iconStr.startsWith('https://') || iconStr.startsWith('/uploads/'))) {
      const src = getAssetUrl(iconStr);
      return <img src={src} alt="icon" className="w-5 h-5 rounded object-cover" />;
    }
    const preset = PRESET_ICONS.find(p => p.key === iconStr) || PRESET_ICONS[5];
    const IconComp = preset.icon;
    return <IconComp size={size} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Link2 className="text-rose-500" size={26} /> App & Community Links
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage dynamic "More & About" links, social channels, legal policies, and developer resources displayed in the mobile app.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm shadow-lg shadow-rose-600/25 transition-all duration-200"
        >
          <Plus size={18} /> Add New Link
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
          {[
            { id: 'all', label: 'All Links' },
            { id: 'more', label: 'More Section' },
            { id: 'about', label: 'About Section' },
            { id: 'community', label: 'Community' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setCategoryFilter(tab.id); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3.5 px-4 w-12 text-center">Order</th>
                <th className="py-3.5 px-4">Link Title & Subtitle</th>
                <th className="py-3.5 px-4">Target URL</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-rose-500 border-t-transparent"></div>
                    <p className="mt-2 text-xs font-medium">Loading links...</p>
                  </td>
                </tr>
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Link2 size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-medium">No links found</p>
                    <p className="text-xs text-slate-600 mt-1">Create your first dynamic mobile app link above</p>
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 text-xs font-bold text-slate-400">
                        {link.sort_order}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-rose-400 shrink-0">
                          {renderIconPreview(link.icon)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-100 truncate">{link.title}</p>
                          {link.subtitle && (
                            <p className="text-xs text-slate-400 truncate">{link.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline max-w-full truncate"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink size={12} className="shrink-0" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700/60">
                        {link.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          link.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-500 border border-slate-700/40'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${link.is_active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        {link.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(link)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit Link"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => confirmDelete(link)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Link"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="p-4 border-t border-slate-800">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-lg">
                {editingLink ? 'Edit Link' : 'Create New App Link'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Link Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rate on Google Play"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subtitle / Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave a 5-star review to support us"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Target URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Link / URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://play.google.com/... or https://t.me/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Category & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500 transition-colors"
                  >
                    <option value="more">More Section</option>
                    <option value="about">About Section</option>
                    <option value="community">Community / Social</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              {/* Preset Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Preset Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {PRESET_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedIcon === item.key;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => setSelectedIcon(item.key)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-rose-600/20 border-rose-500 text-rose-400 shadow-md shadow-rose-600/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                        title={item.label}
                      >
                        <IconComp size={20} />
                        <span className="text-[10px] mt-1 truncate max-w-full font-medium">{item.key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or Custom Icon Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Or Upload Custom Icon Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIconFile(e.target.files[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 bg-slate-950 border-slate-800 focus:ring-rose-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Active (Visible on Mobile App)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingLink ? 'Save Changes' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-100 text-base">Delete Link</h3>
              <p className="text-slate-400 text-xs mt-1.5">
                Are you sure you want to delete <span className="text-slate-200 font-semibold">"{linkToDelete?.title}"</span>? This will remove it from the mobile app.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium shadow-lg shadow-rose-600/25 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
