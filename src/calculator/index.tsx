import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

/* !- Icons */

import IconClose from "../icon/mui/navigation/close";
import IconCheck from "../icon/mui/navigation/check";

/* !- Helpers */

import {
  LENGTH_UNITS,
  convert,
  evaluate,
  format,
  normalize,
  toggleSign,
} from "./evaluate";

/* !- Styles (only what the ui utilities can not do) */

import styles from "./calculator.module.scss";

/* !- Types */

export type CalculatorPropTypes = {
  /**
   * Kezdőérték (a kijelzőn kijelölve, felülírható)
   */
  value?: number;
  /**
   * Mértékegység a kijelzőn; hosszúságnál (mm / cm / m) átváltható: „m”, „cm”,
   * „mm” gépelésével vagy a mértékegységre kattintva. Az `onSubmit` mindig
   * ebben az egységben kapja az értéket.
   */
  unit?: string;
  title?: React.ReactNode;
  /**
   * A cím előtti jel (pl. színes kör betűvel)
   */
  badge?: React.ReactNode;
  /**
   * Tizedesjegyek száma az eredményben
   */
  precision?: number;
  min?: number;
  max?: number;
  /**
   * Pipa / Enter: a kiszámolt érték
   */
  onSubmit: (value: number) => void;
  onClose?: () => void;
  className?: string;
};

/* !- Constants */

type Key = {
  id: string;
  title: React.ReactNode;
  type?: "operator" | "action" | "submit";
  className?: string;
};

/**
 * Billentyűzetről érkező műveleti jelek (a kijelölt értéket nem írják felül)
 */
const OPERATOR_KEYS = /^[+\-*/xX×÷−]$/;

const UNIT_ORDER = ["mm", "cm", "m"];

/**
 * Két művelet egymás után: az utóbbi érvényes (kivéve az előjelet)
 */
const appendOperator = (expression: string, operator: string) =>
  /[+×÷]$/.test(expression) && operator !== "−"
    ? expression.slice(0, -1) + operator
    : expression + operator;

/**
 * 4 oszlopos billentyűzet; a pipa két sor magas, a 0 két oszlop széles (CSS grid-area)
 */
const KEYS: Key[] = [
  { id: "backspace", title: "⌫", type: "action", className: styles.backspace },
  { id: "sign", title: "±", type: "action" },
  { id: "÷", title: "÷", type: "operator" },
  { id: "×", title: "×", type: "operator" },
  { id: "7", title: "7" },
  { id: "8", title: "8" },
  { id: "9", title: "9" },
  { id: "−", title: "−", type: "operator" },
  { id: "4", title: "4" },
  { id: "5", title: "5" },
  { id: "6", title: "6" },
  { id: "+", title: "+", type: "operator" },
  { id: "1", title: "1" },
  { id: "2", title: "2" },
  { id: "3", title: "3" },
  {
    id: "submit",
    title: <IconCheck />,
    type: "submit",
    className: styles.submit,
  },
  { id: "0", title: "0", className: styles.zero },
  { id: ",", title: "," },
];

/**
 * Számológép egy mező értékéhez: alapműveletek, előjel, tizedesjel.
 *
 * A kijelző egy input (autofókusz, a kezdőérték kijelölve), billentyűzetről
 * is írható; Enter vagy a pipa kiértékeli és az `onSubmit`-nak adja.
 *
 * A méretek em-ben vannak: a szülő betűmérete skálázza (16px = alapméret).
 *
 * @example
 * <Calculator value={1000} unit="mm" title="Kék méret" onSubmit={(value) => …} />
 */
