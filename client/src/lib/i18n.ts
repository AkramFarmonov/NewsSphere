import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Uzbek translations
const uzTranslations = {
  nav: {
    home: "Bosh sahifa",
    categories: "Kategoriyalar",
    search: "Qidirish...",
    language: "Til",
  },
  categories: {
    ozbekiston: "O'zbekiston",
    dunyo: "Dunyo",
    sport: "Sport", 
    texnologiya: "Texnologiya",
    iqtisodiyot: "Iqtisodiyot",
    madaniyat: "Madaniyat",
    siyosat: "Siyosat"
  },
  common: {
    breaking: "Tezkor",
    featured: "Asosiy",
    trending: "Mashhur",
    readMore: "Batafsil",
    loading: "Yuklanmoqda...",
    views: "ko'rishlar",
    likes: "yoqtirishlar",
    publishedAt: "Nashr etilgan",
    minutes: "daqiqa",
    hours: "soat", 
    days: "kun",
    ago: "oldin"
  },
  footer: {
    about: "Biz haqimizda",
    contact: "Aloqa",
    privacy: "Maxfiylik",
    terms: "Shartlar"
  }
};

// Russian translations  
const ruTranslations = {
  nav: {
    home: "Главная",
    categories: "Категории", 
    search: "Поиск...",
    language: "Язык",
  },
  categories: {
    ozbekiston: "Узбекистан",
    dunyo: "Мир",
    sport: "Спорт",
    texnologiya: "Технологии", 
    iqtisodiyot: "Экономика",
    madaniyat: "Культура",
    siyosat: "Политика"
  },
  common: {
    breaking: "Срочно",
    featured: "Главные", 
    trending: "Популярные",
    readMore: "Подробнее",
    loading: "Загрузка...",
    views: "просмотров",
    likes: "лайков", 
    publishedAt: "Опубликовано",
    minutes: "минут",
    hours: "часов",
    days: "дней", 
    ago: "назад"
  },
  footer: {
    about: "О нас",
    contact: "Контакты", 
    privacy: "Конфиденциальность",
    terms: "Условия"
  }
};

// English translations
const enTranslations = {
  nav: {
    home: "Home",
    categories: "Categories",
    search: "Search...", 
    language: "Language",
  },
  categories: {
    ozbekiston: "Uzbekistan",
    dunyo: "World",
    sport: "Sports",
    texnologiya: "Technology",
    iqtisodiyot: "Economy", 
    madaniyat: "Culture",
    siyosat: "Politics"
  },
  common: {
    breaking: "Breaking",
    featured: "Featured",
    trending: "Trending", 
    readMore: "Read more",
    loading: "Loading...",
    views: "views",
    likes: "likes",
    publishedAt: "Published",
    minutes: "minutes", 
    hours: "hours",
    days: "days",
    ago: "ago"
  },
  footer: {
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms"
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uzTranslations },
      ru: { translation: ruTranslations }, 
      en: { translation: enTranslations }
    },
    fallbackLng: 'uz',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;