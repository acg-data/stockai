import { ChevronDown } from 'lucide-react';
import type { FilterChip as FilterChipType } from '../types';

interface FilterChipsProps {
  filters: FilterChipType[];
  onFilterChange: (label: string, value: string) => void;
}

export function FilterChips({ filters, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter.label}
          className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 text-slate-600 shrink-0 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          onClick={() => onFilterChange(filter.label, filter.selected)}
        >
          {filter.label}: <span className="text-indigo-600 font-bold">{filter.selected}</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      ))}
      <button className="text-xs font-bold text-indigo-600 hover:underline px-2 whitespace-nowrap">
        + Add Filter
      </button>
    </div>
  );
}