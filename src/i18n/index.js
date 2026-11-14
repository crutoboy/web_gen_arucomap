const localeLoaders = {
    ru: () => import('./locales/ru.json'),
    en: () => import('./locales/en.json'),
};

const availableLocales = Object.keys(localeLoaders);
const FALLBACK_LOCALE = 'en';

let currentLocale = localStorage.getItem('genmap_lang') || detectLanguage();
let translations = {};
let fallbackTranslations = {};

function detectLanguage() {
    const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return availableLocales.includes(browserLang) ? browserLang : FALLBACK_LOCALE;
}

async function loadLocale(lang) {
    if (!localeLoaders[lang]) {
        lang = FALLBACK_LOCALE;
    }

    try {
        const [mod, fallbackMod] = await Promise.all([
            localeLoaders[lang](),
            lang === FALLBACK_LOCALE
                ? Promise.resolve({ default: {} })
                : localeLoaders[FALLBACK_LOCALE](),
        ]);

        translations = mod.default ?? mod;
        fallbackTranslations = fallbackMod.default ?? fallbackMod;
        currentLocale = lang;

        localStorage.setItem('genmap_lang', lang);
        document.documentElement.lang = lang;

        applyTranslations();
    } catch (err) {
        console.error(`Failed to load locale "${lang}"`, err);
        if (lang !== FALLBACK_LOCALE) {
            return loadLocale(FALLBACK_LOCALE);
        }
    }
}

export function t(key) {
    return translations[key] ?? fallbackTranslations[key] ?? key;
}

export async function setLocale(lang) {
    await loadLocale(lang);
}

export function getAvailableLocales() {
    return [...availableLocales];
}

export function getLocale() {
    return currentLocale;
}

export function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (key) {
            el.innerHTML = t(key);
        }
    });

    // Поддержка title, placeholder, aria-label и т.д.
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        el.title = t(el.dataset.i18nTitle);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    const pageTitle = t('page_title');
    if (pageTitle !== 'page_title') {
        document.title = pageTitle;
    }
}

/**
 * Инициализация i18n.
 * Вызывать один раз из main.js после того, как DOM готов.
 */
export async function initI18n() {
    await loadLocale(currentLocale);

    const select = document.getElementById('langSelect');
    if (!select) return;

    // Очищаем на случай повторного вызова
    select.innerHTML = '';

    availableLocales.forEach((lang) => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang.toUpperCase();
        if (lang === currentLocale) option.selected = true;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        setLocale(e.target.value);
    });
}