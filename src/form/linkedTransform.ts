/**
 * Átváltások a LinkedInput-hoz (form/components/linkedInput).
 * `toRight`: bal mező értékéből a jobb, `toLeft`: jobb mező értékéből a bal.
 */

export type LinkedTransform = {
  toRight: (value: number) => number;
  toLeft: (value: number) => number;
};


/**
 * Szorzós átváltás (mértékegység): jobb = bal * factor
 * @example factor(1 / 2.54) // bal: cm, jobb: col
 */
export const factor = (multiplier: number): LinkedTransform => ({
  toRight: value => value * multiplier,
  toLeft: value => value / multiplier,
});


/**
 * Viszonyszám százaléka: bal = érték, jobb = érték / base * 100
 * @example percentOf(12990) // 1000 Ft ⇄ 7,7 %
 */
export const percentOf = (base: number): LinkedTransform => ({
  toRight: value => (base ? value / base * 100 : 0),
  toLeft: value => value / 100 * base,
});


/**
 * Kézzel beírt szám → number ("1 000,5" → 1000.5). Üres / értelmezhetetlen → undefined.
 */
export const parseNumber = (text: string | number | null | undefined): number | undefined => {
  if (typeof text === 'number') {
    return Number.isFinite(text) ? text : undefined;
  }

  if (typeof text !== 'string') {
    return undefined;
  }

  const normalized = text.replace(/\s/g, '').replace(',', '.');

  if (normalized === '' || normalized === '-' || normalized === '.') {
    return undefined;
  }

  const value = parseFloat(normalized);

  return Number.isFinite(value) ? value : undefined;
};


/**
 * Kerekítés a megadott tizedesjegyre (undefined = nincs kerekítés)
 */
export const round = (value: number, decimals?: number) => {
  if (typeof decimals !== 'number') {
    return value;
  }

  const power = 10 ** decimals;

  return Math.round(value * power) / power;
};


/**
 * Megjelenítés: kerekítve, tizedesvesszővel (7.7 → "7,7")
 */
export const formatNumber = (value: number, decimals?: number, decimalSeparator = ',') =>
  round(value, decimals).toString().replace('.', decimalSeparator);
