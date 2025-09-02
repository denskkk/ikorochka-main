// Редактируйте этот массив — товары появятся в каталоге автоматически
export type Product = {
  id: string
  name: string
  category: 'caviar' | 'seafood' | 'ready'
  weight: string
  price: number // в гривнах
  img: string
  stock: string
  // Дополнительно: описание, может быть добавлено скриптом импорта из Telegram
  description?: string
}

import productsJson from '../../data/products.json'

// Может быть пустым (админ наполняет через /admin). Разрешённые категории: caviar, seafood, ready.
export const products: Product[] = (productsJson as Product[]).filter(p => ['caviar','seafood','ready'].includes(p.category))
