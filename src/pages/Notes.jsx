import React, { useState, useEffect } from 'react';
import { noteService, semesterService } from '../services/entityServices';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/Pagination';
import { FileText, Plus, Search, Trash2, Edit, Download, X } from 'lucide-react';

export const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [name, setName] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();

  const fetchNotes = () => {
    setLoading(true);
    noteService.getAll({ page, limit: 10, search, semester_id: semesterFilter })
      .then((res) => {
        if (res.success) {
          setNotes(res.data);
          setPagination(res.pagination);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    semesterService.getAll().then((res) => {
      if (res.success) setSemesters(res.data);
    });
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [page, search, semesterFilter]);

  const openCreateModal = () => {
    setEditingNote(null);
    setName('');
    setSemesterId(semesters[0]?.id || '');
    setPdfFile(null);
    setThumbFile(null);
    setUploadProgress(0);
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setName(note.name);
    setSemesterId(note.semester.id);
    setPdfFile(null);
    setThumbFile(null);
    setUploadProgress(0);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !semesterId) {
      toast.error('Note name and semester are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('semester_id', semesterId);
    if (pdfFile) formData.append('pdf', pdfFile);
    if (thumbFile) formData.append('thumbnail', thumbFile);

    setSubmitting(true);
    setUploadProgress(0);
    try {
      if (editingNote) {
        const res = await noteService.update(editingNote.id, formData, (percent) => {
          setUploadProgress(percent);
        });
        if (res.success) {
          toast.success('Note updated successfully.');
          setModalOpen(false);
          fetchNotes();
        }
      } else {
        if (!pdfFile) {
          toast.error('PDF file is required for new note.');
          setSubmitting(false);
          return;
        }
        const res = await noteService.create(formData, (percent) => {
          setUploadProgress(percent);
        });
        if (res.success) {
          toast.success('Note uploaded successfully.');
          setModalOpen(false);
          fetchNotes();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await noteService.delete(id);
      if (res.success) {
        toast.success('Note deleted successfully.');
        fetchNotes();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete note.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Notes Management</h1>
          <p className="text-sm text-slate-400">Upload and manage subject lecture notes and PDFs</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={18} /> Upload Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search notes by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <select
          value={semesterFilter}
          onChange={(e) => { setSemesterFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
        >
          <option value="">All Semesters</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No notes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4">Note Title</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {notes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      {note.thumbnail ? (
                        <img
                          src={`https://api.kodeburner.com${note.thumbnail}`}
                          alt={note.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                          <FileText size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-slate-100">{note.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-xs font-medium">
                        {note.semester.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={note.uploaded_by.photo ? `https://api.kodeburner.com${note.uploaded_by.photo}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={note.uploaded_by.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-slate-300 text-xs font-medium">{note.uploaded_by.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(note.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://api.kodeburner.com${note.pdf}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors"
                          title="View PDF"
                        >
                          <Download size={16} />
                        </a>
                        <button
                          onClick={() => openEditModal(note)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">
                {editingNote ? 'Edit Note' : 'Upload Note'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Note Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Operating Systems Notes"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Semester
                </label>
                <select
                  value={semesterId}
                  onChange={(e) => setSemesterId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  PDF Document {!editingNote && <span className="text-orange-400">*</span>}
                </label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-500 cursor-pointer"
                />
                {pdfFile && (
                  <p className="mt-1.5 text-xs text-orange-400 font-medium flex items-center gap-1">
                    ✓ Selected: {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Thumbnail Cover Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => setThumbFile(e.target.files[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
                {thumbFile && (
                  <p className="mt-1.5 text-xs text-slate-300 font-medium flex items-center gap-1">
                    ✓ Selected: {thumbFile.name} ({(thumbFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* PDF Upload Progress Bar */}
              {submitting && (
                <div className="bg-slate-950/90 border border-orange-500/30 rounded-2xl p-4 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                      {uploadProgress < 100 ? 'Uploading PDF Document...' : 'Processing on Server...'}
                    </span>
                    <span className="text-orange-400 font-mono font-bold text-sm">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-orange-500/50"
                      style={{ width: `${Math.max(uploadProgress, 5)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {uploadProgress < 100 ? 'Uploading study material to cloud storage...' : 'Finalizing record & building download endpoints...'}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>{uploadProgress > 0 ? `Uploading (${uploadProgress}%)` : 'Saving...'}</span>
                    </>
                  ) : (
                    'Save Note'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
