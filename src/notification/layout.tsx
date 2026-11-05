import React from "react";
import classNames from "classnames";

/* !-- Types */

export type NotificationColor = "blue" | "yellow" | "red" | "green" | "black";

/**
 * Egyedi színek - a `notification.scss` CSS változóit írják felül.
 * Amit nem adsz meg, az a `color` tónusból jön.
 */
export type NotificationColors = {
  /** ikon, kitöltött gomb, progress */
  accent?: string;
  /** ikon-doboz és címke háttere, kör körüli gyűrű */
  soft?: string;
  /** címke és körvonalas gomb szövege */
  text?: string;
  /** kártya háttere */
  background?: string;
  border?: string;
  title?: string;
  caption?: string;
  iconBackground?: string;
  badgeBackground?: string;
};

export type ButtonVariant = "primary" | "outline" | "secondary";

export type IconType = React.FC<{ className?: string }>;

/* !-- Helpers */

const COLOR_VARIABLES: Record<keyof NotificationColors, string> = {
  accent: "--notification-accent",
  soft: "--notification-soft",
  text: "--notification-text",
  background: "--notification-background",
  border: "--notification-border",
  title: "--notification-title",
  caption: "--notification-caption",
  iconBackground: "--notification-icon-background",
  badgeBackground: "--notification-badge-background",
};

/**
 * `colors` prop → CSS változók (inline style, mert értéke futásidejű).
 */
export const colorsToStyle = (
  colors?: NotificationColors,
): React.CSSProperties | undefined => {
  if (!colors) {
    return undefined;
  }

  return Object.entries(colors).reduce((style, [key, value]) => {
    if (value && COLOR_VARIABLES[key]) {
      style[COLOR_VARIABLES[key]] = value;
    }
    return style;
  }, {} as Record<string, string>) as React.CSSProperties;
};

/* !-- Button */

export type NotificationButtonPropTypes = {
  title: React.ReactNode;
  icon?: IconType;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

/**
 * Gomb az értesítésben. `className` megadásakor (variant nélkül) a régi, teljesen egyedi osztályt kapja.
 */
export const NotificationButton = ({
  title,
  icon: Icon,
  variant,
  disabled,
  className,
  onClick,
}: NotificationButtonPropTypes) => (
  <div
    className={
      className && !variant
        ? className
        : classNames("notification-button", variant || "primary", className, {
            disabled,
          })
    }
    onClick={disabled ? undefined : onClick}
  >
    {Icon && <Icon />}
    {title}
  </div>
);

/* !-- Layout */

export type PropTypes = {
  /** ikon komponens (az ikon-dobozban) */
  Icon?: IconType;
  /** az ikon-doboz egyedi tartalma (pl. spinner), felülírja az `Icon`-t */
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  title?: React.ReactNode;
  caption?: React.ReactNode;
  children?: React.ReactNode;
  /** gombok sora */
  actions?: React.ReactNode;
  /** rövid megjegyzés a gombok mellett */
  hint?: React.ReactNode;
  /** a tartalom alatt (pl. progress) */
  footer?: React.ReactNode;
  centered?: boolean;
  /** tónus csak erre a részre (pl. api válasz: zöld / piros) */
  color?: NotificationColor;
  className?: string;
};

/**
 * Az értesítés tartalma: ikon-doboz + címke, cím, leírás, gombok.
 * A kártyát (keret, háttér, bezárás, időzítő) az `itemWrapper` adja.
 */
const NotificationLayout = ({
  Icon,
  icon,
  badge,
  title,
  caption,
  children,
  actions,
  hint,
  footer,
  centered = false,
  color,
  className,
}: PropTypes) => {
  const iconContent = icon || (Icon ? <Icon /> : null);

  return (
    <div
      className={classNames(className, {
        "notification-tone": color,
        [color]: color,
        "column h-center p-3 gap-1": centered,
        "flex p-3 pr-4 gap-2": !centered,
      })}
    >
      {iconContent && <div className="notification-icon">{iconContent}</div>}

      <div
        className={classNames("column gap-1 min-w-0", {
          "h-center": centered,
          grow: !centered,
        })}
      >
        {badge && (
          <div>
            <span className="notification-badge">{badge}</span>
          </div>
        )}

        {title && <div className="notification-title">{title}</div>}

        {caption && <div className="notification-caption">{caption}</div>}

        {children}

        {(actions || hint) && (
          <div
            className={classNames("flex wrap h-center gap-1 mt-1/2", {
              "v-center": centered,
            })}
          >
            {actions}
            {hint && <div className="notification-hint">{hint}</div>}
          </div>
        )}

        {footer}
      </div>
    </div>
  );
};

export default NotificationLayout;
