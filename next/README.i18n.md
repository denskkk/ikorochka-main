Добавил поддержку двух языков: `uk` (по умолчанию) и `ru`.

Что сделано:
- Обновлён `next.config.mjs` с настройкой i18n.
- Добавлены файлы переводов в `public/locales/uk/common.json` и `public/locales/ru/common.json`.
- Простая утилита `app/utils/translate.ts` для загрузки сообщений на сервере.
- `LocaleSwitcher` компонент для переключения языка (в шапке).
- Header и Footer обновлены для использования переводов.
- Добавлен API-роут `app/api/notify/route.ts` — отправляет POST-заявки в Telegram.

Как настроить Telegram уведомления:
- В корне `next` добавьте `.env.local` с переменными:

  TELEGRAM_BOT_TOKEN=123456:ABC-DEF
  TELEGRAM_CHAT_ID=-1001234567890

- Отправлять заявку с фронтенда на `/api/notify` методом POST с JSON: { name, phone, note }

Примечание: реализована минимальная i18n-логика без интеграции с React Intl или next-translate — файлы лежат в `public/locales` и подгружаются синхронно на сервере.
