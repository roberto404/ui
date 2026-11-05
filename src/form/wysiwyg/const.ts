/**
 * A Wysiwyg szerkesztő (editor.jsx) és a draft-js nélküli statikus megjelenítő
 * (static.tsx) közös beállításai – így a kettő pontosan ugyanúgy néz ki.
 */

/** Egyedi inline stílusok (a draft-js alap BOLD/ITALIC/UNDERLINE/CODE mellett). */
export const styleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
};

/** Blokk-típus → osztály (draft-js `blockStyleFn`). */
export const blockClassNames = {
  'header-two': 'm-0 pb-1 heavy text-xxl mobile:text-m',
  'header-three': 'light pb-1 text-line-m mobile:text-s m-0 text-black',
  'blockquote': 'embed-blockquote italic text-line-xl text-l my-2 pt-4 px-4',
  'caption': 'text-center light text-s',
  'unstyle': 'text-line-l light',
  'unordered-list-item': 'disc text-line-l light',
  'ordered-list-item': 'decimal text-line-l light',
};
