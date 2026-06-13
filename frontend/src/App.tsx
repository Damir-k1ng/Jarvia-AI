import { useJarvis } from './hooks/useJarvis';
import { OrbCanvas } from './components/OrbCanvas';

export default function App() {
  const { state, startListening, cancel, lastResponse } = useJarvis();

  const stateLabels = {
    idle: 'SYSTEM READY',
    listening: 'LISTENING...',
    thinking: 'PROCESSING...',
    speaking: 'RESPONDING...',
    error: 'ERROR',
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Corner HUD elements */}
      <div className="absolute top-4 left-4 text-[#00D4FF] font-mono text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse" />
          <span>JARVIS v1.2.5</span>
        </div>
        <div className="opacity-60">STATUS: {state.toUpperCase()}</div>
        <div className="opacity-60">MODE: DEMO</div>
      </div>

      <div className="absolute top-4 right-4 text-[#00D4FF] font-mono text-xs text-right space-y-1">
        <div className="opacity-60">LANG: RU</div>
        <div className="opacity-60">TTS: ACTIVE</div>
        <div className="opacity-60">STT: READY</div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-md z-10">
        <div className="aspect-square mb-8 relative">
          <OrbCanvas state={state} onClick={state === 'idle' ? startListening : cancel} />
          
          {/* Crosshair overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent opacity-30" />
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00D4FF] to-transparent opacity-30" />
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="relative">
            <p className="text-2xl font-display text-[#00D4FF] tracking-wider uppercase">
              {stateLabels[state]}
            </p>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent" />
          </div>
          
          {lastResponse && (
            <div className="mt-6 p-4 border border-[#00D4FF]/30 bg-[#00D4FF]/5 rounded backdrop-blur-sm">
              <p className="text-lg text-[#00FFFF] font-body leading-relaxed">
                {lastResponse}
              </p>
            </div>
          )}

          {state === 'idle' && !lastResponse && (
            <p className="text-sm text-[#00D4FF]/60 font-mono mt-4">
              Нажмите на реактор для активации
            </p>
          )}
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[#00D4FF] font-mono text-xs opacity-40">
        <div>STARK INDUSTRIES</div>
        <div>AI ASSISTANT</div>
      </div>
    </div>
  );
}
