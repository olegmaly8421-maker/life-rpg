// Стартовий персонаж — створюється один раз при першій реєстрації.
// Далі все редагується в застосунку.

export const SEED_STATS = [
  { key: 'BODY', name: 'Body', icon: '⚔️', color: '#EF4444', substats: [
    ['muscle', "М'язова форма", 25], ['endurance', 'Витривалість', 20], ['strength', 'Фізична сила', 25],
    ['flexibility', 'Гнучкість', 20], ['activity', 'Фіз. активність', 15], ['nutrition', 'Харчування', 18],
    ['composition', 'Склад тіла', 40], ['grooming', 'Догляд за тілом', 35],
  ]},
  { key: 'ENERGY', name: 'Energy', icon: '⚡', color: '#F59E0B', substats: [
    ['morning', 'Ранкова енергія', 10], ['daily', 'Денна продуктивність', 18], ['clarity', 'Ментальна ясність', 20],
    ['stamina', 'Витривалість дня', 15], ['drive', 'Внутрішній драйв', 15], ['recovery', 'Відновлення', 18],
  ]},
  { key: 'SLEEP', name: 'Sleep', icon: '😴', color: '#818CF8', substats: [
    ['regularity', 'Регулярність', 8], ['falling', 'Якість засинання', 20], ['restoration', 'Відновлення', 10],
    ['schedule', 'Стабільність', 5], ['drowsiness', 'Денна сонливість', 12], ['hygiene', 'Sleep hygiene', 15],
  ]},
  { key: 'INTELLECT', name: 'Intellect', icon: '🧠', color: '#8B5CF6', substats: [
    ['analytics', 'Аналітичність', 70], ['reflection', 'Саморефлексія', 72], ['critical', 'Критичне мислення', 62],
    ['focus', 'Концентрація', 25], ['memory', "Пам'ять", 30], ['speed', 'Швидкість мислення', 45],
    ['study', 'Навчальна дисципліна', 20], ['creativity', 'Креативність', 55],
  ]},
  { key: 'KNOWLEDGE', name: 'Knowledge', icon: '📚', color: '#10B981', substats: [
    ['geopolitics', 'Геополітика', 65], ['history', 'Історія XX ст.', 58], ['psychology', 'Психологія', 55],
    ['culture', 'Культурний кругозір', 35], ['science', 'Наука', 30], ['economics', 'Економіка', 25],
    ['arts', 'Мистецтво / Кіно', 35], ['practical', 'Практичне знання', 30],
  ]},
  { key: 'PSYCHE', name: 'Psyche', icon: '🧘', color: '#EC4899', substats: [
    ['anxiety', 'Тривожність', 25], ['selfesteem', 'Самооцінка', 22], ['stability', 'Емоц. стабільність', 28],
    ['meaning', 'Відчуття сенсу', 30], ['respect', 'Самоповага', 28], ['chaos', 'Внутрішній хаос', 20],
    ['stress', 'Стійкість до стресу', 40], ['depression', 'Депресивність', 30],
  ]},
  { key: 'SOCIAL', name: 'Social', icon: '🗣️', color: '#06B6D4', substats: [
    ['smalltalk', 'Small Talk', 30], ['groups', 'Комфорт у групах', 18], ['newpeople', 'Нові знайомства', 15],
    ['friendship', 'Підтримка дружби', 35], ['confidence', 'Соц. впевненість', 18], ['romance', 'Романтична сфера', 8],
    ['socanxiety', 'Соц. тривожність', 20], ['adaptability', 'Адаптивність', 30],
  ]},
  { key: 'DISCIPLINE', name: 'Discipline', icon: '🧩', color: '#F97316', substats: [
    ['regularity', 'Регулярність', 15], ['selfcontrol', 'Самоконтроль', 20], ['completion', 'Доведення справ', 10],
    ['impulse', 'Контроль імпульсів', 22], ['dopamine', 'Контроль дофаміну', 15], ['organization', 'Організованість', 18],
    ['habits', 'Стабільність звичок', 12], ['hardtasks', 'Робити неприємне', 28],
  ]},
  { key: 'CHARISMA', name: 'Charisma', icon: '🎭', color: '#EAB308', substats: [
    ['voice', 'Голос', 25], ['bodylang', 'Мова тіла', 28], ['confidence', 'Впевненість', 22],
    ['energy', 'Енергетика', 25], ['style', 'Стиль', 35], ['potential', '✦ Зовн. потенціал', 60, true],
    ['presentation', 'Подача себе', 25], ['attraction', 'Привабливість', 32],
  ]},
  { key: 'CAREER', name: 'Career', icon: '💰', color: '#84CC16', substats: [
    ['independence', 'Фін. незалежність', 5], ['skills', 'Проф. навички', 18], ['languages', 'Мовні навички', 22],
    ['potential', 'Перспективність', 40], ['understanding', "Розуміння кар'єри", 20], ['autonomy', 'Самостійність', 25],
    ['competitiveness', 'Конкурентність', 15],
  ]},
  { key: 'EXPERIENCE', name: 'Experience', icon: '🗺️', color: '#0EA5E9', substats: [
    ['travel', 'Подорожі', 45], ['newthings', 'Нові ситуації', 35], ['independence', 'Самостійне життя', 40],
    ['social', 'Соц. досвід', 18], ['romance', 'Романтичний досвід', 5], ['richness', 'Насиченість', 22],
    ['adaptation', 'Адаптація', 55], ['risk', 'Ризик / Вихід з ЗК', 40],
  ]},
  { key: 'HYGIENE', name: 'Hygiene', icon: '🧹', color: '#A78BFA', substats: [
    ['personal', 'Особиста гігієна', 35], ['room', 'Чистота кімнати', 20], ['space', 'Організованість', 18],
    ['clothes', 'Догляд за одягом', 30], ['routine', 'Побут. дисципліна', 28], ['social', 'Соц. охайність', 48],
  ]},
  { key: 'MALE_HEALTH', name: 'Male Health', icon: '♂️', color: '#F43F5E', substats: [
    ['libido', 'Лібідо', 30], ['erection', 'Ерекція', 15], ['sexenergy', 'Сексуальна енергія', 18],
    ['hormonal', 'Гормон. самопочуття', 20], ['confidence', 'Впевн. в сексуальності', 10], ['recovery', 'Відновлення', 15],
    ['sensitivity', 'Чутливість', 25],
  ]},
  { key: 'HEALTH', name: 'Health', icon: '🩺', color: '#34D399', substats: [
    ['back', 'Стан спини', 22], ['overall', 'Загальне самопочуття', 25], ['discomfort', 'Хронічний дискомфорт', 20],
    ['comfort', 'Фіз. комфорт', 28], ['nervous', 'Нервова система', 18], ['feeling', "Відчуття здоров'я", 20],
  ]},
]

