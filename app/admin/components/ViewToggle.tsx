import { Icon } from '@iconify/react';

type ViewMode = 'kanban' | 'list' | 'cards';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
      <button
        onClick={() => onViewModeChange('kanban')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          viewMode === 'kanban'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Icon icon="solar:widget-5-linear" width="16" className="inline mr-1" />
        Kanban
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          viewMode === 'list'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Icon icon="solar:list-linear" width="16" className="inline mr-1" />
        Lista
      </button>
      <button
        onClick={() => onViewModeChange('cards')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          viewMode === 'cards'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Icon icon="solar:widget-2-linear" width="16" className="inline mr-1" />
        Cards
      </button>
    </div>
  );
}
