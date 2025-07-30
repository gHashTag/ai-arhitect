import { Markup } from "telegraf";
import { SupportedLanguage } from "./simpleI18n";

export interface Product {
  id: string;
  name: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  category: "foundation" | "wall" | "special";
  specifications?: {
    dimensions?: string;
    weight?: string;
    application?: string[];
  };
}

const products: Product[] = [
  // Фундаментные блоки
  {
    id: "p6_20",
    name: {
      ru: "HAUS P6-20",
      lt: "HAUS P6-20",
      en: "HAUS P6-20",
    },
    description: {
      ru: "Блоки-опалубка 20см для фундаментов и стен",
      lt: "Klojinės blokai 20cm pamatams ir sienoms",
      en: "Formwork blocks 20cm for foundations and walls",
    },
    category: "foundation",
    specifications: {
      dimensions: "498×198×250mm",
      weight: "12-15 кг",
      application: ["foundation", "retaining_walls", "basement"],
    },
  },
  {
    id: "p6_30",
    name: {
      ru: "HAUS P6-30",
      lt: "HAUS P6-30",
      en: "HAUS P6-30",
    },
    description: {
      ru: "Блоки-опалубка 30см повышенной высоты",
      lt: "Klojinės blokai 30cm padidinto aukščio",
      en: "Formwork blocks 30cm increased height",
    },
    category: "foundation",
    specifications: {
      dimensions: "498×198×300mm",
      weight: "15-18 кг",
      application: ["foundation", "thick_walls", "high_loads"],
    },
  },
  {
    id: "p25",
    name: {
      ru: "HAUS P25",
      lt: "HAUS P25",
      en: "HAUS P25",
    },
    description: {
      ru: "Блоки-опалубка 25см для толстых стен",
      lt: "Klojinės blokai 25cm storioms sienoms",
      en: "Formwork blocks 25cm for thick walls",
    },
    category: "foundation",
    specifications: {
      dimensions: "25cm толщина",
      application: ["thick_foundations", "load_bearing", "multi_story"],
    },
  },

  // Стеновые блоки
  {
    id: "s25",
    name: {
      ru: "HAUS S25",
      lt: "HAUS S25",
      en: "HAUS S25",
    },
    description: {
      ru: "Стеновые блоки 25см для несущих стен",
      lt: "Sienų blokai 25cm laikančioms sienoms",
      en: "Wall blocks 25cm for load-bearing walls",
    },
    category: "wall",
    specifications: {
      dimensions: "25cm толщина",
      application: ["exterior_walls", "load_bearing", "insulation"],
    },
  },
  {
    id: "s6",
    name: {
      ru: "HAUS S6",
      lt: "HAUS S6",
      en: "HAUS S6",
    },
    description: {
      ru: "Стеновые блоки 15см для перегородок",
      lt: "Sienų blokai 15cm pertvaroms",
      en: "Wall blocks 15cm for partitions",
    },
    category: "wall",
    specifications: {
      dimensions: "15cm толщина",
      application: ["partitions", "interior_walls", "sound_insulation"],
    },
  },
  {
    id: "sm6",
    name: {
      ru: "HAUS SM6",
      lt: "HAUS SM6",
      en: "HAUS SM6",
    },
    description: {
      ru: "Модифицированные стеновые блоки",
      lt: "Modifikuoti sienų blokai",
      en: "Modified wall blocks",
    },
    category: "wall",
    specifications: {
      application: ["improved_strength", "optimized_connection"],
    },
  },
  {
    id: "sp",
    name: {
      ru: "HAUS SP",
      lt: "HAUS SP",
      en: "HAUS SP",
    },
    description: {
      ru: "Блоки для перегородок с улучшенной звукоизоляцией",
      lt: "Pertvarų blokai su gerinta garso izoliacija",
      en: "Partition blocks with improved sound insulation",
    },
    category: "wall",
    specifications: {
      application: [
        "partitions",
        "sound_insulation_52db",
        "quick_installation",
      ],
    },
  },

  // Специальные блоки
  {
    id: "vb_2",
    name: {
      ru: "HAUS VB-2",
      lt: "HAUS VB-2",
      en: "HAUS VB-2",
    },
    description: {
      ru: "Вентиляционные блоки для каналов",
      lt: "Ventiliacijos blokai kanalams",
      en: "Ventilation blocks for channels",
    },
    category: "special",
    specifications: {
      application: [
        "ventilation",
        "kitchen",
        "bathroom",
        "natural_ventilation",
      ],
    },
  },
];

