/**
 * Egyszerű, biztonságos kifejezés-kiértékelő a kalkulátorhoz (nincs `eval`).
 *
 * Műveletek: + − × ÷ (a `-`, `*`, `x`, `/` is elfogadott), tizedesjel: `,` vagy `.`,
 * előjel: kezdő vagy művelet utáni `-`. A szorzás / osztás erősebb.
 *
 * @example
 * evaluate('1000+2×50') // 1100
 * evaluate('3220÷2')    // 1610
 * evaluate('12,5')      // 12.5
 * evaluate('1+')        // undefined
 */

export const OPERATORS = ["+", "−", "×", "÷"] as const;

/**
 * Billentyűzetről / beillesztésből érkező jelek egységesítése
 */
export const normalize = (expression: string): string =>
  expression
    .replace(/\s+/g, "")
    .replace(/\./g, ",")
    .replace(/\*/g, "×")
    .replace(/[xX]/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−")
    .replace(/[^0-9,+−×÷]/g, "");

type Token = number | "+" | "−" | "×" | "÷";

const tokenize = (expression: string): Token[] | undefined => {
  const tokens: Token[] = [];
  const pattern = /(\d+(?:,\d*)?|,\d+)|([+−×÷])/g;
  let match: RegExpExecArray | null;
  let expectNumber = true;
  let sign = 1;

  while ((match = pattern.exec(expression))) {
    const [, number, operator] = match;

    if (number !== undefined) {
      if (!expectNumber) {
        return undefined;
      }

      tokens.push(sign * parseFloat(number.replace(",", ".")));
      sign = 1;
      expectNumber = false;
    } else if (expectNumber) {
      // előjel: „−5”, „3×−2”
      if (operator !== "−" || sign === -1) {
        return undefined;
      }

      sign = -1;
    } else {
      tokens.push(operator as Token);
      expectNumber = true;
    }
  }

  return tokens.length && !expectNumber ? tokens : undefined;
};

export const evaluate = (expression: string): number | undefined => {
  const tokens = tokenize(normalize(expression));

  if (!tokens) {
    return undefined;
  }

  // 1. kör: × ÷
  const terms: (number | string)[] = [tokens[0]];

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const value = tokens[i + 1] as number;

    if (operator === "×" || operator === "÷") {
      const left = terms.pop() as number;

      if (operator === "÷" && value === 0) {
        return undefined;
      }

      terms.push(operator === "×" ? left * value : left / value);
    } else {
      terms.push(operator, value);
    }
  }

  // 2. kör: + −
  let result = terms[0] as number;

  for (let i = 1; i < terms.length; i += 2) {
    result =
      terms[i] === "+"
        ? result + (terms[i + 1] as number)
        : result - (terms[i + 1] as number);
  }

  return Number.isFinite(result) ? result : undefined;
};

/**
 * Az utolsó szám előjelének váltása: „100+20” → „100+−20”, „−5” → „5”
 */
export const toggleSign = (expression: string): string => {
  const match = /(^|[+−×÷])(−?)([0-9,]*)$/.exec(expression);

  if (!match) {
    return expression;
  }

  const [all, operator, minus, number] = match;
  const head = expression.slice(0, expression.length - all.length);

  return `${head}${operator}${minus ? "" : "−"}${number}`;
};

/**
 * Szám a kijelzőre: 12.5 → „12,5”
 */
export const format = (value: number, precision = 0): string =>
  `${Math.round(value * 10 ** precision) / 10 ** precision}`
    .replace(".", ",")
    .replace("-", "−");

/**
 * Hosszúság-mértékegységek (mm-ben); ha a kalkulátor `unit`-ja ezek egyike,
 * a kijelzőn átváltható (gépelve: „m”, „cm”, „mm” vagy a mértékegységre kattintva)
 */
export const LENGTH_UNITS: Record<string, number> = { mm: 1, cm: 10, m: 1000 };

/**
 * Érték átváltása egyik hosszúság-egységből a másikba: convert(3220, 'mm', 'm') → 3.22
 */
export const convert = (value: number, from: string, to: string): number =>
  (value * LENGTH_UNITS[from]) / LENGTH_UNITS[to];
