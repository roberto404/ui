/**
 * Elemek jelölése a kódban: <div data-tutorial="order.filter">
 */
export const ATTRIBUTE = 'data-tutorial';

const SEEN_STORAGE_KEY = 'tutorialSeen';

/**
 * A lépés `dom` mezőjéből CSS selector:
 * "order.filter" → [data-tutorial="order.filter"], ".foo" / "#bar" / "[x]" / "a > b" → változatlan
 */
export const getSelector = (dom: string): string => {
  const value = (dom || '').trim();

  if (!value) {
    return '';
  }

  if (/^[.#[]/.test(value) || /[\s>:~+]/.test(value)) {
    return value;
  }

  return `[${ATTRIBUTE}="${value.replace(/"/g, '\\"')}"]`;
};

const isVisible = (element: Element) => {
  const rect = element.getBoundingClientRect();

  if (!rect.width && !rect.height) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.visibility !== 'hidden' && style.display !== 'none';
};

/**
 * Az első LÁTHATÓ egyező elem: reszponzív oldalon ugyanaz a kulcs lehet
 * az asztali és a mobil változaton is, mindig a látható kapja a buborékot.
 */
export const findTarget = (dom: string): Element | null => {
  const selector = getSelector(dom);

  if (!selector || typeof document === 'undefined') {
    return null;
  }

  try {
    return Array.from(document.querySelectorAll(selector)).find(isVisible) || null;
  }
  catch (error) {
    // hibás selector az adminban
    console.warn(`Tutorial: hibás selector "${selector}"`);
    return null;
  }
};

const normalizePath = (url: string) => {
  const path = (url || '').split(/[?#]/)[0].replace(/^[a-z]+:\/\/[^/]+/i, '');
  return path.replace(/\/+$/, '') || '/';
};

/**
 * Url minta illesztése (az API Tutorials::matchUrl párja):
 * pontos egyezés, vagy a minta végén * = prefix. Üres minta = bárhol.
 */
export const matchUrl = (pattern: string, path: string): boolean => {
  const value = (pattern || '').trim();

  if (!value) {
    return true;
  }

  if (value.endsWith('*')) {
    const prefix = normalizePath(value.slice(0, -1));
    const current = normalizePath(path);

    return prefix === '/' || current === prefix || current.startsWith(`${prefix}/`);
  }

  return normalizePath(value) === normalizePath(path);
};

/**
 * Látott (automatikusan már elindult) tutorialok — localStorage
 */
const getSeen = (): number[] => {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_STORAGE_KEY) || '[]');
    return Array.isArray(seen) ? seen : [];
  }
  catch (error) {
    return [];
  }
};

export const isTutorialSeen = (id: number) => getSeen().includes(+id);

export const setTutorialSeen = (id: number) => {
  try {
    const seen = getSeen();

    if (!seen.includes(+id)) {
      localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...seen, +id]));
    }
  }
  catch (error) {
    // private mode
  }
};
