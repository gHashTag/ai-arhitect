export interface Product {
  id: string;
  name: string;
  description: string;
  dimensions: string;
  concreteUsage?: string;
  packSize?: string;
  weight?: string;
  usage: string[];
  characteristics: string[];
  category: 'foundation' | 'wall' | 'special';
  pdfLink?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'p6-20',
    name: 'P6-20 Foundation Block',
    description: 'Основной блок для фундаментов 20 см',
    dimensions: '498×198×250 мм',
    concreteUsage: '0.015 м³/блок',
    packSize: '50 шт/паллета',
    usage: [
      'Ленточные фундаменты',
      'Ростверки на сваях', 
      'Подпорные стены',
      'Перемычки'
    ],
    characteristics: [
      'Несъемная опалубка',
      'Высокая прочность',
      'Удобный монтаж'
    ],
    category: 'foundation',
    pdfLink: '/blocks-pdf/ESD_P6-20.pdf'
  },
  {
    id: 'p25',
    name: 'P25 Foundation Block',
    description: 'Усиленный фундаментный блок 25 см',
    dimensions: '500×250×250 мм',
    concreteUsage: '0.0205 м³/блок',
    packSize: '40 шт/паллета',
    usage: [
      'Усиленные фундаменты',
      'Высоконагруженные конструкции',
      'Подвальные стены'
    ],
    characteristics: [
      'Увеличенная толщина',
      'Повышенная несущая способность',
      'Морозостойкость'
    ],
    category: 'foundation',
    pdfLink: '/blocks-pdf/ECD 016 P25.pdf'
  },
  {
    id: 'p6-30',
    name: 'P6-30 Foundation Block',
    description: 'Тяжелый фундаментный блок 30 см',
    dimensions: '498×298×250 мм',
    concreteUsage: '0.026 м³/блок',
    packSize: '36 шт/паллета',
    usage: [
      'Тяжелые фундаменты',
      'Промышленные объекты',
      'Многоэтажное строительство'
    ],
    characteristics: [
      'Максимальная прочность',
      'Высокая теплоизоляция',
      'Долговечность'
    ],
    category: 'foundation',
    pdfLink: '/blocks-pdf/ESD 84 P6-30.pdf'
  },
  {
    id: 'kl28',
    name: 'KL28 Column/Chimney Block',
    description: 'Блок для колонн, столбов и дымоходов',
    dimensions: '360×360×240 мм',
    weight: '31.25 кг',
    packSize: '16 шт/паллета',
    usage: [
      'Колонны и столбы',
      'Дымоходы',
      'Вентиляционные шахты',
      'Опорные конструкции'
    ],
    characteristics: [
      'Квадратное сечение',
      'Идеальная геометрия',
      'Огнестойкость'
    ],
    category: 'special',
    pdfLink: '/blocks-pdf/ECD 012B KL-28.pdf'
  },
  {
    id: 's6',
    name: 'S6 Standard Masonry Block',
    description: 'Стандартный кладочный блок для стен 20 см',
    dimensions: '400×200×200 мм',
    packSize: '60 шт/паллета',
    usage: [
      'Наружные стены',
      'Внутренние перегородки',
      'Ограждающие конструкции'
    ],
    characteristics: [
      '10 блоков/м²',
      'Раствор 0.002 м³/блок',
      'Отличная геометрия'
    ],
    category: 'wall',
    pdfLink: '/blocks-pdf/ECD 91 S6.pdf'
  },
  {
    id: 'sm6',
    name: 'SM6 Reinforced Masonry Block',
    description: 'Усиленный кладочный блок для стен 20 см',
    dimensions: '400×200×200 мм',
    packSize: '50 шт/паллета',
    usage: [
      'Несущие стены',
      'Сейсмостойкие конструкции',
      'Высоконагруженные стены'
    ],
    characteristics: [
      '8 блоков/м²',
      'Раствор 0.0023 м³/блок',
      'Повышенная прочность'
    ],
    category: 'wall',
    pdfLink: '/blocks-pdf/ECD 92 SM6.pdf'
  },
  {
    id: 'sp',
    name: 'SP Partition Block',
    description: 'Перегородочный блок 10 см',
    dimensions: '400×100×200 мм',
    packSize: '100 шт/паллета',
    usage: [
      'Внутренние перегородки',
      'Легкие конструкции',
      'Зонирование помещений'
    ],
    characteristics: [
      'Покрытие 12.5 м²/комплект',
      'Раствор 0.00092 м³/блок',
      'Легкий вес'
    ],
    category: 'wall',
    pdfLink: '/blocks-pdf/ECD 98 SP.pdf'
  },
  {
    id: 's25',
    name: 'S25 Heavy-Duty Masonry Block',
    description: 'Тяжелый кладочный блок 25 см',
    dimensions: '400×250×200 мм',
    packSize: '60 шт/паллета',
    usage: [
      'Толстые наружные стены',
      'Энергоэффективное строительство',
      'Звукоизолирующие конструкции'
    ],
    characteristics: [
      'Покрытие 5.25 м²/комплект',
      'Высокие теплоизоляционные свойства',
      'Отличная звукоизоляция'
    ],
    category: 'wall',
    pdfLink: '/blocks-pdf/ECD 915 S25.pdf'
  },
  {
    id: 'vb2',
    name: 'VB2 Ventilation Blocks',
    description: 'Блоки для вентиляционных систем',
    dimensions: '360×250×240 мм',
    weight: '28.13 кг',
    packSize: '20 шт/паллета',
    usage: [
      'Вентиляционные каналы',
      'Системы воздуховодов',
      'Дымоходы малого сечения'
    ],
    characteristics: [
      'Предусмотрены каналы',
      'Гладкие внутренние поверхности',
      'Точная геометрия'
    ],
    category: 'special',
    pdfLink: '/blocks-pdf/VB-2 deklaracija.pdf'
  }
];

