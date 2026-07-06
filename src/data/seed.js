// Initial character sheet — inserted once when a user first signs up.
// After that, everything is editable in the database via the app UI.

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

export const SEED_ACTIONS = [
  { label: '💪 Тренування 45+ хв', is_positive: true, global_xp: 15, effects: { BODY: { muscle: 10, endurance: 8, activity: 12 }, ENERGY: { drive: 4 }, DISCIPLINE: { regularity: 5, hardtasks: 7 } } },
  { label: '🚶 8k+ кроків', is_positive: true, global_xp: 6, effects: { BODY: { activity: 8, endurance: 5 }, ENERGY: { clarity: 4 } } },
  { label: '🥗 Здорове харчування', is_positive: true, global_xp: 5, effects: { BODY: { nutrition: 10 } } },
  { label: '🌙 Ліг до 00:30', is_positive: true, global_xp: 10, effects: { SLEEP: { regularity: 10, hygiene: 8 }, ENERGY: { morning: 5 } } },
  { label: '☀️ Прокинувся відпочилим', is_positive: true, global_xp: 6, effects: { SLEEP: { restoration: 10 }, ENERGY: { morning: 6 } } },
  { label: '📖 1 год навчання', is_positive: true, global_xp: 12, effects: { INTELLECT: { study: 10, focus: 6 } } },
  { label: '📚 30 хв читання', is_positive: true, global_xp: 8, effects: { INTELLECT: { focus: 6, memory: 4 } } },
  { label: '✅ Виконав план дня', is_positive: true, global_xp: 15, effects: { DISCIPLINE: { regularity: 10, habits: 8 } } },
  { label: '🔥 Зробив неприємну задачу', is_positive: true, global_xp: 12, effects: { DISCIPLINE: { hardtasks: 10, selfcontrol: 6 } } },
  { label: '🚫 День без порно', is_positive: true, global_xp: 8, effects: { DISCIPLINE: { dopamine: 8 }, MALE_HEALTH: { recovery: 6 } } },
  { label: '👋 Small talk з незнайомим', is_positive: true, global_xp: 10, effects: { SOCIAL: { newpeople: 8, confidence: 5 } } },
  { label: '🤝 Нове знайомство', is_positive: true, global_xp: 20, effects: { SOCIAL: { newpeople: 15, confidence: 8 } } },
  { label: '🎉 Вийшов на подію', is_positive: true, global_xp: 18, effects: { SOCIAL: { groups: 10, adaptability: 8 } } },
  { label: '🚿 Душ + чистка зубів', is_positive: true, global_xp: 5, effects: { HYGIENE: { personal: 10 } } },
  { label: '🧹 Прибирання кімнати', is_positive: true, global_xp: 8, effects: { HYGIENE: { room: 10, space: 6 } } },
  { label: '⚡ Вийшов з avoidance', is_positive: true, global_xp: 15, effects: { PSYCHE: { stress: 10, respect: 8 } } },
  { label: '✍️ Рефлексія / щоденник', is_positive: true, global_xp: 6, effects: { PSYCHE: { respect: 4 } } },
  { label: '📱 Doomscrolling 5+ год', is_positive: false, global_xp: 0, effects: { DISCIPLINE: { dopamine: -6, organization: -5 }, ENERGY: { clarity: -8 } } },
  { label: '🌑 Ліг після 02:00', is_positive: false, global_xp: 0, effects: { SLEEP: { regularity: -8, hygiene: -5 } } },
  { label: '🍟 Фастфуд / цукор', is_positive: false, global_xp: 0, effects: { BODY: { nutrition: -8 } } },
  { label: '🔕 День у ізоляції', is_positive: false, global_xp: 0, effects: { SOCIAL: { groups: -4, confidence: -3 } } },
]

export const SEED_QUESTS = [
  { type: 'daily', title: 'Ранковий ритуал', descr: 'Душ + зуби + застелити ліжко', xp: 15 },
  { type: 'daily', title: 'Рух тіла', descr: 'Фізична активність 30+ хв', xp: 20 },
  { type: 'daily', title: 'Без нічного скролу', descr: 'Не брати телефон після 23:00', xp: 15 },
  { type: 'weekly', title: '3 тренування', descr: '3 повноцінних тренування', xp: 60, total: 3, progress: 0 },
  { type: 'weekly', title: 'Режим сну', descr: "Лягати до 01:00 п'ять разів", xp: 50, total: 5, progress: 0 },
  { type: 'longterm', title: 'Тиждень без порно', descr: '7 днів поспіль', xp: 100, total: 7, progress: 0 },
  { type: 'longterm', title: 'Місяць залу', descr: '12+ тренувань', xp: 200, total: 12, progress: 0 },
]