// stat_xp формат: { STAT_KEY: { subs: { subKey: xp }, stat: xp } }
const A = (label, global_xp, stat_xp, opts = {}) => ({
  label, global_xp, stat_xp,
  is_positive: opts.neg ? false : true,
  track_streak: opts.streak || false,
  descr: opts.descr || null,
  category: opts.cat || null,
})

export const SEED_ACTIONS = [
  A('💪 Тренування 45+ хв', 15, {
    BODY: { subs: { muscle: 10, endurance: 8, activity: 12 }, stat: 0 },
    ENERGY: { subs: { drive: 4 }, stat: 0 },
    DISCIPLINE: { subs: { regularity: 5, hardtasks: 7 }, stat: 0 },
  }, { streak: true, cat: 'Тіло' }),
  A('🚶 8k+ кроків', 6, {
    BODY: { subs: { activity: 8, endurance: 5 }, stat: 0 },
    ENERGY: { subs: { clarity: 4 }, stat: 0 },
  }, { streak: true, cat: 'Тіло' }),
  A('🥗 Здорове харчування', 5, { BODY: { subs: { nutrition: 10 }, stat: 0 } }, { streak: true, cat: 'Тіло' }),
  A('🌙 Ліг до 00:30', 10, {
    SLEEP: { subs: { regularity: 10, hygiene: 8 }, stat: 0 },
    ENERGY: { subs: { morning: 5 }, stat: 0 },
  }, { streak: true, cat: 'Сон' }),
  A('☀️ Прокинувся відпочилим', 6, {
    SLEEP: { subs: { restoration: 10 }, stat: 0 },
    ENERGY: { subs: { morning: 6 }, stat: 0 },
  }, { cat: 'Сон' }),
  A('📖 1 год навчання', 12, { INTELLECT: { subs: { study: 10, focus: 6 }, stat: 0 } }, { streak: true, cat: 'Розум' }),
  A('📚 30 хв читання', 8, { INTELLECT: { subs: { focus: 6, memory: 4 }, stat: 0 } }, { streak: true, cat: 'Розум' }),
  A('✅ Виконав план дня', 15, { DISCIPLINE: { subs: { regularity: 10, habits: 8 }, stat: 0 } }, { streak: true, cat: 'Дисципліна' }),
  A('🔥 Зробив неприємну задачу', 12, { DISCIPLINE: { subs: { hardtasks: 10, selfcontrol: 6 }, stat: 0 } }, { cat: 'Дисципліна' }),
  A('🚫 День без порно', 8, {
    DISCIPLINE: { subs: { dopamine: 8 }, stat: 0 },
    MALE_HEALTH: { subs: { recovery: 6 }, stat: 0 },
  }, { streak: true, cat: 'Дисципліна' }),
  A('👋 Small talk з незнайомим', 10, { SOCIAL: { subs: { newpeople: 8, confidence: 5 }, stat: 0 } }, { cat: 'Соціум' }),
  A('🤝 Нове знайомство', 20, { SOCIAL: { subs: { newpeople: 15, confidence: 8 }, stat: 0 } }, { cat: 'Соціум' }),
  A('🎉 Вийшов на подію', 18, { SOCIAL: { subs: { groups: 10, adaptability: 8 }, stat: 0 } }, { cat: 'Соціум' }),
  A('🚿 Душ + чистка зубів', 5, { HYGIENE: { subs: { personal: 10 }, stat: 0 } }, { streak: true, cat: 'Побут' }),
  A('🧹 Прибирання кімнати', 8, { HYGIENE: { subs: { room: 10, space: 6 }, stat: 0 } }, { cat: 'Побут' }),
  A('⚡ Вийшов з avoidance', 15, { PSYCHE: { subs: { stress: 10, respect: 8 }, stat: 0 } }, { cat: 'Психіка' }),
  A('✍️ Рефлексія / щоденник', 6, { PSYCHE: { subs: { respect: 4 }, stat: 0 } }, { streak: true, cat: 'Психіка' }),

  A('📱 Doomscrolling 5+ год', -5, {
    DISCIPLINE: { subs: { dopamine: -6, organization: -5 }, stat: 0 },
    ENERGY: { subs: { clarity: -8 }, stat: 0 },
  }, { neg: true, cat: 'Дебаф' }),
  A('🌑 Ліг після 02:00', -4, { SLEEP: { subs: { regularity: -8, hygiene: -5 }, stat: 0 } }, { neg: true, cat: 'Дебаф' }),
  A('🍟 Фастфуд / цукор', -3, { BODY: { subs: { nutrition: -8 }, stat: 0 } }, { neg: true, cat: 'Дебаф' }),
  A('🔕 День у ізоляції', -3, { SOCIAL: { subs: { groups: -4, confidence: -3 }, stat: 0 } }, { neg: true, cat: 'Дебаф' }),
]

