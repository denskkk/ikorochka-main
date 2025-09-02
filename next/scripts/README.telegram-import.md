# Telegram Product Import Scripts

Two files were added:
- `telegramImport.md` – high-level plan and approaches.
- `importFromTelegram.ts` – MTProto (gramjs) based importer script.

## Install Dependencies
Run:
```
npm install telegram
```
(Type definitions ship within the package; if TypeScript complains you can add a `declare module 'telegram'` shim.)

If you prefer ESM only, ensure `"type": "module"` in package.json (already the case with Next.js) or adjust imports.

## Obtain API Credentials
1. Go to https://my.telegram.org → API Development Tools.
2. Create an application, copy `api_id` and `api_hash`.
3. Add these to `.env.local` (never commit real values):
```
TELEGRAM_API_ID=1234567
TELEGRAM_API_HASH=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Either username (without @) OR numeric id (starts with -100 for supergroups/channels)
TELEGRAM_CHANNEL=your_channel_username_without_at
# Optional alternative if you know the numeric id
TELEGRAM_CHAT_ID=-1001234567890
# Session string appears after first auth (keep secret!)
TELEGRAM_SESSION=
```
Security: If api hash or session ever leaks, revoke and regenerate at my.telegram.org.

## First Run To Get Session
Temporarily modify the `client.start` section to allow interactive login or create a quick helper script; or run in REPL. Faster (manual) path: use a separate JS snippet that prints `client.session.save()` after code login, then place it into `TELEGRAM_SESSION`.

Example (your provided chat id): `TELEGRAM_CHAT_ID=-1002405422465`

## Usage
```
npx ts-node next/scripts/importFromTelegram.ts --limit 300 --since 2025-08-01
```
Options:
- `--limit` max messages to scan (default 100)
- `--since` ISO date; stop when older

## Output
New products appended into `data/products.json` and images downloaded into `public/assets/auto/`.

## Idempotency & Safety
- Skips products whose generated id already exists.
- Will not overwrite existing items; remove manually if you want to regenerate.
- Stores images under `public/assets/auto/` — you can optimize/compress later.

## Next Improvements
- Map multiple prices / weight variants.
- Detect currency and normalize.
- Admin API route to trigger sync via secure token.
- Web UI button (protected) to run sync and show log.
- Auto-generate Product schema (JSON-LD) after import.
