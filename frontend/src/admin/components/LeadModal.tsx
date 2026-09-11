import React from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { type Lead } from '../types';

interface LeadModalProps {
  selectedLead: Lead | null;
  leadNotes: string;
  newNoteText: string;
  setNewNoteText: (text: string) => void;
  isAddingNote: boolean;
  setIsAddingNote: (adding: boolean) => void;
  isLeadModalOpen: boolean;
  setIsLeadModalOpen: (open: boolean) => void;
  handleUpdateLeadDetails: () => void;
  isUpdatingLead: boolean;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  selectedLead, leadNotes, newNoteText, setNewNoteText, isAddingNote, setIsAddingNote,
  isLeadModalOpen, setIsLeadModalOpen, handleUpdateLeadDetails, isUpdatingLead
}) => {
  if (!isLeadModalOpen || !selectedLead) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-black text-slate-800">Lead Details: {selectedLead.name}</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Manage notes and calls</p>
          </div>
          <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:bg-white hover:text-slate-700 p-2 rounded-sm transition-colors border border-transparent hover:border-slate-200 shadow-sm cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-sm border border-slate-100">
            <div><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</span><span className="font-semibold text-slate-700">{selectedLead.email}</span></div>
            <div><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</span><span className="font-semibold text-slate-700">{selectedLead.phone || 'N/A'}</span></div>
            <div><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company</span><span className="font-semibold text-slate-700">{selectedLead.company || 'N/A'}</span></div>
            <div><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role</span><span className="font-semibold text-slate-700">{selectedLead.role || 'N/A'}</span></div>
            <div className="col-span-2"><span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Message</span><span className="font-medium text-slate-600 whitespace-pre-wrap">{selectedLead.message || 'No message provided.'}</span></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black text-slate-800">Internal Notes History</h4>
              <button onClick={() => setIsAddingNote(!isAddingNote)} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-sm cursor-pointer transition-colors">
                <Plus className="w-3 h-3" /> Add Note
              </button>
            </div>
            {isAddingNote && (
              <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">New Note</label>
                <textarea value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} rows={3} placeholder="Type a new un-editable note here..." className="w-full border border-blue-200 rounded-sm p-3 text-sm font-medium focus:border-blue-500 outline-none bg-white shadow-sm"></textarea>
              </div>
            )}
            
            {leadNotes ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {leadNotes.replace(/\n\n\[/g, '|||[').split('|||').reverse().map((note, idx) => (
                  <div key={idx} className="w-full border border-slate-200 rounded-sm p-3 text-sm font-medium bg-slate-50 text-slate-700 whitespace-pre-wrap shadow-sm">
                    {note.trim()}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-400 italic">No previous notes.</p>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button onClick={() => setIsLeadModalOpen(false)} className="px-5 py-2.5 text-sm bg-slate-300 rounded-sm font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer">Cancel</button>
          <button onClick={handleUpdateLeadDetails} disabled={isUpdatingLead} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-70 cursor-pointer">
            {isUpdatingLead && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};
