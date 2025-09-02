# Икорочка – Next.js платформа (инициализация)

Этот каталог предназначен для постепенной миграции текущего статичного сайта на полнофункциональную e-commerce платформу (см. ТЗ).

## Архитектурное видение (v1→v2)

- v1 (MVP): SSR/SSG Next.js 14 (App Router), каталог из статического JSON, корзина (client state + localStorage), базовый checkout (mock), мультиязычность (i18n routing), критический UI.
- v1.1: живой поиск (edge route + in-memory index), вариативные SKU, фильтры (URL facets), аналитика (GA4 + dataLayer), microdata.
- v2: PostgreSQL + Prisma, Stripe/LiqPay, Server Actions для заказов, loyalty, CMS (например, Strapi), реферальные купоны.

## Пакеты (план)
- UI: Tailwind CSS + shadcn/ui + Framer Motion
- Форматирование: ESLint + Prettier
- Типы: TypeScript strict

## Следующие шаги
1. Инициализировать `package.json`, добавить зависимости.
2. Tailwind + базовый дизайн токены (цвет икры / золото / графит / фон). 
3. Скелет страниц: `/` (Hero video), `/catalog`, `/product/[slug]`, `/checkout`, `/account`, `/about`, `/delivery`, `/blog`, `/contacts`.
4. Фасетные фильтры: query-параметры => состояние.
5. Компоненты: Navigation (desktop + bottom dock mobile), ProductCard, ProductBadges, Price, AddToCart, FiltersPanel, SearchCommandPalette.
6. Сборка data-layer событий.

## KPI трекинг
Отдельный модуль `lib/web-vitals` — отправка LCP / INP / CLS на endpoint.

---
Этот файл будет расширяться по мере реализации.
