import type { JarvisState } from '../types';

interface StatusLabelProps {
  state: JarvisState;
}

const STATUS_TEXT: Record<JarvisState, string> = {
  idle: 'Нажмите чтобы начать',
  listening: 'Слушаю...',
  thinking: 'Думаю...',
  speaking: 'Говорю...',
  error: 'Ошибка',
};

const STATUS_COLORS: Record<JarvisState, string> = {
  idle: 'text-gold',
  listening: 'text-gold-3',
  thinking: 'text-blue',
  speaking: 'text-green',
  error: 'text-red-500',
};

export function StatusLabel({ state }: StatusLabelProps) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-display ${STATUS_COLORS[state]} transition-colors`}>
        {STATUS_TEXT[state]}
      </p>
    </div>
  );
}
