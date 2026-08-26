import React, { useState, useEffect } from 'react';
import { semesterService } from '../services/entityServices';
import { getAssetUrl } from '../services/api';
import { useToast } from '../context/ToastContext';
import { FolderTree, Plus, Trash2, Edit, X, FileText, BookOpen } from 'lucide-react';

export const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [name, setName] = useState('');
  const [thumbFile, setThumbFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const fetchSemesters = () => {
    setLoading(true);
    semesterService.getAll()
      .then((res) => {
        if (res.success) setSemesters(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const openCreateModal = () => {
    setEditingSemester(null);
    setName('');
    setThumbFile(null);
    setModalOpen(true);
  };

  const openEditModal = (sem) => {
    setEditingSemester(sem);
    setName(sem.name);
    setThumbFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Semester name is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (thumbFile) formData.append('thumbnail', thumbFile);

    setSubmitting(true);
    try {
      if (editingSemester) {
        const res = await semesterService.update(editingSemester.id, formData);
        if (res.success) {
          toast.success('Semester updated successfully.');
          setModalOpen(false);
          fetchSemesters();
        }
      } else {
        const res = await semesterService.create(formData);
        if (res.success) {
          toast.success('Semester created successfully.');
          setModalOpen(false);
          fetchSemesters();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this semester?')) return;
    try {
      const res = await semesterService.delete(id);
      if (res.success) {
        toast.success('Semester deleted successfully.');
        fetchSemesters();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete semester.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Semester Management</h1>
          <p className="text-sm text-slate-400">Manage academic semester categories for resources</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={18} /> Add Semester
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading semesters...</div>
      ) : semesters.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
          No semesters configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {semesters.map((sem) => (
            <div key={sem.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {sem.thumbnail ? (
                      <img
                        src={getAssetUrl(sem.thumbnail)}
                        alt={sem.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                        <FolderTree size={22} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">{sem.name}</h3>
                      <span className="text-xs text-slate-500">ID #{sem.id}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                    <p className="text-xs text-slate-500 font-medium">Notes</p>
                    <p className="text-lg font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <FileText size={16} className="text-indigo-400" /> {sem.notes_count || 0}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                    <p className="text-xs text-slate-500 font-medium">Books</p>
                    <p className="text-lg font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <BookOpen size={16} className="text-purple-400" /> {sem.books_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => openEditModal(sem)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(sem.id)}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">
                {editingSemester ? 'Edit Semester' : 'Add Semester'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Semester Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Semester 1"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Thumbnail Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Semester'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