export class SimpleCatalogService {
  getMainCatalogKeyboard(language: SupportedLanguage) {
    const keyboards = {
      ru: [
        [{ text: "🏗️ Фундаментные блоки", callback_data: "cat_foundation" }],
        [{ text: "🧱 Стеновые блоки", callback_data: "cat_wall" }],
        [{ text: "⚙️ Специальные блоки", callback_data: "cat_special" }],
        [{ text: "« Назад", callback_data: "back_to_main" }],
      ],
      lt: [
        [{ text: "🏗️ Pamatų blokai", callback_data: "cat_foundation" }],
        [{ text: "🧱 Sienų blokai", callback_data: "cat_wall" }],
        [{ text: "⚙️ Specialūs blokai", callback_data: "cat_special" }],
        [{ text: "« Atgal", callback_data: "back_to_main" }],
      ],
      en: [
        [{ text: "🏗️ Foundation blocks", callback_data: "cat_foundation" }],
        [{ text: "🧱 Wall blocks", callback_data: "cat_wall" }],
        [{ text: "⚙️ Special blocks", callback_data: "cat_special" }],
        [{ text: "« Back", callback_data: "back_to_main" }],
      ],
    };

    return Markup.inlineKeyboard(keyboards[language]);
  }

  getCategoryBlocks(
    category: "foundation" | "wall" | "special",
    language: SupportedLanguage
  ) {
    const categoryProducts = products.filter((p) => p.category === category);

    const buttons = categoryProducts.map((product) => [
      { text: product.name[language], callback_data: `block_${product.id}` },
    ]);

    const backTexts = {
      ru: "« К категориям",
      lt: "« Į kategorijas",
      en: "« To categories",
    };

    buttons.push([
      { text: backTexts[language], callback_data: "back_to_catalog" },
    ]);

    return Markup.inlineKeyboard(buttons);
  }

  getBlockDetails(blockId: string, language: SupportedLanguage) {
    const product = products.find((p) => p.id === blockId);
    if (!product) return null;

    let details = `**${product.name[language]}**\n\n${product.description[language]}`;

    if (product.specifications) {
      const specTexts = {
        ru: "\n\n📋 **Характеристики:**",
        lt: "\n\n📋 **Charakteristikos:**",
        en: "\n\n📋 **Specifications:**",
      };

      details += specTexts[language];

      if (product.specifications.dimensions) {
        const dimTexts = {
          ru: "\n• Размеры: ",
          lt: "\n• Išmatavimai: ",
          en: "\n• Dimensions: ",
        };
        details += dimTexts[language] + product.specifications.dimensions;
      }

      if (product.specifications.weight) {
        const weightTexts = {
          ru: "\n• Вес: ",
          lt: "\n• Svoris: ",
          en: "\n• Weight: ",
        };
        details += weightTexts[language] + product.specifications.weight;
      }
    }

    const backTexts = {
      ru: "« К блокам",
      lt: "« Į blokus",
      en: "« To blocks",
    };

    const keyboard = Markup.inlineKeyboard([
      [{ text: backTexts[language], callback_data: `cat_${product.category}` }],
    ]);

    return { details, keyboard };
  }

  getAllProducts(): Product[] {
    return products;
  }

  getProductsByCategory(
    category: "foundation" | "wall" | "special"
  ): Product[] {
    return products.filter((p) => p.category === category);
  }
}

export const catalog = new SimpleCatalogService();
