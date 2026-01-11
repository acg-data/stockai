import type { AIInsight } from '../types';

interface AIInsightCardProps {
  insight: AIInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 shadow-sm">
      <p className="text-xs text-indigo-900 leading-relaxed font-medium">
        {insight.text}
      </p>
    </div>
  );
}