export const CATEGORIES = {
  foundation: {
    name: '🏗️ Фундаментные блоки',
    icon: '🏗️',
    description: 'Блоки для создания надежных фундаментов'
  },
  wall: {
    name: '🧱 Стеновые блоки', 
    icon: '🧱',
    description: 'Блоки для возведения стен и перегородок'
  },
  special: {
    name: '⚙️ Специальные блоки',
    icon: '⚙️', 
    description: 'Блоки специального назначения'
  }
};

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(product => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(product => product.id === id);
}

export function formatProductCard(product: Product, showCompareButton: boolean = true): string {
  const categoryIcon = CATEGORIES[product.category].icon;
  
  let card = `${categoryIcon} **${product.name}**\n\n`;
  card += `📝 ${product.description}\n\n`;
  
  card += `📐 **Технические характеристики:**\n`;
  card += `• Размеры: ${product.dimensions}\n`;
  
  if (product.concreteUsage) {
    card += `• Расход бетона: ${product.concreteUsage}\n`;
  }
  
  if (product.weight) {
    card += `• Вес: ${product.weight}\n`;
  }
  
  if (product.packSize) {
    card += `• Упаковка: ${product.packSize}\n`;
  }
  
  card += `\n🔧 **Применение:**\n`;
  product.usage.forEach(use => {
    card += `• ${use}\n`;
  });
  
  card += `\n⭐ **Особенности:**\n`;
  product.characteristics.forEach(char => {
    card += `• ${char}\n`;
  });
  
  if (product.pdfLink) {
    card += `\n📄 **Документация:**\n`;
    card += `Техническая документация и инструкции по применению доступны в PDF-формате.\n`;
  }
  
  card += `\n🤖 **Есть вопросы по этому блоку?**\n`;
  card += `Просто напишите мне сообщение! Например:\n`;
  card += `• "Сколько блоков ${product.name} нужно для дома 10×15м?"\n`;
  card += `• "Какой раствор использовать с ${product.name}?"\n`;
  card += `• "Можно ли ${product.name} для подвала?"\n`;
  
  return card;
}

export function compareProducts(products: Product[]): string {
  if (products.length < 2) {
    return "Для сравнения нужно выбрать минимум 2 товара";
  }
  
  let comparison = `📊 **Сравнение товаров**\n\n`;
  
  // Заголовки
  comparison += `| Характеристика | ${products.map(p => p.name.replace(' Block', '')).join(' | ')} |\n`;
  comparison += `|${Array(products.length + 1).fill('---').join('|')}|\n`;
  
  // Размеры
  comparison += `| 📐 Размеры | ${products.map(p => p.dimensions).join(' | ')} |\n`;
  
  // Расход бетона
  comparison += `| 💧 Расход бетона | ${products.map(p => p.concreteUsage || 'н/д').join(' | ')} |\n`;
  
  // Упаковка
  comparison += `| 📦 Упаковка | ${products.map(p => p.packSize || 'н/д').join(' | ')} |\n`;
  
  // Вес
  comparison += `| ⚖️ Вес | ${products.map(p => p.weight || 'н/д').join(' | ')} |\n`;
  
  // Категория
  comparison += `| 🏷️ Категория | ${products.map(p => CATEGORIES[p.category].name).join(' | ')} |\n`;
  
  comparison += `\n💡 **Рекомендации по выбору:**\n`;
  
  if (products.some(p => p.category === 'foundation')) {
    comparison += `• Для фундаментов выбирайте блоки с максимальной прочностью\n`;
  }
  
  if (products.some(p => p.category === 'wall')) {
    comparison += `• Для стен учитывайте теплоизоляционные свойства\n`;
  }
  
  comparison += `\n🤖 **Нужна помощь с выбором?**\n`;
  comparison += `Напишите мне: "Помоги выбрать между ${products.map(p => p.name).join(' и ')}"\n`;
  
  return comparison;
}

export function filterProducts(filters: {
  category?: string;
  usage?: string;
  hasConcreteUsage?: boolean;
  hasWeight?: boolean;
}): Product[] {
  return PRODUCTS.filter(product => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    if (filters.usage && !product.usage.some(use => 
      use.toLowerCase().includes(filters.usage!.toLowerCase())
    )) {
      return false;
    }
    
    if (filters.hasConcreteUsage && !product.concreteUsage) {
      return false;
    }
    
    if (filters.hasWeight && !product.weight) {
      return false;
    }
    
    return true;
  });
}
