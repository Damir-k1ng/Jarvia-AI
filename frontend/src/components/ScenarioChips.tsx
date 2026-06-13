interface ScenarioChipsProps {
  onSelect: (scenario: string) => void;
  disabled?: boolean;
}

const SCENARIOS = [
  { id: 'doctor', label: '🏥 Записаться к врачу', prompt: 'Запиши меня к терапевту' },
  { id: 'taxi', label: '🚕 Вызвать такси', prompt: 'Вызови такси домой' },
  { id: 'sign', label: '📷 Прочитать вывеску', prompt: 'Прочитай что на вывеске' },
];

export function ScenarioChips({ onSelect, disabled }: ScenarioChipsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {SCENARIOS.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario.prompt)}
          disabled={disabled}
          className="px-4 py-2 bg-surface hover:bg-gold/20 text-text rounded-full text-sm font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scenario.label}
        </button>
      ))}
    </div>
  );
}
