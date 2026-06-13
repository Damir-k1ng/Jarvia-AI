# 🚀 Деплой JARVIS на Railway.com

## Шаг 1: Подготовка проекта

Проект уже подготовлен для деплоя на Railway.

**Созданные файлы:**
- `.gitignore` — исключает node_modules и .env
- `railway.json` — конфигурация Railway
- `Procfile` — команда запуска
- `package.json` (root) — скрипты для монорепо

## Шаг 2: Инициализация Git репозитория

```bash
cd ~/Desktop/jarvis
git init
git add .
git commit -m "Initial commit: JARVIS AI Assistant"
```

## Шаг 3: Создание проекта на Railway

### Вариант A: Через Railway CLI (рекомендуется)

1. Установите Railway CLI:
```bash
npm install -g @railway/cli
```

2. Войдите в аккаунт:
```bash
railway login
```

3. Создайте новый проект:
```bash
railway init
```

4. Задеплойте:
```bash
railway up
```

### Вариант B: Через веб-интерфейс Railway

1. Откройте https://railway.app/
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Подключите GitHub аккаунт
5. Создайте новый репозиторий или выберите существующий
6. Railway автоматически обнаружит проект и задеплоит

## Шаг 4: Настройка переменных окружения

В Railway Dashboard → Variables добавьте:

```env
NODE_ENV=production
PORT=3001
DEMO_MODE=true
FRONTEND_URL=https://your-frontend-url.railway.app
```

## Шаг 5: Деплой Frontend отдельно

Frontend нужно задеплоить отдельно (например, на Vercel или Netlify).

### Vercel (рекомендуется для frontend):

1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. Перейдите в папку frontend:
```bash
cd frontend
```

3. Задеплойте:
```bash
vercel
```

4. Обновите переменные окружения в Vercel:
```env
VITE_DEMO_MODE=true
VITE_API_URL=https://your-backend-url.railway.app
```

## Шаг 6: Обновление CORS

После деплоя обновите CORS в backend для разрешения запросов с frontend URL.

## Альтернатива: Деплой как монолит

Можно задеплоить frontend и backend вместе:

1. Соберите frontend:
```bash
cd frontend && npm run build
```

2. Скопируйте dist в backend/public:
```bash
cp -r dist ../backend/public
```

3. Обновите backend/src/index.ts для раздачи статики
4. Задеплойте только backend на Railway

## Проверка деплоя

После деплоя проверьте:
- Backend health: `https://your-app.railway.app/api/health`
- Frontend: `https://your-frontend-url.vercel.app`

---

**Готово!** JARVIS теперь доступен онлайн 🚀
