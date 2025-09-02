// Исходные данные ассортимента
const PRODUCTS = [
  {
    id: 'cav-premium-140',
    name: 'Икра лососевая премиум',
    weight: '140 г',
    price: 1950,
    category: 'caviar',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'в наличии'
  },
  {
    id: 'cav-premium-250',
    name: 'Икра лососевая премиум',
    weight: '250 г',
    price: 3150,
    category: 'caviar',
    img: 'https://images.unsplash.com/photo-1617346094048-5384a1ac04ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'в наличии'
  },
  {
    id: 'cav-standard-500',
    name: 'Икра лососевая классическая',
    weight: '500 г',
    price: 5790,
    category: 'caviar',
    img: 'https://images.unsplash.com/photo-1617194928231-8de491cfce5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'мало'
  },
  {
    id: 'cav-keta-200',
    name: 'Икра кеты крупная',
    weight: '200 г',
    price: 2590,
    category: 'caviar',
    img: 'https://images.unsplash.com/photo-1606949628303-8cea55cc16da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'в наличии'
  },
  {
    id: 'sf-scallop-500',
    name: 'Гребешок морской',
    weight: '500 г',
    price: 2490,
    category: 'seafood',
    img: 'https://images.unsplash.com/photo-1616436502424-3b1aa4c05648?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'в наличии'
  },
  {
    id: 'sf-shrimp-31-40',
    name: 'Креветка северная 31/40',
    weight: '1 кг',
    price: 1990,
    category: 'seafood',
    img: 'https://images.unsplash.com/photo-1559737558-2f5a35ab227e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'в наличии'
  },
  {
    id: 'sf-salmon-slice',
    name: 'Лосось слабосолёный слайсы',
    weight: '200 г',
    price: 890,
    category: 'seafood',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'мало'
  },
  {
    id: 'rd-rillettes-salmon',
    name: 'Рийет из лосося',
    weight: '160 г',
    price: 390,
    category: 'ready',
    img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'в наличии'
  },
  {
    id: 'rd-tartar-salmon',
    name: 'Тартар из лосося',
    weight: '150 г',
    price: 450,
    category: 'ready',
    img: 'https://images.unsplash.com/photo-1563379091339-03246963d25a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stock: 'в наличии'
  }
];
