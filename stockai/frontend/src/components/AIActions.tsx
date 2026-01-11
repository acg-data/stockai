import { ArrowRight } from 'lucide-react';

interface AIActionsProps {
  actions: Array<{
    id: string;
    icon: string;
    label: string;
  }>;
  onActionClick: (id: string) => void;
}

export function AIActions({ actions, onActionClick }: AIActionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
        AI Action Screeners
      </p>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.id)}
          className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-indigo-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          {action.icon} {action.label}
          <ArrowRight className="w-3 h-3 text-indigo-400" />
        </button>
      ))}
    </div>
  );
}