export const SEED_QUESTS = [
  { type: 'daily', title: 'Ранковий ритуал', descr: 'Душ + зуби + застелити ліжко', xp: 15 },
  { type: 'daily', title: 'Рух тіла', descr: 'Фізична активність 30+ хв', xp: 20 },
  { type: 'weekly', title: '3 тренування', descr: '3 повноцінних тренування', xp: 60, total: 3, progress: 0 },
  { type: 'weekly', title: 'Режим сну', descr: "Лягати до 01:00 п'ять разів", xp: 50, total: 5, progress: 0 },
  { type: 'longterm', title: 'Тиждень без порно', descr: '7 днів поспіль', xp: 100, total: 7, progress: 0 },
  { type: 'longterm', title: 'Місяць залу', descr: '12+ тренувань', xp: 200, total: 12, progress: 0 },
]

export const SEED_TIERS = [
  { days: 3,  bonus_global_xp: 15,  bonus_multiplier: 1.0, stat_xp: {}, label: 'Розігрів' },
  { days: 7,  bonus_global_xp: 50,  bonus_multiplier: 1.1, stat_xp: {}, label: 'Тиждень' },
  { days: 14, bonus_global_xp: 120, bonus_multiplier: 1.2, stat_xp: {}, label: 'Два тижні' },
  { days: 30, bonus_global_xp: 300, bonus_multiplier: 1.3, stat_xp: {}, label: 'Місяць' },
]
