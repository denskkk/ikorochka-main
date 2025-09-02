# Telegram Channel Import Plan

This document describes how we'll fetch posts from a Telegram channel and convert them into product cards (JSON entries in `data/products.json`).

## Approaches

1. **Telegram Bot API + Channel as Admin (Best)**
   - Add your bot as an admin (no messaging needed) to the public or private channel.
   - Use `getUpdates` won't return channel history. Instead use **Telegram MTProto** or a 3rd party scraper.
   - Bot API limitation: cannot read existing channel history unless messages are posted after bot joined AND are forwarded to the bot.

2. **MTProto Library (Full History)**
   - Use libraries: `gramjs` (Node), `telethon` (Python), `pyrogram` (Python).
   - Can iterate channel history, download media.

3. **Export from Telegram Desktop**
   - Telegram Desktop: Settings → Advanced → Export data → choose channel → media + messages (HTML / JSON) → parse locally.

## Recommended Fast Path

Use Telegram Desktop export first (instant, no coding) to bootstrap products; later implement automated sync with MTProto.

## Data Extraction Rules

We will parse message text patterns like:
```
Собираю Предзаказ на 29.08.
📌 Писташка с солью Премиум 1 кг - 770 грн за 1 кг
Продаём только в упаковке по 1 кг.
Доставка Бесплатная 🚚
```
Patterns to detect:
- Product name: text before first dash with weight maybe.
- Weight: detect number + (кг|г|гр|kg|g) or pattern like `1 кг`, `500 г`.
- Price: number before `грн` (strip spaces / punct).
- Category inference keywords: икра -> caviar; креветки/лосось/угорь/тріска -> seafood; сет/набор -> ready.

We'll store images by downloading message media into `public/assets/auto/<messageId>.<ext>`.

## Script Steps (Node + gramjs)
1. Install deps: `npm i telegram @gramjs/client @gramjs/methods @gramjs/tl` (or simpler: `npm i telegram` which includes gramjs).
2. ENV needed: `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_CHANNEL` (username or id), optional `TELEGRAM_SESSION` (persist auth string).
3. Authenticate once (interactive code). Store session string in `.env.local`.
4. Iterate messages (reverse chronological) until date threshold or already imported tag.
5. For each message with photo/caption:
   - Download best size photo.
   - Parse caption/text with regex list to extract fields.
   - Generate deterministic id: slugify(name)+messageId.
   - Skip if id already exists in `products.json`.
6. Append new product objects; write formatted JSON.

## Parsing Helpers
- Price: `/([0-9][0-9 .\-]{1,9})\s*грн/i` → normalize remove spaces/dots.
- Weight: `/([0-9.,]+)\s*(кг|г|гр|kg|g)/i`.
- Name: first line or part before price dash.

## Future Automation
- Add Next.js API route `/api/admin/sync-telegram` to trigger restricted sync (with token) on demand.
- Add CRON (GitHub Actions / external) calling that endpoint daily.

## Safety
- Rate limit API usage.
- Sanitize text (strip emojis except category icons if needed).
- Validate duplicates.

## Next Step
Implement `scripts/importFromTelegram.ts` using gramjs.
