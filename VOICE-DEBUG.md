# 🎤 Отладка голосового ввода/вывода JARVIS

## Быстрая проверка

### 1. Откройте консоль браузера (F12)

### 2. Проверьте TTS (Text-to-Speech)
```javascript
// Проверка поддержки
console.log('TTS supported:', 'speechSynthesis' in window);

// Список доступных голосов
speechSynthesis.getVoices().forEach(v => 
  console.log(v.name, v.lang, v.localService ? '(local)' : '(remote)')
);

// Тест голоса
const utterance = new SpeechSynthesisUtterance('Привет, я Джарвис');
utterance.lang = 'ru-RU';
utterance.pitch = 0.8;
utterance.rate = 1.0;
speechSynthesis.speak(utterance);
```

### 3. Проверьте STT (Speech-to-Text)
```javascript
// Проверка поддержки
console.log('STT supported:', 'webkitSpeechRecognition' in window);

// Тест распознавания
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'ru-RU';
recognition.onresult = (e) => console.log('Распознано:', e.results[0][0].transcript);
recognition.onerror = (e) => console.error('Ошибка:', e.error);
recognition.start();
// Скажите что-нибудь в микрофон
```

## Типичные проблемы

### ❌ TTS не работает
**Симптомы:** Нет звука, но ошибок нет

**Решения:**
1. Проверьте громкость системы
2. Проверьте что голоса загружены:
   ```javascript
   // Подождите загрузки голосов
   speechSynthesis.onvoiceschanged = () => {
     console.log('Voices loaded:', speechSynthesis.getVoices().length);
   };
   ```
3. На iOS Safari: нужен user gesture (клик) перед первым TTS
4. Попробуйте другой браузер (Chrome обычно лучше)

### ❌ STT не работает
**Симптомы:** "PERMISSION_DENIED" или "NOT_SUPPORTED"

**Решения:**
1. **Разрешите доступ к микрофону** в настройках браузера
2. **HTTPS обязателен** (кроме localhost)
3. Проверьте что микрофон работает в других приложениях
4. На iOS Safari: STT работает только в Safari, не в Chrome
5. Попробуйте перезагрузить страницу

### ❌ STT распознаёт плохо
**Симптомы:** Неправильный текст или пустой результат

**Решения:**
1. Говорите **чётко и громко**
2. Уберите фоновый шум
3. Проверьте что выбран правильный микрофон (если их несколько)
4. Попробуйте короткие фразы (3-5 слов)
5. Подождите 1-2 секунды после начала записи перед речью

## Логи в консоли

При работе JARVIS вы должны видеть:

### При клике на Arc Reactor:
```
🎤 startListening called
🎤 Starting recognition...
🎤 Recognition started
```

### При распознавании речи:
```
📝 Recognition result event: [object]
✅ Transcript: запиши меня к терапевту
📊 Confidence: 0.95
🎤 Recognition ended
```

### При озвучивании ответа:
```
🔊 TTS speak called: Хорошо, записываю вас к терапевту...
🎙️ Available Russian voices: [...]
✅ Selected voice: Yuri
🎤 Calling speechSynthesis.speak()
▶️ TTS started
⏹️ TTS ended
```

## Demo Mode

Если голос совсем не работает, используйте **Demo Mode**:

1. Убедитесь что в `.env` есть:
   ```
   VITE_DEMO_MODE=true
   ```

2. В Demo Mode:
   - STT симулируется (случайная фраза через 1.5 сек)
   - TTS работает как обычно (если поддерживается)

## Браузеры

| Браузер | TTS | STT | Примечание |
|---------|-----|-----|------------|
| Chrome Desktop | ✅ | ✅ | Лучший выбор |
| Safari macOS | ✅ | ✅ | Голос Yuri отличный |
| Firefox Desktop | ✅ | ❌ | STT не поддерживается |
| Safari iOS | ✅ | ✅ | Только Safari, не Chrome |
| Chrome Android | ✅ | ✅ | Работает хорошо |

## Команды для тестирования

```bash
# Перезапустить frontend
cd ~/Desktop/jarvis/frontend
npm run dev

# Открыть в браузере
open http://localhost:5174

# Проверить логи backend (если нужен)
cd ~/Desktop/jarvis/backend
npm run dev
```

## Если ничего не помогает

1. Откройте консоль (F12)
2. Сделайте скриншот всех ошибок
3. Проверьте что:
   - Микрофон работает в других приложениях
   - Громкость не на нуле
   - Браузер имеет разрешение на микрофон
   - Используете HTTPS или localhost

4. Попробуйте в другом браузере (Chrome Desktop)
