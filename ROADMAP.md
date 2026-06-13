# 🗺️ JARVIS Roadmap — От MVP к Production

## 📍 Текущее состояние (MVP для хакатона)

### Что работает сейчас:
✅ **Гибридный подход (Web Speech API + Demo Mode):**
- STT: Web Speech API (бесплатно, ru-RU и kk-KZ в Chrome)
- TTS: Web Speech Synthesis API (бесплатно, работает офлайн)
- Intent detection: Demo mode (мок-ответы)
- OCR: Demo mode (мок-текст)
- Tool calling: Моки для bookDoctor, callTaxi, readSign

### Преимущества для хакатона:
- ✅ Работает без API ключей
- ✅ Нулевые затраты
- ✅ Офлайн-частично
- ✅ Надёжно для демо
- ✅ Быстрый старт

### Ограничения:
- ❌ Качество TTS среднее (роботизированный)
- ❌ STT нестабилен на iOS
- ❌ Нет реального tool calling
- ❌ Нет реального OCR
- ❌ Латентность выше чем у нативных решений

---

## 🎯 Фаза 1: Хакатон (текущая)

**Цель:** Впечатлить жюри, показать концепцию

**Стек:**
```
Frontend: React + Vite + TypeScript
Voice: Web Speech API (STT + TTS)
AI: Demo mode (моки)
Design: Iron Man JARVIS style
```

**Что показать:**
1. Hands-free активация ("Джарвис")
2. Arc Reactor анимация
3. 3 сценария в demo mode
4. HUD интерфейс

**Питч для жюри:**
> "Мы используем гибридный подход: Web Speech API для MVP, но архитектура готова к миграции на Gemini Live API — один WebSocket закроет голос, зрение и tool calling сразу. KazLLM оставляем как локальный fallback для казахского — это сильный аргумент про 'казахстанский стек'."

---

## 🚀 Фаза 2: Production MVP (после хакатона)

**Цель:** Реальный продукт для первых пользователей

### Миграция на Gemini Live API

**Почему Gemini Live:**
1. **Нативно мультимодальный** — аудио, изображения, видео в одной модели
2. **Лучшая поддержка казахского** — критично для Казахстана
3. **Двунаправленный WebSocket** — низкая латентность
4. **Дешевле OpenAI Realtime** — важно для масштабирования
5. **Бесплатный tier** — для MVP идеально
6. **OCR встроен** — "Что написано на вывеске?" без отдельного Tesseract

### Архитектура с Gemini Live:

```typescript
// Один WebSocket для всего
const ws = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent');

// Голосовой цикл
microphone → PCM 16kHz → WebSocket → Gemini Live → 24kHz audio → speaker

// OCR сценарий
camera → JPEG frame → WebSocket → Gemini Live → text description → TTS

// Tool calling
user: "запиши к врачу" → Gemini Live → function call → bookDoctor() → response
```

### Что нужно сделать:

1. **Получить API ключ:**
   - https://aistudio.google.com/apikey
   - Для прода: ephemeral tokens (рекомендация Google)

2. **Создать Gemini Live клиент:**
   ```typescript
   // frontend/src/services/geminiLiveClient.ts
   - WebSocket connection
   - Audio streaming (PCM 16kHz)
   - Image streaming (JPEG)
   - Function declarations (bookDoctor, callTaxi, readSign)
   - Barge-in support (перебил — замолкает)
   ```

3. **Обновить hooks:**
   ```typescript
   // useSpeechInput.ts → useGeminiLive.ts
   - Заменить Web Speech API на WebSocket
   - Добавить audio streaming
   - Добавить image streaming
   ```

4. **Добавить реальные интеграции:**
   - DAMUMED API (если есть публичный)
   - Taxi API (Yandex.Taxi, inDriver)
   - Kaspi.kz для оплаты

### Стоимость (примерная):

```
Gemini Live API:
- Input audio: $0.000125 / 1000 chars
- Output audio: $0.000375 / 1000 chars
- Images: $0.00025 / image

Пример: 1000 пользователей × 10 запросов/день = ~$50/месяц
```

---

## 🌟 Фаза 3: Масштабирование

**Цель:** Полноценный продукт для массового рынка

### Дополнительные фичи:

1. **Мультиязычность:**
   - Русский ✅
   - Казахский ✅
   - Английский (добавить)
   - Автоопределение языка

2. **Расширенные сценарии:**
   - Навигация по городу (Google Maps API)
   - Умный дом (Yandex.Station, Google Home)
   - Чтение документов и книг
   - Распознавание лиц (для незрячих)
   - Описание окружения в реальном времени

3. **Монетизация:**
   - Freemium: базовые функции бесплатно
   - Premium: $5/месяц
     - Безлимитные запросы
     - Приоритетная поддержка
     - Интеграции с Kaspi, умным домом
     - Персональные настройки голоса

4. **Платформы:**
   - PWA (текущая) ✅
   - iOS нативное приложение
   - Android нативное приложение
   - Умные колонки (Yandex.Station)
   - Носимые устройства (Apple Watch)

---

## 🔄 Альтернативные варианты (если Gemini Live не подойдёт)

### Вариант A: GPT-Realtime-2 (OpenAI)
**Плюсы:**
- Рассуждения уровня GPT-5
- Tool calling прямо в разговоре
- Лучше для сложных многошаговых сценариев

**Минусы:**
- Дороже Gemini Live
- Казахский слабее
- Нет нативной поддержки изображений

**Когда использовать:** Если бюджет позволяет и нужны сложные рассуждения

### Вариант B: KazLLM + отдельные STT/TTS
**Плюсы:**
- Казахстанский стек (аргумент для инвесторов)
- Данные остаются в Казахстане
- Поддержка местного бизнеса

**Минусы:**
- Нужно интегрировать отдельно STT, TTS, OCR
- Выше латентность
- Дороже в разработке

**Когда использовать:** Для государственных контрактов, где важна локализация данных

### Вариант C: Гибрид (рекомендуется)
```
Primary: Gemini Live API (быстро, дёшево, качественно)
Fallback: KazLLM (для казахского, когда Gemini не справляется)
Offline: Web Speech API (когда нет интернета)
```

---

## 📊 Сравнение решений

| Критерий | Web Speech API | Gemini Live | GPT-Realtime-2 | KazLLM |
|----------|----------------|-------------|----------------|---------|
| Стоимость | Бесплатно | $$ | $$$ | $$ |
| Латентность | Средняя | Низкая | Низкая | Средняя |
| Казахский | Средне | Отлично | Слабо | Отлично |
| OCR | Нет | Да | Нет | Нет |
| Tool calling | Нет | Да | Да | Да |
| Офлайн | Да | Нет | Нет | Нет |
| Качество голоса | Среднее | Отличное | Отличное | Хорошее |

---

## 🎯 Рекомендации

### Для хакатона (сейчас):
✅ Оставь Web Speech API + Demo mode
✅ В питче упомяни план миграции на Gemini Live
✅ Покажи что архитектура готова к масштабированию

### После хакатона (Фаза 2):
1. Получи API ключ Gemini Live
2. Создай прототип с WebSocket
3. Протестируй на казахском языке
4. Сравни с текущим решением
5. Если лучше — мигрируй

### Для production (Фаза 3):
1. Гибридный подход: Gemini Live + KazLLM fallback
2. Добавь offline mode через Web Speech API
3. Мониторинг качества и латентности
4. A/B тестирование разных моделей

---

## 📝 Следующие шаги

- [ ] Выиграть хакатон 🏆
- [ ] Получить Gemini Live API ключ
- [ ] Создать прототип с WebSocket
- [ ] Протестировать на казахском
- [ ] Интегрировать DAMUMED API
- [ ] Добавить реальный taxi API
- [ ] Запустить beta для первых пользователей
- [ ] Собрать feedback
- [ ] Масштабировать

---

## 🔗 Полезные ссылки

- **Gemini Live API:** https://ai.google.dev/gemini-api/docs/live
- **API Key:** https://aistudio.google.com/apikey
- **WebSocket Guide:** https://ai.google.dev/gemini-api/docs/live#websockets
- **Function Calling:** https://ai.google.dev/gemini-api/docs/function-calling
- **Pricing:** https://ai.google.dev/pricing

---

**Вывод:** Текущее решение идеально для хакатона. Gemini Live — лучший выбор для production. Гибридный подход с KazLLM fallback — оптимальная стратегия для казахстанского рынка.
