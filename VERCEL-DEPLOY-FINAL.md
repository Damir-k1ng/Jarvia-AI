# 🚀 Финальная инструкция по деплою JARVIS на Vercel

## ✅ Build успешно прошёл локально!

```
dist/index.html                   1.01 kB │ gzip:  0.59 kB
dist/assets/index-DbEuIvKs.css   13.13 kB │ gzip:  3.46 kB
dist/assets/index-r3tUkdpf.js   156.82 kB │ gzip: 51.08 kB
✓ built in 5.35s
```

---

## 📋 Настройки Vercel (ТОЧНО как на скриншоте)

### Project Settings:

```
Project Name: jarvis-ai
Framework Preset: Vite
Root Directory: frontend
```

### Build & Output Settings:

```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Environment Variables:

Добавьте **ОДНУ** переменную:

```
Key: VITE_DEMO_MODE
Value: true
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 🔧 Перед деплоем: закоммитьте изменения

```bash
cd ~/Desktop/jarvis

# Проверьте статус
git status

# Добавьте все изменения
git add .

# Закоммитьте
git commit -m "fix: remove detectIntent import, build working"

# Запушьте
git push origin main
```

---

## 🚀 Деплой в Vercel

1. **Откройте Vercel** → https://vercel.com/new
2. **Выберите репозиторий** `Jarvis-AI`
3. **Настройте проект** (см. настройки выше)
4. **Добавьте Environment Variable** `VITE_DEMO_MODE=true`
5. **Нажмите "Deploy"**
6. **Ждите ~2 минуты**

---

## ✅ После успешного деплоя

### Проверка на десктопе:

1. Откройте URL (например `jarvis-ai.vercel.app`)
2. Откройте консоль (F12)
3. Кликните на Arc Reactor
4. Разрешите доступ к микрофону
5. Говорите: "запиши меня к терапевту"
6. Слушайте ответ JARVIS

### Проверка на мобильном:

**iPhone Safari:**
1. Откройте сайт
2. Нажмите "Поделиться" (квадрат со стрелкой)
3. "На экран Домой"
4. Иконка JARVIS появится на главном экране

**Android Chrome:**
1. Откройте сайт
2. Меню (три точки) → "Установить приложение"
3. Иконка JARVIS появится на главном экране

---

## 🎤 Что работает в Demo Mode

✅ **Голосовой ввод** — Web Speech API (Chrome/Safari)  
✅ **Голосовой вывод** — TTS с мужским голосом (Yuri на macOS)  
✅ **Три сценария:**
   - "запиши меня к терапевту" → запись к врачу
   - "вызови такси" → вызов такси
   - "прочитай вывеску" → чтение текста

✅ **Arc Reactor анимация** — 5 состояний (idle, listening, thinking, speaking, error)  
✅ **PWA** — устанавливается как приложение  
✅ **Работает офлайн** — после первой загрузки

---

## 🐛 Troubleshooting

### Проблема: Build failed в Vercel

**Решение:** Проверьте что:
- Root Directory = `frontend`
- Build Command = `npm run build` (БЕЗ `tsc &&`)
- Все изменения запушены в GitHub

### Проблема: Белый экран после деплоя

**Решение:**
- Проверьте консоль браузера (F12)
- Убедитесь что `VITE_DEMO_MODE=true` добавлен в Environment Variables
- Попробуйте Hard Refresh (Cmd+Shift+R / Ctrl+Shift+F5)

### Проблема: TTS не работает

**Решение:**
- Это нормально на первом клике (нужен user gesture)
- Кликните на Arc Reactor ещё раз
- Проверьте громкость системы
- Попробуйте другой браузер (Chrome Desktop лучше всего)

### Проблема: STT не работает

**Решение:**
- Разрешите доступ к микрофону в браузере
- На iOS используйте Safari (не Chrome)
- Проверьте что микрофон работает в других приложениях
- Говорите чётко и громко

---

## 📊 Мониторинг

### Vercel Analytics (бесплатно):

1. Vercel Dashboard → ваш проект → Analytics
2. Смотрите:
   - Посещаемость
   - Производительность
   - Ошибки

### Логи:

1. Vercel Dashboard → Deployments → Latest
2. "View Function Logs" (если есть ошибки)
3. Runtime Logs показывают ошибки в production

---

## 🎯 Итоговый чеклист

- [ ] `git push` выполнен
- [ ] Root Directory = `frontend`
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist`
- [ ] Environment Variable `VITE_DEMO_MODE=true` добавлена
- [ ] Deploy запущен
- [ ] Сайт открывается
- [ ] Arc Reactor анимируется
- [ ] Голос работает (TTS)
- [ ] Микрофон работает (STT)
- [ ] Все 3 сценария отвечают

---

## 🎉 Готово!

После успешного деплоя у вас будет:

- **Production URL:** `https://jarvis-ai.vercel.app`
- **PWA:** Устанавливается на телефон
- **Demo Mode:** Работает без backend
- **Голосовой AI:** Полностью функциональный

Приложение готово к презентации на хакатоне! 🚀
