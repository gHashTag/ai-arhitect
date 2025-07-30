import { FAQ } from "./faqService";

export const expandedFAQs: Omit<FAQ, "id" | "createdAt" | "updatedAt">[] = [
  // ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ (Technical) - 30 вопросов

  // Русские FAQ - Технические
  {
    question: "Что такое блоки-опалубка HAUS P6-20?",
    answer:
      "HAUS P6-20 - это несъемная опалубка из бетона, которая используется для создания монолитных конструкций. Блоки полые внутри, собираются без раствора, а затем заполняются бетоном. Размеры: 498×198×250 мм (M) и 508×198×250 мм (K).",
    category: "technical",
    tags: ["блоки", "опалубка", "размеры", "P6-20"],
    product: "P6-20",
    language: "ru",
    priority: 10,
  },
  {
    question: "Какая прочность у блоков HAUS P6-20?",
    answer:
      "Блоки HAUS P6-20 имеют прочность на сжатие не менее 10 МПа (M100). После заливки бетоном прочность готовой конструкции достигает проектных значений согласно классу используемого бетона.",
    category: "technical",
    tags: ["прочность", "сжатие", "класс бетона", "P6-20"],
    product: "P6-20",
    language: "ru",
    priority: 9,
  },
  {
    question: "Какой вес у одного блока P6-20?",
    answer:
      "Вес одного блока P6-20 (M): около 12-15 кг, блока P6-20 (K): около 13-16 кг. Точный вес зависит от влажности блока.",
    category: "technical",
    tags: ["вес", "масса", "блок", "P6-20"],
    product: "P6-20",
    language: "ru",
    priority: 8,
  },
  {
    question: "Какая морозостойкость у блоков HAUS?",
    answer:
      "Блоки HAUS обладают морозостойкостью F50-F75, что означает способность выдерживать не менее 50-75 циклов замораживания-оттаивания без потери прочности.",
    category: "technical",
    tags: ["морозостойкость", "циклы", "F50", "F75"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "В чем разница между блоками P6-20 и P8-20?",
    answer:
      "P8-20 имеет большую высоту (300 мм против 250 мм у P6-20) и толщину стенок, что обеспечивает большую прочность. Используется для высоких нагрузок.",
    category: "technical",
    tags: ["разница", "P6-20", "P8-20", "высота", "прочность"],
    product: "P8-20",
    language: "ru",
    priority: 8,
  },
  {
    question: "Для чего нужны блоки типа K (угловые)?",
    answer:
      "Блоки типа K имеют немного другие размеры и используются для перевязки швов, создания углов и обеспечения правильной геометрии кладки.",
    category: "technical",
    tags: ["тип K", "углы", "перевязка", "геометрия"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Какая плотность у блоков HAUS S25?",
    answer:
      "Блоки HAUS S25 имеют плотность 1800-2000 кг/м³. Это обеспечивает оптимальное соотношение прочности и теплоизоляционных свойств.",
    category: "technical",
    tags: ["плотность", "S25", "теплоизоляция"],
    product: "S25",
    language: "ru",
    priority: 6,
  },
  {
    question: "Какова водопоглощение блоков HAUS?",
    answer:
      "Водопоглощение блоков HAUS составляет не более 8% по массе, что соответствует требованиям строительных норм для качественных бетонных изделий.",
    category: "technical",
    tags: ["водопоглощение", "влажность", "нормы"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Какая теплопроводность у блоков HAUS?",
    answer:
      "Теплопроводность блоков HAUS составляет 0,18-0,25 Вт/(м·К) в зависимости от типа блока. Это обеспечивает хорошие теплоизоляционные свойства.",
    category: "technical",
    tags: ["теплопроводность", "изоляция", "энергоэффективность"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Каков размер полости в блоках P6-20?",
    answer:
      "Внутренняя полость блоков P6-20 имеет размеры 150×150 мм, что обеспечивает достаточное пространство для армирования и заливки бетона.",
    category: "technical",
    tags: ["полость", "внутренние размеры", "армирование"],
    product: "P6-20",
    language: "ru",
    priority: 6,
  },

  // Литовские FAQ - Технические
  {
    question: "Kokios yra HAUS P6-20 blokų išmatavimai?",
    answer:
      "HAUS P6-20 blokai yra dviejų tipų: M tipo - 498×198×250 mm ir K tipo - 508×198×250 mm. Blokai naudojami kaip nesunaikinama klojinė betonavimo metu.",
    category: "technical",
    tags: ["išmatavimai", "P6-20", "blokai"],
    product: "P6-20",
    language: "lt",
    priority: 10,
  },
  {
    question: "Kiek sveria vienas HAUS P6-20 blokas?",
    answer:
      "Vienas P6-20 (M) blokas sveria apie 12-15 kg, o P6-20 (K) blokas - apie 13-16 kg. Tikslus svoris priklauso nuo bloko drėgmės.",
    category: "technical",
    tags: ["svoris", "masė", "P6-20"],
    product: "P6-20",
    language: "lt",
    priority: 8,
  },
  {
    question: "Koks HAUS blokų atsparumas šalčiui?",
    answer:
      "HAUS blokai turi F50-F75 atsparumą šalčiui, tai reiškia, kad jie gali atlaikyti ne mažiau kaip 50-75 užšalimo-atšilimo ciklų neprarandami stiprumo.",
    category: "technical",
    tags: ["šalčio atsparumas", "ciklai", "F50", "F75"],
    product: "bendras",
    language: "lt",
    priority: 7,
  },
  {
    question: "Kokia HAUS S25 blokų tankis?",
    answer:
      "HAUS S25 blokų tankis yra 1800-2000 kg/m³. Tai užtikrina optimalų stiprumo ir šiluminės izoliacijos savybių santykį.",
    category: "technical",
    tags: ["tankis", "S25", "izoliacijos"],
    product: "S25",
    language: "lt",
    priority: 6,
  },
  {
    question: "Koks HAUS blokų vandens sugėrimas?",
    answer:
      "HAUS blokų vandens sugėrimas neviršija 8% pagal masę, tai atitinka statybos normų reikalavimus kokybės betoniniais gaminiams.",
    category: "technical",
    tags: ["vandens sugėrimas", "drėgmė", "normos"],
    product: "bendras",
    language: "lt",
    priority: 6,
  },

  // Английские FAQ - Технические
  {
    question: "What are HAUS P6-20 formwork blocks?",
    answer:
      "HAUS P6-20 are permanent concrete formwork blocks used for creating monolithic structures. The blocks are hollow inside, assembled without mortar, then filled with concrete. Dimensions: 498×198×250 mm (M) and 508×198×250 mm (K).",
    category: "technical",
    tags: ["blocks", "formwork", "dimensions", "P6-20"],
    product: "P6-20",
    language: "en",
    priority: 10,
  },
  {
    question: "What is the strength of HAUS P6-20 blocks?",
    answer:
      "HAUS P6-20 blocks have compressive strength of at least 10 MPa (M100). After concrete filling, the finished structure strength reaches design values according to the concrete class used.",
    category: "technical",
    tags: ["strength", "compression", "concrete class", "P6-20"],
    product: "P6-20",
    language: "en",
    priority: 9,
  },
  {
    question: "What is the weight of one P6-20 block?",
    answer:
      "Weight of one P6-20 (M) block: about 12-15 kg, P6-20 (K) block: about 13-16 kg. Exact weight depends on block moisture content.",
    category: "technical",
    tags: ["weight", "mass", "block", "P6-20"],
    product: "P6-20",
    language: "en",
    priority: 8,
  },
  {
    question: "What is the frost resistance of HAUS blocks?",
    answer:
      "HAUS blocks have F50-F75 frost resistance, meaning they can withstand at least 50-75 freeze-thaw cycles without strength loss.",
    category: "technical",
    tags: ["frost resistance", "cycles", "F50", "F75"],
    product: "general",
    language: "en",
    priority: 7,
  },
  {
    question: "What is the thermal conductivity of HAUS blocks?",
    answer:
      "Thermal conductivity of HAUS blocks is 0.18-0.25 W/(m·K) depending on block type. This provides good thermal insulation properties.",
    category: "technical",
    tags: ["thermal conductivity", "insulation", "energy efficiency"],
    product: "general",
    language: "en",
    priority: 7,
  },

  // ПРИМЕНЕНИЕ (Application) - 25 вопросов

  // Русские FAQ - Применение
  {
    question: "Можно ли строить несущие стены из блоков P6-20?",
    answer:
      "Да, блоки P6-20 предназначены для несущих конструкций. После заполнения бетоном они образуют монолитную железобетонную стену с высокой несущей способностью.",
    category: "application",
    tags: ["несущие стены", "монолит", "железобетон", "P6-20"],
    product: "P6-20",
    language: "ru",
    priority: 9,
  },
  {
    question: "Подходят ли блоки HAUS для строительства подвала?",
    answer:
      "Да, блоки HAUS отлично подходят для подвальных стен. Необходимо обеспечить качественную гидроизоляцию и дренаж согласно строительным нормам.",
    category: "application",
    tags: ["подвал", "гидроизоляция", "дренаж", "стены"],
    product: "общее",
    language: "ru",
    priority: 8,
  },
  {
    question: "Можно ли использовать блоки для строительства бассейна?",
    answer:
      "Да, блоки HAUS подходят для строительства бассейнов. Требуется специальная гидроизоляция, армирование по проекту и качественная заливка бетоном.",
    category: "application",
    tags: ["бассейн", "гидроизоляция", "армирование", "заливка"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Какие типы фундаментов можно строить из блоков P6-20?",
    answer:
      "Из блоков P6-20 можно строить: ленточные фундаменты, ростверки на сваях, подпорные стены, цокольные этажи и перемычки над проемами.",
    category: "application",
    tags: ["фундамент", "ленточный", "ростверк", "сваи"],
    product: "P6-20",
    language: "ru",
    priority: 9,
  },
  {
    question:
      "Можно ли использовать блоки HAUS для многоэтажного строительства?",
    answer:
      "Блоки HAUS можно использовать для малоэтажного строительства (до 3-х этажей). Для многоэтажных зданий требуется специальный расчет и проект.",
    category: "application",
    tags: ["многоэтажное", "этажность", "расчет", "проект"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Подходят ли блоки S25 для наружных стен?",
    answer:
      "Да, блоки S25 специально предназначены для наружных несущих стен. Толщина 25 см обеспечивает необходимую прочность и теплоизоляцию.",
    category: "application",
    tags: ["наружные стены", "S25", "несущие", "теплоизоляция"],
    product: "S25",
    language: "ru",
    priority: 8,
  },
  {
    question: "Можно ли строить из блоков HAUS в сейсмически активных районах?",
    answer:
      "Да, монолитные конструкции из блоков HAUS обладают высокой сейсмостойкостью. Требуется усиленное армирование согласно сейсмическим нормам.",
    category: "application",
    tags: ["сейсмостойкость", "армирование", "нормы"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Какие перекрытия можно использовать с блоками HAUS?",
    answer:
      "С блоками HAUS совместимы: монолитные ж/б перекрытия, сборные плиты перекрытий, деревянные балки. Необходим расчет опирания.",
    category: "application",
    tags: ["перекрытия", "монолитные", "сборные", "деревянные"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Можно ли использовать блоки для строительства гаража?",
    answer:
      "Да, блоки HAUS идеально подходят для строительства гаражей. Обеспечивают прочность конструкции и хорошую теплоизоляцию.",
    category: "application",
    tags: ["гараж", "строительство", "прочность"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Подходят ли блоки для строительства промышленных зданий?",
    answer:
      "Блоки HAUS можно использовать для промышленных зданий небольшой этажности. Для крупных промобъектов требуется индивидуальный расчет.",
    category: "application",
    tags: ["промышленные", "здания", "расчет"],
    product: "общее",
    language: "ru",
    priority: 5,
  },

  // Литовские FAQ - Применение
  {
    question: "Ar galima statyti laikančius sienas iš P6-20 blokų?",
    answer:
      "Taip, P6-20 blokai skirti laikančioms konstrukcijoms. Užpylus betonu, jie sudaro monolitinę gelžbetoninę sieną su dideliu laikomosios galios.",
    category: "application",
    tags: ["laikančios sienos", "monolitas", "gelžbetonis", "P6-20"],
    product: "P6-20",
    language: "lt",
    priority: 9,
  },
  {
    question: "Ar HAUS blokai tinka rūsio statybai?",
    answer:
      "Taip, HAUS blokai puikiai tinka rūsio sienoms. Būtina užtikrinti kokybišką hidroizoliaciją ir drenažą pagal statybos normas.",
    category: "application",
    tags: ["rūsys", "hidroizoliacija", "drenažas", "sienos"],
    product: "bendras",
    language: "lt",
    priority: 8,
  },
  {
    question: "Ar galima naudoti blokus baseino statybai?",
    answer:
      "Taip, HAUS blokai tinka baseinų statybai. Reikalinga speciali hidroizoliacija, armavimas pagal projektą ir kokybiškas betonavimas.",
    category: "application",
    tags: ["baseinas", "hidroizoliacija", "armavimas", "betonavimas"],
    product: "bendras",
    language: "lt",
    priority: 7,
  },
  {
    question: "Kokius pamatus galima statyti iš P6-20 blokų?",
    answer:
      "Iš P6-20 blokų galima statyti: juostinius pamatus, rostverkus ant polių, atraminės sienas, rūsio aukštus ir perempių virš angų.",
    category: "application",
    tags: ["pamatai", "juostiniai", "rostverkas", "poliai"],
    product: "P6-20",
    language: "lt",
    priority: 9,
  },
  {
    question: "Ar S25 blokai tinka išorės sienoms?",
    answer:
      "Taip, S25 blokai specialiai skirti išorės laikančioms sienoms. 25 cm storis užtikrina reikiamą stiprumą ir šiluminę izoliaciją.",
    category: "application",
    tags: ["išorės sienos", "S25", "laikančios", "izoliacija"],
    product: "S25",
    language: "lt",
    priority: 8,
  },

  // Английские FAQ - Применение
  {
    question: "Can P6-20 blocks be used for load-bearing walls?",
    answer:
      "Yes, P6-20 blocks are designed for load-bearing structures. After concrete filling, they form a monolithic reinforced concrete wall with high bearing capacity.",
    category: "application",
    tags: ["load-bearing walls", "monolithic", "reinforced concrete", "P6-20"],
    product: "P6-20",
    language: "en",
    priority: 9,
  },
  {
    question: "Are HAUS blocks suitable for basement construction?",
    answer:
      "Yes, HAUS blocks are excellent for basement walls. Quality waterproofing and drainage must be provided according to building codes.",
    category: "application",
    tags: ["basement", "waterproofing", "drainage", "walls"],
    product: "general",
    language: "en",
    priority: 8,
  },
  {
    question: "Can blocks be used for swimming pool construction?",
    answer:
      "Yes, HAUS blocks are suitable for swimming pool construction. Special waterproofing, project-based reinforcement and quality concrete filling are required.",
    category: "application",
    tags: ["swimming pool", "waterproofing", "reinforcement", "concrete"],
    product: "general",
    language: "en",
    priority: 7,
  },
  {
    question: "What types of foundations can be built with P6-20 blocks?",
    answer:
      "P6-20 blocks can be used for: strip foundations, pile caps, retaining walls, basement floors and lintels over openings.",
    category: "application",
    tags: ["foundation", "strip", "pile caps", "retaining walls"],
    product: "P6-20",
    language: "en",
    priority: 9,
  },
  {
    question: "Are S25 blocks suitable for exterior walls?",
    answer:
      "Yes, S25 blocks are specifically designed for exterior load-bearing walls. The 25 cm thickness provides necessary strength and thermal insulation.",
    category: "application",
    tags: ["exterior walls", "S25", "load-bearing", "insulation"],
    product: "S25",
    language: "en",
    priority: 8,
  },

  // МОНТАЖ (Installation) - 20 вопросов

  // Русские FAQ - Монтаж
  {
    question: "Нужен ли фундамент под блоки HAUS?",
    answer:
      "Да, обязательно нужен качественный фундамент. Первый ряд блоков устанавливается на выровненную поверхность фундамента с гидроизоляцией.",
    category: "installation",
    tags: ["фундамент", "основание", "первый ряд", "гидроизоляция"],
    product: "общее",
    language: "ru",
    priority: 10,
  },
  {
    question: "Как соединяются блоки между собой?",
    answer:
      'Блоки HAUS имеют систему "шип-паз", которая обеспечивает точное позиционирование. Блоки устанавливаются насухо, без раствора между рядами.',
    category: "installation",
    tags: ["соединение", "шип-паз", "без раствора", "позиционирование"],
    product: "общее",
    language: "ru",
    priority: 9,
  },
  {
    question: "Сколько времени занимает строительство стены из блоков HAUS?",
    answer:
      "Монтаж блоков происходит в 3-5 раз быстрее обычной кладки. Опытная бригада может смонтировать до 50-100 м² стены за день.",
    category: "installation",
    tags: ["скорость", "время", "монтаж", "производительность"],
    product: "общее",
    language: "ru",
    priority: 8,
  },
  {
    question: "Можно ли резать блоки HAUS?",
    answer:
      "Да, блоки легко режутся обычной пилой или болгаркой. Используйте средства защиты от пыли. Рез получается ровный и точный.",
    category: "installation",
    tags: ["резка", "пила", "болгарка", "защита"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Какие инструменты нужны для монтажа блоков?",
    answer:
      "Для монтажа нужны: уровень, резиновый молоток, пила или болгарка для резки, рулетка, отвес, средства защиты.",
    category: "installation",
    tags: ["инструменты", "уровень", "молоток", "пила"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "В какое время года можно работать с блоками HAUS?",
    answer:
      "Блоки можно монтировать круглый год. При температуре ниже +5°C используйте морозостойкие добавки в бетон для заливки.",
    category: "installation",
    tags: ["сезонность", "температура", "мороз", "добавки"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Нужны ли специальные навыки для монтажа блоков?",
    answer:
      "Монтаж блоков HAUS прост и не требует высокой квалификации. Достаточно базовых строительных навыков и соблюдения инструкции.",
    category: "installation",
    tags: ["навыки", "квалификация", "простота", "инструкция"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Как контролировать геометрию при кладке блоков?",
    answer:
      'Используйте направляющий шнур, уровень и отвес. Проверяйте вертикальность каждые 3-4 ряда. Система "шип-паз" помогает поддерживать геометрию.',
    category: "installation",
    tags: ["геометрия", "контроль", "уровень", "вертикальность"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Что делать если блок треснул при транспортировке?",
    answer:
      "Небольшие трещины не критичны - блок можно использовать. При серьезных повреждениях блок заменяется. Сообщите о проблеме при приемке товара.",
    category: "installation",
    tags: ["трещины", "транспортировка", "повреждения", "замена"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Как делать проемы для окон и дверей?",
    answer:
      "Проемы формируются установкой временной опалубки на время заливки бетона. После застывания опалубка удаляется.",
    category: "installation",
    tags: ["проемы", "окна", "двери", "опалубка"],
    product: "общее",
    language: "ru",
    priority: 8,
  },

  // Литовские FAQ - Монтаж
  {
    question: "Ar reikalingas pamatas HAUS blokams?",
    answer:
      "Taip, būtinai reikalingas kokybiškas pamatas. Pirmas blokų eilės statomas ant išlygintos pamato paviršiaus su hidroizoliacija.",
    category: "installation",
    tags: ["pamatas", "pagrindas", "pirma eilė", "hidroizoliacija"],
    product: "bendras",
    language: "lt",
    priority: 10,
  },
  {
    question: "Kaip sujungiami blokai tarpusavyje?",
    answer:
      'HAUS blokai turi "šipas-griovelis" sistemą, kuri užtikrina tikslų pozicionavimą. Blokai statomi sausai, be skiedinio tarp eilių.',
    category: "installation",
    tags: ["sujungimas", "šipas-griovelis", "be skiedinio", "pozicionavimas"],
    product: "bendras",
    language: "lt",
    priority: 9,
  },
  {
    question: "Kiek laiko užtrunka sienos statyba iš HAUS blokų?",
    answer:
      "Blokų montavimas vyksta 3-5 kartus greičiau nei įprasta mūrijimas. Patyrusi brigada per dieną gali sumūryti iki 50-100 m² sienos.",
    category: "installation",
    tags: ["greitis", "laikas", "montavimas", "produktyvumas"],
    product: "bendras",
    language: "lt",
    priority: 8,
  },
  {
    question: "Ar galima pjauti HAUS blokus?",
    answer:
      "Taip, blokai lengvai pjaunami įprastu pjūklu arba kampuoju šlifuokliu. Naudokite apsaugos nuo dulkių priemones. Pjūvis gaunamas lygus ir tikslus.",
    category: "installation",
    tags: ["pjovimas", "pjūklas", "šlifuoklis", "apsauga"],
    product: "bendras",
    language: "lt",
    priority: 7,
  },
  {
    question: "Kokie įrankiai reikalingi blokų montavimui?",
    answer:
      "Montavimui reikalingi: gulsčiukas, guminis plaktuas, pjūklas arba šlifuoklis pjovimui, ruletė, svambalė, apsaugos priemonės.",
    category: "installation",
    tags: ["įrankiai", "gulsčiukas", "plaktuas", "pjūklas"],
    product: "bendras",
    language: "lt",
    priority: 7,
  },

  // Английские FAQ - Монтаж
  {
    question: "Is a foundation needed for HAUS blocks?",
    answer:
      "Yes, a quality foundation is mandatory. The first row of blocks is installed on a leveled foundation surface with waterproofing.",
    category: "installation",
    tags: ["foundation", "base", "first row", "waterproofing"],
    product: "general",
    language: "en",
    priority: 10,
  },
  {
    question: "How are blocks connected to each other?",
    answer:
      "HAUS blocks have a tongue-and-groove system that ensures precise positioning. Blocks are installed dry, without mortar between rows.",
    category: "installation",
    tags: ["connection", "tongue-and-groove", "no mortar", "positioning"],
    product: "general",
    language: "en",
    priority: 9,
  },
  {
    question: "How long does it take to build a wall with HAUS blocks?",
    answer:
      "Block installation is 3-5 times faster than regular masonry. An experienced crew can install up to 50-100 m² of wall per day.",
    category: "installation",
    tags: ["speed", "time", "installation", "productivity"],
    product: "general",
    language: "en",
    priority: 8,
  },
  {
    question: "Can HAUS blocks be cut?",
    answer:
      "Yes, blocks are easily cut with a regular saw or angle grinder. Use dust protection equipment. The cut is smooth and precise.",
    category: "installation",
    tags: ["cutting", "saw", "grinder", "protection"],
    product: "general",
    language: "en",
    priority: 7,
  },
  {
    question: "What tools are needed for block installation?",
    answer:
      "Installation requires: level, rubber hammer, saw or grinder for cutting, measuring tape, plumb line, safety equipment.",
    category: "installation",
    tags: ["tools", "level", "hammer", "saw"],
    product: "general",
    language: "en",
    priority: 7,
  },

  // РАСЧЕТЫ (Calculation) - 15 вопросов

  // Русские FAQ - Расчеты
  {
    question: "Сколько бетона нужно на один блок P6-20?",
    answer:
      "Для заполнения одного блока P6-20 требуется 0.015 м³ бетона. На 1 метр стены высотой 25 см нужно 0.03 м³ бетона, на высоту 50 см - 0.06 м³.",
    category: "calculation",
    tags: ["расход", "бетон", "расчет", "объем"],
    product: "P6-20",
    language: "ru",
    priority: 9,
  },
  {
    question: "Как рассчитать количество блоков на дом?",
    answer:
      "Для расчета нужно: 1) Измерить общую длину стен; 2) Умножить на высоту; 3) Вычесть площадь проемов; 4) Разделить на площадь блока (0,125 м² для P6-20). Добавить 5-10% запас.",
    category: "calculation",
    tags: ["расчет", "количество", "площадь", "запас"],
    product: "P6-20",
    language: "ru",
    priority: 10,
  },
  {
    question: "Сколько арматуры нужно на кубометр бетона в блоках?",
    answer:
      "Обычно требуется 80-120 кг арматуры на м³ бетона. Точный расчет выполняется по проекту с учетом нагрузок и требований нормативов.",
    category: "calculation",
    tags: ["арматура", "расход", "кубометр", "проект"],
    product: "общее",
    language: "ru",
    priority: 8,
  },
  {
    question: "Сколько блоков P6-20 в 1 м² стены?",
    answer:
      "В 1 м² стены помещается 8 блоков P6-20 (при высоте блока 25 см). Один блок покрывает площадь 0,125 м².",
    category: "calculation",
    tags: ["количество", "квадратный метр", "P6-20"],
    product: "P6-20",
    language: "ru",
    priority: 9,
  },
  {
    question: "Как рассчитать вес стены из блоков HAUS?",
    answer:
      "Вес стены = объем бетона × плотность бетона (2400 кг/м³) + вес блоков + вес арматуры. Для точного расчета учитывайте толщину стен.",
    category: "calculation",
    tags: ["вес", "стена", "плотность", "нагрузка"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Сколько блоков S25 нужно на 1 м² стены?",
    answer:
      "Для стены из блоков S25 требуется 8 блоков на 1 м² (при высоте блока 25 см). Учитывайте площадь проемов при расчете.",
    category: "calculation",
    tags: ["S25", "количество", "квадратный метр"],
    product: "S25",
    language: "ru",
    priority: 8,
  },
  {
    question: "Как рассчитать расход цемента для блоков?",
    answer:
      "Расход цемента зависит от класса бетона. Для бетона B15: ~300 кг цемента на м³. Для блока P6-20 (0,015 м³) нужно ~4.5 кг цемента.",
    category: "calculation",
    tags: ["цемент", "расход", "класс бетона"],
    product: "P6-20",
    language: "ru",
    priority: 7,
  },
  {
    question: "Сколько паллет блоков нужно для дома 10×10 м?",
    answer:
      "Для дома 10×10 м высотой 3 м нужно примерно 15-20 паллет блоков P6-20 (в зависимости от количества проемов и внутренних стен).",
    category: "calculation",
    tags: ["паллеты", "дом", "площадь", "P6-20"],
    product: "P6-20",
    language: "ru",
    priority: 8,
  },

  // Литовские FAQ - Расчеты
  {
    question: "Kiek betono reikia vienam P6-20 blokui?",
    answer:
      "Vieno P6-20 bloko užpildymui reikia 0,015 m³ betono. 1 metro sienos aukščio 25 cm reikia 0,03 m³ betono, aukščio 50 cm - 0,06 m³.",
    category: "calculation",
    tags: ["suvartojimas", "betonas", "skaičiavimas", "tūris"],
    product: "P6-20",
    language: "lt",
    priority: 9,
  },
  {
    question: "Kaip apskaičiuoti blokų kiekį namui?",
    answer:
      "Skaičiavimui reikia: 1) Išmatuoti bendrą sienų ilgį; 2) Padauginti iš aukščio; 3) Atimti angų plotą; 4) Padalinti iš bloko ploto (0,125 m² P6-20). Pridėti 5-10% atsargą.",
    category: "calculation",
    tags: ["skaičiavimas", "kiekis", "plotas", "atsarga"],
    product: "P6-20",
    language: "lt",
    priority: 10,
  },
  {
    question: "Kiek armatūros reikia kubiniam metrui betono blokuose?",
    answer:
      "Paprastai reikia 80-120 kg armatūros 1 m³ betono. Tikslus skaičiavimas atliekamas pagal projektą atsižvelgiant į apkrovas ir normatyvų reikalavimus.",
    category: "calculation",
    tags: ["armatūra", "suvartojimas", "kubinis metras", "projektas"],
    product: "bendras",
    language: "lt",
    priority: 8,
  },
  {
    question: "Kiek P6-20 blokų 1 m² sienos?",
    answer:
      "1 m² sienos telpa 8 P6-20 blokai (kai bloko aukštis 25 cm). Vienas blokas dengią 0,125 m² plotą.",
    category: "calculation",
    tags: ["kiekis", "kvadratinis metras", "P6-20"],
    product: "P6-20",
    language: "lt",
    priority: 9,
  },

  // Английские FAQ - Расчеты
  {
    question: "How much concrete is needed for one P6-20 block?",
    answer:
      "Filling one P6-20 block requires 0.015 m³ of concrete. For 1 meter of wall 25 cm high, 0.03 m³ of concrete is needed, for 50 cm height - 0.06 m³.",
    category: "calculation",
    tags: ["consumption", "concrete", "calculation", "volume"],
    product: "P6-20",
    language: "en",
    priority: 9,
  },
  {
    question: "How to calculate the number of blocks for a house?",
    answer:
      "For calculation: 1) Measure total wall length; 2) Multiply by height; 3) Subtract opening areas; 4) Divide by block area (0.125 m² for P6-20). Add 5-10% reserve.",
    category: "calculation",
    tags: ["calculation", "quantity", "area", "reserve"],
    product: "P6-20",
    language: "en",
    priority: 10,
  },
  {
    question:
      "How much reinforcement is needed per cubic meter of concrete in blocks?",
    answer:
      "Usually 80-120 kg of reinforcement per m³ of concrete is required. Exact calculation is performed according to the project considering loads and regulatory requirements.",
    category: "calculation",
    tags: ["reinforcement", "consumption", "cubic meter", "project"],
    product: "general",
    language: "en",
    priority: 8,
  },

  // СТОИМОСТЬ (Pricing) - 10 вопросов

  // Русские FAQ - Стоимость
  {
    question: "Экономичнее ли строительство из блоков HAUS?",
    answer:
      "Да, экономия достигается за счет: быстрого монтажа (экономия на оплате труда), отсутствия мокрых процессов, меньшего количества материалов. Общая экономия 15-25%.",
    category: "pricing",
    tags: ["экономия", "стоимость", "быстрый монтаж", "материалы"],
    product: "общее",
    language: "ru",
    priority: 9,
  },
  {
    question: "Какие скидки предоставляются при больших объемах?",
    answer:
      "Скидки предоставляются от 5 паллет. Конкретные условия зависят от объема и региона доставки. Обращайтесь к менеджерам: +37064608801",
    category: "pricing",
    tags: ["скидки", "объем", "паллеты", "условия"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Сколько стоит доставка блоков?",
    answer:
      "Стоимость доставки зависит от расстояния и объема заказа. При заказе от 10 паллет доставка по Литве может быть бесплатной. Уточняйте у менеджеров.",
    category: "pricing",
    tags: ["доставка", "стоимость", "расстояние", "объем"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Можно ли купить блоки в розницу?",
    answer:
      "Да, блоки продаются как поштучно, так и паллетами. Минимальный заказ - 1 паллета. Розничные продажи возможны со склада в Вильнюсе.",
    category: "pricing",
    tags: ["розница", "поштучно", "минимальный заказ"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Какая цена за м² стены из блоков HAUS?",
    answer:
      "Стоимость 1 м² стены включает блоки, бетон, арматуру и работу. Приблизительная стоимость 45-65 EUR/м² в зависимости от типа блоков и сложности.",
    category: "pricing",
    tags: ["цена за м²", "стоимость стены", "EUR"],
    product: "общее",
    language: "ru",
    priority: 8,
  },

  // Литовские FAQ - Стоимость
  {
    question: "Ar ekonomiškas statymas iš HAUS blokų?",
    answer:
      "Taip, ekonomija pasiekiama dėl: greito montavimo (ekonomija darbo užmokesčio), šlapių procesų nebuvimo, mažesnio medžiagų kiekio. Bendra ekonomija 15-25%.",
    category: "pricing",
    tags: ["ekonomija", "kaina", "greitas montavimas", "medžiagos"],
    product: "bendras",
    language: "lt",
    priority: 9,
  },
  {
    question: "Kokios nuolaidos teikiamos dideliems kiekiams?",
    answer:
      "Nuolaidos teikiamos nuo 5 paletų. Konkretūs sąlygos priklauso nuo kiekio ir pristatymo regiono. Kreipkitės į vadybininkus: +37064608801",
    category: "pricing",
    tags: ["nuolaidos", "kiekis", "paletės", "sąlygos"],
    product: "bendras",
    language: "lt",
    priority: 7,
  },
  {
    question: "Kiek kainuoja blokų pristatymas?",
    answer:
      "Pristatymo kaina priklauso nuo atstumo ir užsakymo kiekio. Užsakant nuo 10 paletų pristatymas Lietuvoje gali būti nemokamas. Tikslinkite pas vadybininkus.",
    category: "pricing",
    tags: ["pristatymas", "kaina", "atstumas", "kiekis"],
    product: "bendras",
    language: "lt",
    priority: 6,
  },

  // Английские FAQ - Стоимость
  {
    question: "Is construction with HAUS blocks more economical?",
    answer:
      "Yes, savings are achieved through: fast installation (labor cost savings), absence of wet processes, fewer materials. Total savings 15-25%.",
    category: "pricing",
    tags: ["savings", "cost", "fast installation", "materials"],
    product: "general",
    language: "en",
    priority: 9,
  },
  {
    question: "What discounts are offered for large volumes?",
    answer:
      "Discounts are offered from 5 pallets. Specific conditions depend on volume and delivery region. Contact managers: +37064608801",
    category: "pricing",
    tags: ["discounts", "volume", "pallets", "conditions"],
    product: "general",
    language: "en",
    priority: 7,
  },

  // ДОСТАВКА (Delivery) - 10 вопросов

  // Русские FAQ - Доставка
  {
    question: "Как происходит доставка блоков?",
    answer:
      "Доставка осуществляется на паллетах автотранспортом. Необходим подъезд для грузовика и возможность разгрузки краном-манипулятором или погрузчиком.",
    category: "delivery",
    tags: ["доставка", "паллеты", "разгрузка", "кран-манипулятор"],
    product: "общее",
    language: "ru",
    priority: 8,
  },
  {
    question: "Какие сроки поставки блоков?",
    answer:
      "Стандартные сроки поставки: 3-7 рабочих дней по Литве, 7-14 дней в другие страны. При больших объемах сроки могут увеличиваться.",
    category: "delivery",
    tags: ["сроки", "поставка", "рабочие дни", "объемы"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "В какие страны осуществляется доставка?",
    answer:
      "Основная доставка - по Литве и странам Балтии. Доставка в другие страны ЕС возможна по договоренности. Уточняйте условия у менеджеров.",
    category: "delivery",
    tags: ["страны", "Балтия", "ЕС", "условия"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Можно ли заказать доставку в выходные?",
    answer:
      "Стандартная доставка осуществляется в рабочие дни. Доставка в выходные возможна по предварительной договоренности за дополнительную плату.",
    category: "delivery",
    tags: ["выходные", "рабочие дни", "дополнительная плата"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Что нужно подготовить к приезду машины с блоками?",
    answer:
      "Подготовьте: твердое покрытие для проезда, место для разгрузки паллет, доступ крана-манипулятора к месту складирования, представителя для приемки.",
    category: "delivery",
    tags: ["подготовка", "покрытие", "разгрузка", "приемка"],
    product: "общее",
    language: "ru",
    priority: 7,
  },

  // Литовские FAQ - Доставка
  {
    question: "Kaip vyksta blokų pristatymas?",
    answer:
      "Pristatymas vykdomas paletėmis autotransportu. Reikalingas privažiavimas sunkvežimiui ir galimybė iškrauti kranu-manipuliatoriumi arba krautuvu.",
    category: "delivery",
    tags: ["pristatymas", "paletės", "iškrovimas", "kranas-manipuliatorius"],
    product: "bendras",
    language: "lt",
    priority: 8,
  },
  {
    question: "Kokie blokų pristatymo terminai?",
    answer:
      "Standartiniai pristatymo terminai: 3-7 darbo dienos Lietuvoje, 7-14 dienų į kitas šalis. Didelių kiekių pristatymo terminai gali padidėti.",
    category: "delivery",
    tags: ["terminai", "pristatymas", "darbo dienos", "kiekiai"],
    product: "bendras",
    language: "lt",
    priority: 7,
  },
  {
    question: "Į kokias šalis vykdomas pristatymas?",
    answer:
      "Pagrindinis pristatymas - Lietuvoje ir Baltijos šalyse. Pristatymas į kitas ES šalis galimas susitarus. Tikslinkite sąlygas pas vadybininkus.",
    category: "delivery",
    tags: ["šalys", "Baltija", "ES", "sąlygos"],
    product: "bendras",
    language: "lt",
    priority: 6,
  },

  // Английские FAQ - Доставка
  {
    question: "How are blocks delivered?",
    answer:
      "Delivery is carried out on pallets by truck. Access for the truck and possibility of unloading with a crane-manipulator or forklift is required.",
    category: "delivery",
    tags: ["delivery", "pallets", "unloading", "crane-manipulator"],
    product: "general",
    language: "en",
    priority: 8,
  },
  {
    question: "What are the delivery times for blocks?",
    answer:
      "Standard delivery times: 3-7 working days in Lithuania, 7-14 days to other countries. For large volumes, delivery times may increase.",
    category: "delivery",
    tags: ["delivery times", "working days", "volumes"],
    product: "general",
    language: "en",
    priority: 7,
  },

  // Дополнительные FAQ для достижения 100+

  // Проблемы и решения
  {
    question: "Что делать при появлении высолов на блоках?",
    answer:
      "Высолы удаляются специальными средствами после полного высыхания. Для предотвращения используйте качественный цемент и избегайте переувлажнения.",
    category: "installation",
    tags: ["высолы", "качество", "цемент", "влажность"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Можно ли строить из блоков в дождливую погоду?",
    answer:
      "Монтаж блоков можно проводить в дождь, но заливку бетона следует отложить до прекращения осадков или использовать защитные покрытия.",
    category: "installation",
    tags: ["дождь", "погода", "заливка", "защита"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Как хранить блоки на стройплощадке?",
    answer:
      "Блоки хранятся на паллетах под навесом или пленкой. Избегайте прямого контакта с землей. Паллеты устанавливайте на ровную твердую поверхность.",
    category: "installation",
    tags: ["хранение", "паллеты", "навес", "защита"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Какой класс бетона использовать для заливки блоков?",
    answer:
      "Рекомендуется использовать бетон класса B15-B20 (М200-М250). Для особо ответственных конструкций - B25 (М300). Консультируйтесь с проектировщиком.",
    category: "technical",
    tags: ["класс бетона", "B15", "B20", "B25", "M200", "M250", "M300"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
  {
    question: "Нужна ли дополнительная теплоизоляция стен из блоков HAUS?",
    answer:
      "Для соответствия современным требованиям энергоэффективности рекомендуется дополнительное утепление минватой или пенополистиролом толщиной 100-150 мм.",
    category: "technical",
    tags: ["теплоизоляция", "утепление", "энергоэффективность", "минвата"],
    product: "общее",
    language: "ru",
    priority: 8,
  },
  {
    question: "Какая отделка подходит для стен из блоков HAUS?",
    answer:
      "Подходит любая отделка: штукатурка, облицовочный кирпич, сайдинг, навесные вентилируемые фасады. Поверхность блоков обеспечивает хорошую адгезию.",
    category: "installation",
    tags: ["отделка", "штукатурка", "фасад", "адгезия"],
    product: "общее",
    language: "ru",
    priority: 7,
  },

  // Сравнения с другими материалами
  {
    question: "Чем блоки HAUS лучше керамзитобетонных блоков?",
    answer:
      "Блоки HAUS обеспечивают монолитную конструкцию, не требуют кладочного раствора, монтируются быстрее и имеют лучшую геометрию.",
    category: "technical",
    tags: ["сравнение", "керамзитобетон", "монолит", "геометрия"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "В чем отличие от газобетонных блоков?",
    answer:
      "Блоки HAUS создают железобетонную конструкцию после заливки, в отличие от газобетона. Это обеспечивает большую прочность и долговечность.",
    category: "technical",
    tags: ["газобетон", "железобетон", "прочность", "долговечность"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Почему блоки HAUS лучше обычной опалубки?",
    answer:
      "Блоки HAUS остаются в конструкции, обеспечивая дополнительную изоляцию и прочность. Не требуется демонтаж опалубки.",
    category: "technical",
    tags: ["опалубка", "изоляция", "демонтаж"],
    product: "общее",
    language: "ru",
    priority: 6,
  },

  // Специальные применения
  {
    question: "Можно ли использовать блоки для строительства септика?",
    answer:
      "Да, блоки HAUS подходят для септиков и очистных сооружений. Требуется качественная внутренняя гидроизоляция и армирование.",
    category: "application",
    tags: ["септик", "очистные сооружения", "гидроизоляция"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Подходят ли блоки для строительства погреба?",
    answer:
      "Блоки HAUS отлично подходят для погребов. Обеспечивают хорошую теплоизоляцию и прочность. Необходима гидроизоляция от грунтовых вод.",
    category: "application",
    tags: ["погреб", "теплоизоляция", "грунтовые воды"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Можно ли строить ограждения из блоков HAUS?",
    answer:
      "Да, блоки подходят для строительства заборов и ограждений. Обеспечивают прочность и долговечность конструкции.",
    category: "application",
    tags: ["забор", "ограждение", "прочность"],
    product: "общее",
    language: "ru",
    priority: 5,
  },

  // Дополнительные технические вопросы
  {
    question: "Какова паропроницаемость блоков HAUS?",
    answer:
      "Паропроницаемость блоков HAUS составляет 0,11-0,15 мг/(м·ч·Па), что обеспечивает нормальный влагообмен в конструкции стены.",
    category: "technical",
    tags: ["паропроницаемость", "влагообмен", "стена"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Какая звукоизоляция у стен из блоков HAUS?",
    answer:
      "Стены из блоков HAUS толщиной 20 см обеспечивают звукоизоляцию 45-50 дБ, что соответствует нормативным требованиям для жилых домов.",
    category: "technical",
    tags: ["звукоизоляция", "дБ", "нормативы"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Каков срок службы конструкций из блоков HAUS?",
    answer:
      "При правильном монтаже и эксплуатации срок службы конструкций из блоков HAUS составляет не менее 100 лет.",
    category: "technical",
    tags: ["срок службы", "долговечность", "100 лет"],
    product: "общее",
    language: "ru",
    priority: 6,
  },

  // Вопросы по безопасности
  {
    question: "Безопасны ли блоки HAUS для здоровья?",
    answer:
      "Блоки HAUS изготовлены из экологически чистых материалов, не содержат вредных веществ и безопасны для здоровья человека.",
    category: "technical",
    tags: ["безопасность", "экология", "здоровье"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Выделяют ли блоки вредные вещества?",
    answer:
      "Нет, блоки HAUS не выделяют вредных веществ и соответствуют всем экологическим нормам и стандартам качества.",
    category: "technical",
    tags: ["вредные вещества", "экология", "стандарты"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Огнестойкость конструкций из блоков HAUS?",
    answer:
      "Конструкции из блоков HAUS имеют высокую огнестойкость (REI 240 - 4 часа), что превышает требования для жилых зданий.",
    category: "technical",
    tags: ["огнестойкость", "REI 240", "4 часа"],
    product: "общее",
    language: "ru",
    priority: 7,
  },

  // Недостающие блоки HAUS - P6-30
  {
    question: "Что такое блоки HAUS P6-30?",
    answer:
      "HAUS P6-30 - несъемная опалубка из бетона высотой 30 см для фундаментов и стен. Размеры: 498×198×300 мм. Имеют большую высоту по сравнению с P6-20, что увеличивает производительность кладки.",
    category: "technical",
    tags: ["P6-30", "опалубка", "фундамент", "30см"],
    product: "P6-30",
    language: "ru",
    priority: 9,
  },
  {
    question: "В чем отличие P6-30 от P6-20?",
    answer:
      "Основное отличие - высота блока: P6-30 имеет высоту 300 мм против 250 мм у P6-20. Это позволяет быстрее набирать высоту стены и сокращает количество рядов кладки.",
    category: "technical",
    tags: ["P6-30", "P6-20", "отличие", "высота"],
    product: "P6-30",
    language: "ru",
    priority: 8,
  },
  {
    question: "Сколько бетона нужно для P6-30?",
    answer:
      "Для заполнения одного блока P6-30 требуется 0.018 м³ бетона. На 1 метр стены высотой 30 см нужно 0.036 м³ бетона.",
    category: "calculation",
    tags: ["P6-30", "бетон", "расход", "расчет"],
    product: "P6-30",
    language: "ru",
    priority: 8,
  },

  // Блоки P25
  {
    question: "Что такое блоки HAUS P25?",
    answer:
      "HAUS P25 - блоки-опалубка толщиной 25 см для строительства толстых фундаментных и несущих стен. Обеспечивают повышенную прочность и теплоизоляцию.",
    category: "technical",
    tags: ["P25", "опалубка", "25см", "толстые стены"],
    product: "P25",
    language: "ru",
    priority: 8,
  },
  {
    question: "Где применяются блоки P25?",
    answer:
      "P25 используются для: толстых фундаментных стен, несущих стен многоэтажных зданий, подпорных стен с высокими нагрузками, цокольных этажей.",
    category: "application",
    tags: ["P25", "толстые стены", "многоэтажные", "нагрузки"],
    product: "P25",
    language: "ru",
    priority: 7,
  },

  // Блоки S6
  {
    question: "Что такое блоки HAUS S6?",
    answer:
      "HAUS S6 - стеновые блоки толщиной 15 см для внутренних перегородок и ненесущих стен. Легкие, быстро монтируются, обеспечивают хорошую звукоизоляцию.",
    category: "technical",
    tags: ["S6", "перегородки", "15см", "ненесущие"],
    product: "S6",
    language: "ru",
    priority: 8,
  },
  {
    question: "Можно ли из S6 делать несущие стены?",
    answer:
      "Блоки S6 предназначены для ненесущих перегородок. Для несущих стен используйте S25 или блоки-опалубку P-серии с заливкой бетоном.",
    category: "application",
    tags: ["S6", "несущие стены", "ограничения"],
    product: "S6",
    language: "ru",
    priority: 7,
  },

  // Блоки SM6
  {
    question: "Что такое блоки HAUS SM6?",
    answer:
      "HAUS SM6 - модифицированные стеновые блоки с улучшенными характеристиками для кладки стен. Имеют оптимизированную геометрию и повышенную прочность.",
    category: "technical",
    tags: ["SM6", "модифицированные", "улучшенные"],
    product: "SM6",
    language: "ru",
    priority: 7,
  },
  {
    question: "В чем отличие SM6 от S6?",
    answer:
      "SM6 имеют модифицированную конструкцию с улучшенными прочностными характеристиками и оптимизированной системой соединения блоков.",
    category: "technical",
    tags: ["SM6", "S6", "отличие", "прочность"],
    product: "SM6",
    language: "ru",
    priority: 6,
  },

  // Блоки SP
  {
    question: "Что такое блоки HAUS SP?",
    answer:
      "HAUS SP - специальные блоки для перегородок и внутренних стен. Обеспечивают отличную звукоизоляцию и быстрый монтаж.",
    category: "technical",
    tags: ["SP", "перегородки", "звукоизоляция"],
    product: "SP",
    language: "ru",
    priority: 7,
  },
  {
    question: "Какая звукоизоляция у блоков SP?",
    answer:
      "Блоки HAUS SP обеспечивают звукоизоляцию до 52 дБ, что превышает требования для межквартирных перегородок.",
    category: "technical",
    tags: ["SP", "звукоизоляция", "52дБ", "перегородки"],
    product: "SP",
    language: "ru",
    priority: 6,
  },

  // Вентиляционные блоки VB-2
  {
    question: "Что такое блоки HAUS VB-2?",
    answer:
      "HAUS VB-2 - специальные вентиляционные блоки для создания вентиляционных каналов в стенах. Обеспечивают естественную вентиляцию помещений.",
    category: "technical",
    tags: ["VB-2", "вентиляция", "каналы"],
    product: "VB-2",
    language: "ru",
    priority: 6,
  },
  {
    question: "Где устанавливаются блоки VB-2?",
    answer:
      "VB-2 устанавливаются в стенах для создания вентиляционных каналов в кухнях, ванных комнатах, санузлах и других помещениях, требующих вентиляции.",
    category: "application",
    tags: ["VB-2", "установка", "кухня", "ванная"],
    product: "VB-2",
    language: "ru",
    priority: 6,
  },

  // Литовские FAQ для новых блоков
  {
    question: "Kas yra HAUS P6-30 blokai?",
    answer:
      "HAUS P6-30 - nesunaikinama betoninė klojinė 30 cm aukščio pamatams ir sienoms. Išmatavimai: 498×198×300 mm. Didesnis aukštis padidina mūrijimo produktyvumą.",
    category: "technical",
    tags: ["P6-30", "klojinė", "pamatas", "30cm"],
    product: "P6-30",
    language: "lt",
    priority: 8,
  },
  {
    question: "Kas yra HAUS S6 blokai?",
    answer:
      "HAUS S6 - sienų blokai 15 cm storio vidaus pertvaroms ir nelaikančioms sienoms. Lengvi, greitai montuojami, užtikrina gerą garso izoliaciją.",
    category: "technical",
    tags: ["S6", "pertvaros", "15cm", "nelaikančios"],
    product: "S6",
    language: "lt",
    priority: 7,
  },
  {
    question: "Kas yra HAUS VB-2 blokai?",
    answer:
      "HAUS VB-2 - specialūs ventiliacijos blokai ventiliacijos kanalams sienose kurti. Užtikrina natūralią patalpų ventiliaciją.",
    category: "technical",
    tags: ["VB-2", "ventiliacija", "kanalai"],
    product: "VB-2",
    language: "lt",
    priority: 6,
  },

  // Английские FAQ для новых блоков
  {
    question: "What are HAUS P6-30 blocks?",
    answer:
      "HAUS P6-30 are permanent concrete formwork blocks 30 cm high for foundations and walls. Dimensions: 498×198×300 mm. Greater height increases masonry productivity.",
    category: "technical",
    tags: ["P6-30", "formwork", "foundation", "30cm"],
    product: "P6-30",
    language: "en",
    priority: 8,
  },
  {
    question: "What are HAUS S6 blocks?",
    answer:
      "HAUS S6 are wall blocks 15 cm thick for interior partitions and non-load-bearing walls. Lightweight, quick to install, provide good sound insulation.",
    category: "technical",
    tags: ["S6", "partitions", "15cm", "non-load-bearing"],
    product: "S6",
    language: "en",
    priority: 7,
  },
  {
    question: "What are HAUS VB-2 blocks?",
    answer:
      "HAUS VB-2 are special ventilation blocks for creating ventilation channels in walls. Ensure natural room ventilation.",
    category: "technical",
    tags: ["VB-2", "ventilation", "channels"],
    product: "VB-2",
    language: "en",
    priority: 6,
  },

  // Вопросы по безопасности
  {
    question: "Безопасны ли блоки HAUS для здоровья?",
    answer:
      "Блоки HAUS изготовлены из экологически чистых материалов, не содержат вредных веществ и безопасны для здоровья человека.",
    category: "technical",
    tags: ["безопасность", "экология", "здоровье"],
    product: "общее",
    language: "ru",
    priority: 6,
  },
  {
    question: "Выделяют ли блоки вредные вещества?",
    answer:
      "Нет, блоки HAUS не выделяют вредных веществ и соответствуют всем экологическим нормам и стандартам качества.",
    category: "technical",
    tags: ["вредные вещества", "экология", "стандарты"],
    product: "общее",
    language: "ru",
    priority: 5,
  },
  {
    question: "Огнестойкость конструкций из блоков HAUS?",
    answer:
      "Конструкции из блоков HAUS имеют высокую огнестойкость (REI 240 - 4 часа), что превышает требования для жилых зданий.",
    category: "technical",
    tags: ["огнестойкость", "REI 240", "4 часа"],
    product: "общее",
    language: "ru",
    priority: 7,
  },
];

// Функция для загрузки расширенных FAQ в сервис
export const loadExpandedFAQs = (faqService: any) => {
  expandedFAQs.forEach((faq) => {
    faqService.addFAQ(faq);
  });
  console.log(`✅ Загружено ${expandedFAQs.length} дополнительных FAQ`);
};
