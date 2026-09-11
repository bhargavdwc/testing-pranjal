export const STATUS_CONFIG = {
  NEW: { label: 'New Lead', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '🔵' },
  QUALIFIED: { label: 'Qualified', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡' },
  NOT_QUALIFIED: { label: 'Not Qualified', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', icon: '⚪' },
  OPPORTUNITY: { label: 'Opportunity', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🟢' },
  CONVERTED: { label: 'Converted', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: '🟣' },
};

export const VALID_TRANSITIONS: Record<string, string[]> = {
  NEW: ['QUALIFIED', 'NOT_QUALIFIED'],
  QUALIFIED: ['OPPORTUNITY', 'NOT_QUALIFIED'],
  OPPORTUNITY: ['CONVERTED', 'NOT_QUALIFIED'],
  NOT_QUALIFIED: ['NEW', 'QUALIFIED'],
  CONVERTED: ['NEW'], // Allow re-opening to starting stage (New Lead)
};

