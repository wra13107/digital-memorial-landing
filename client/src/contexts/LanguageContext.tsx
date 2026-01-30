import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  ru: {
    // Header
    'header.login': 'Вход',
    'header.register': 'Регистрация',
    'header.scrollUp': 'Вернуться вверх',

    // Block 1: Hero
    'hero.title': 'Камень хранит имя.',
    'hero.subtitle': 'Мы хранимжизнь.',
    'hero.description': 'Создайте цифровую страницу памяти с фото, видео и голосом близкого человека. Доступна в один клик прямо на месте захоронения через QR-код.',
    'hero.createMemory': 'Создать страницу памяти',
    'hero.viewExample': 'Посмотреть пример',

    // Block 2: Before/After
    'beforeAfter.title': 'От памятника к памяти',
    'beforeAfter.description': 'Традиционный памятник — это камень. Цифровой мемориал — это жизнь, сохранённая в памяти близких.',
    'beforeAfter.traditional': 'Традиционный памятник',
    'beforeAfter.digital': 'Цифровой мемориал',
    'beforeAfter.hint': 'Перетащите для сравнения',

    // Block 3: Three Steps
    'steps.title': 'Три шага к цифровому мемориалу',
    'steps.step1Title': 'Создайте профиль',
    'steps.step1Desc': 'Загрузите фото, видео и аудиозаписи близкого человека',
    'steps.step2Title': 'Поделитесь ссылкой',
    'steps.step2Desc': 'Разместите QR-код на памятнике или поделитесь ссылкой',
    'steps.step3Title': 'Сохраняйте воспоминания',
    'steps.step3Desc': 'Родственники и друзья смогут оставлять свечи и сообщения',

    // Block 4: Digital Capsule
    'capsule.title': 'Цифровая капсула времени',
    'capsule.description': 'Всё, что нужно для сохранения памяти:',
    'capsule.feature1': 'Голос и видео',
    'capsule.feature2': 'Геолокация',
    'capsule.feature3': 'Книга памяти',
    'capsule.feature4': 'Семейное древо',

    // Block 5: Nameplate
    'nameplate.title': 'Качество премиум-класса',
    'nameplate.description': 'Гравировка на граните. Проверка имени перед заказом. Доставка и установка включены.',
    'nameplate.checkName': 'Проверить имя',

    // Block 6: Social Proof
    'socialProof.title': 'Тысячи семей уже сохранили память',
    'socialProof.testimonial': 'Спасибо за возможность сохранить голос моего отца. Это бесценно.',
    'socialProof.author': 'Мария К.',
    'socialProof.stats': '15,000+ мемориалов в 14 странах',

    // Block 7: Pricing
    'pricing.title': 'Выберите свой план',
    'pricing.subscription': 'Подписка',
    'pricing.subscriptionPrice': '99 ₽/мес',
    'pricing.subscriptionFeatures': 'Неограниченные фото и видео\nКнига памяти\nПоддержка 24/7',
    'pricing.legacy': 'Наследие',
    'pricing.legacyPrice': '999 ₽',
    'pricing.legacyFeatures': 'Вечное хранилище\nСемейное древо\nПередача наследникам',
    'pricing.popular': 'Популярно',

    // Block 8: FAQ
    'faq.title': 'Часто задаваемые вопросы',
    'faq.q1': 'Насколько безопасны мои данные?',
    'faq.a1': 'Мы используем шифрование военного уровня и резервное копирование на нескольких серверах.',
    'faq.q2': 'Могу ли я удалить профиль?',
    'faq.a2': 'Да, вы можете удалить профиль в любой момент. Данные будут удалены в течение 30 дней.',
    'faq.q3': 'Как передать доступ наследникам?',
    'faq.a3': 'Вы можете назначить наследников в настройках профиля. Они получат доступ после вашей смерти.',

    // Block 9: Footer
    'footer.title': 'Цифровой мемориал',
    'footer.description': 'Сохраняем память, объединяем семьи',
    'footer.contact': 'Контакты',
    'footer.email': 'info@demoria.ru',
    'footer.phone': '+7 (999) 123-45-67',
    'footer.copyright': '© 2026 Цифровой мемориал. Все права защищены.',

    // Demo Modal
    'demo.name': 'Иван Сидоров',
    'demo.years': '1950 - 2024',
    'demo.location': 'Кладбище Мира, Москва',
    'demo.bio': 'Иван был учителем, отцом и другом. Его жизнь была полна любви к семье и преданности своему делу.',
    'demo.candles': 'свечей зажжено',
    'demo.share': 'Поделиться',
    'demo.write': 'Написать',
  },
  en: {
    // Header
    'header.login': 'Login',
    'header.register': 'Sign Up',
    'header.scrollUp': 'Back to Top',

    // Block 1: Hero
    'hero.title': 'Stone keeps the name.',
    'hero.subtitle': 'We keep the life.',
    'hero.description': 'Create a digital memorial page with photos, videos and voice of a loved one. Available in one click right at the burial site via QR code.',
    'hero.createMemory': 'Create Memorial Page',
    'hero.viewExample': 'View Example',

    // Block 2: Before/After
    'beforeAfter.title': 'From Monument to Memory',
    'beforeAfter.description': 'A traditional monument is stone. A digital memorial is a life, preserved in the hearts of loved ones.',
    'beforeAfter.traditional': 'Traditional Monument',
    'beforeAfter.digital': 'Digital Memorial',
    'beforeAfter.hint': 'Drag to compare',

    // Block 3: Three Steps
    'steps.title': 'Three Steps to a Digital Memorial',
    'steps.step1Title': 'Create a Profile',
    'steps.step1Desc': 'Upload photos, videos and audio recordings of your loved one',
    'steps.step2Title': 'Share the Link',
    'steps.step2Desc': 'Place a QR code on the monument or share the link',
    'steps.step3Title': 'Preserve Memories',
    'steps.step3Desc': 'Family and friends can light candles and leave messages',

    // Block 4: Digital Capsule
    'capsule.title': 'Digital Time Capsule',
    'capsule.description': 'Everything you need to preserve memory:',
    'capsule.feature1': 'Voice and Video',
    'capsule.feature2': 'Geolocation',
    'capsule.feature3': 'Memory Book',
    'capsule.feature4': 'Family Tree',

    // Block 5: Nameplate
    'nameplate.title': 'Premium Quality',
    'nameplate.description': 'Granite engraving. Name verification before order. Delivery and installation included.',
    'nameplate.checkName': 'Check Name',

    // Block 6: Social Proof
    'socialProof.title': 'Thousands of Families Have Preserved Their Memory',
    'socialProof.testimonial': 'Thank you for the opportunity to preserve my father\'s voice. It\'s priceless.',
    'socialProof.author': 'Maria K.',
    'socialProof.stats': '15,000+ memorials in 14 countries',

    // Block 7: Pricing
    'pricing.title': 'Choose Your Plan',
    'pricing.subscription': 'Subscription',
    'pricing.subscriptionPrice': '$1.99/mo',
    'pricing.subscriptionFeatures': 'Unlimited photos and videos\nMemory Book\n24/7 Support',
    'pricing.legacy': 'Legacy',
    'pricing.legacyPrice': '$9.99',
    'pricing.legacyFeatures': 'Eternal Storage\nFamily Tree\nHeirloom Transfer',
    'pricing.popular': 'Popular',

    // Block 8: FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'How secure is my data?',
    'faq.a1': 'We use military-grade encryption and backup across multiple servers.',
    'faq.q2': 'Can I delete my profile?',
    'faq.a2': 'Yes, you can delete your profile at any time. Data will be deleted within 30 days.',
    'faq.q3': 'How do I transfer access to heirs?',
    'faq.a3': 'You can designate heirs in your profile settings. They will gain access after your passing.',

    // Block 9: Footer
    'footer.title': 'Digital Memorial',
    'footer.description': 'Preserving memory, uniting families',
    'footer.contact': 'Contact',
    'footer.email': 'info@demoria.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.copyright': '© 2026 Digital Memorial. All rights reserved.',

    // Demo Modal
    'demo.name': 'Ivan Sidorov',
    'demo.years': '1950 - 2024',
    'demo.location': 'World Cemetery, Moscow',
    'demo.bio': 'Ivan was a teacher, father and friend. His life was full of love for family and dedication to his work.',
    'demo.candles': 'candles lit',
    'demo.share': 'Share',
    'demo.write': 'Write',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'ru';
    }
    return 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ru']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