const Calculator = ({
  value,
  unit,
  title,
  badge,
  precision = 0,
  min,
  max,
  onSubmit,
  onClose,
  className,
}: CalculatorPropTypes) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [expression, setExpression] = useState(
    value !== undefined ? format(value, precision) : "",
  );
  const [error, setError] = useState(false);
  const [displayUnit, setDisplayUnit] = useState(unit);
  // „c” után jövő „m” = cm, „m” után „m” = mm
  const lastUnitKey = useRef("");
  const shouldSelect = useRef(true);

  const isLength = !!unit && unit in LENGTH_UNITS;

  // a kezdőérték (és az átváltott érték) kijelölve: rögtön felülírható
  useEffect(() => {
    const input = inputRef.current;

    input?.focus();

    if (shouldSelect.current) {
      input?.select();
      shouldSelect.current = false;
    }
  }, [expression, displayUnit]);

  const isWholeSelected = () => {
    const input = inputRef.current;

    return (
      !!input &&
      expression.length > 0 &&
      input.selectionStart === 0 &&
      input.selectionEnd === expression.length
    );
  };

  const update = (next: string) => {
    setError(false);
    setExpression(next);
    inputRef.current?.focus();
  };

  /**
   * Mértékegység-váltás: az érintetlen (kijelölt) érték átváltódik, a begépelt
   * szám az új egységben értendő (pl. „3” + „m” = 3 m)
   */
  const switchUnit = (next: string) => {
    if (!isLength || !displayUnit || next === displayUnit) {
      return;
    }

    const current = isWholeSelected() ? evaluate(expression) : undefined;

    if (current !== undefined) {
      shouldSelect.current = true;
      setExpression(format(convert(current, displayUnit, next), 3));
    }

    setError(false);
    setDisplayUnit(next);
  };

  const onClickUnitHandler = () =>
    switchUnit(UNIT_ORDER[(UNIT_ORDER.indexOf(displayUnit || "") + 1) % UNIT_ORDER.length]);

  const submit = () => {
    const evaluated = evaluate(expression);
    const result =
      evaluated !== undefined && isLength && displayUnit && unit
        ? convert(evaluated, displayUnit, unit)
        : evaluated;

    if (
      result === undefined ||
      (min !== undefined && result < min) ||
      (max !== undefined && result > max)
    ) {
      setError(true);
      inputRef.current?.focus();
      return;
    }

    onSubmit(Math.round(result * 10 ** precision) / 10 ** precision);
  };

  const onClickKeyHandler = (key: Key) => (event: React.MouseEvent) => {
    event.preventDefault();

    // kijelölt kezdőérték: az első szám felülírja, a művelet folytatja
    const isSelected = isWholeSelected();
    const base = isSelected && !key.type ? "" : expression;

    switch (key.id) {
      case "backspace":
        return update(isSelected ? "" : expression.slice(0, -1));
      case "sign":
        return update(toggleSign(expression));
      case "submit":
        return submit();
      default:
        return update(
          key.type === "operator" ? appendOperator(base, key.id) : base + key.id,
        );
    }
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;

    if (key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      submit();
      return;
    }

    // mértékegység gépelve: „m”, „cm”, „mm”
    if (isLength && /^[cCmM]$/.test(key) && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();

      const letter = key.toLowerCase();

      if (letter === "m") {
        switchUnit(lastUnitKey.current === "c" ? "cm" : lastUnitKey.current === "m" ? "mm" : "m");
      }

      lastUnitKey.current = letter;
      return;
    }

    lastUnitKey.current = "";

    // művelet a kijelölt értéken: folytatja, nem írja felül (pl. 4000 → „4000+”)
    if (OPERATOR_KEYS.test(key) && isWholeSelected()) {
      event.preventDefault();
      update(appendOperator(expression, normalize(key)));
    }
  };

  return (
    <div
      className={classNames(styles.root, className)}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.head}>
        {(title || onClose) && (
          <div
            className={classNames(styles.title, "flex h-center v-justify")}
          >
            <div className={classNames(styles.badge, "flex h-center min-w-0")}>
              {badge}
              <span className="nowrap">{title}</span>
            </div>
            {onClose && (
              <button
                type="button"
                className={classNames(styles.close, "initial")}
                onClick={onClose}
                title="Bezárás"
              >
                <IconClose />
              </button>
            )}
          </div>
        )}

        <label
          className={classNames(
            styles.display,
            "flex h-bottom v-right",
            { [styles.error]: error },
          )}
        >
          <input
            ref={inputRef}
            className={classNames(styles.input, "initial")}
            inputMode="decimal"
            value={expression}
            onChange={(event) => update(normalize(event.target.value))}
            onKeyDown={onKeyDownHandler}
            aria-invalid={error}
          />
          {displayUnit &&
            (isLength ? (
              <button
                type="button"
                className={classNames(styles.unit, "initial")}
                title="Mértékegység váltása (vagy gépelve: m, cm, mm)"
                onMouseDown={(event) => event.preventDefault()}
                onClick={onClickUnitHandler}
              >
                {displayUnit}
              </button>
            ) : (
              <span className={styles.unit}>{displayUnit}</span>
            ))}
        </label>
      </div>

      <div className={styles.keys}>
        {KEYS.map((key) => (
          <button
            key={key.id}
            type="button"
            className={classNames(styles.key, "initial", key.className, {
              [styles.operator]:
                key.type === "operator" || key.type === "action",
            })}
            // a fókusz az inputon marad
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClickKeyHandler(key)}
          >
            {key.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
