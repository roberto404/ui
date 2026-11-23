import React from 'react';


/* !- Types */

export type HistoryCategory = {
  // name (next to the user name, filter chip)
  title: string,
  // name of the filter chip (default: title), e.g. "Üzenetek"
  filterTitle?: string,
  // icon component of the entry (in a tinted circle)
  icon?: React.ComponentType<any>,
  // icon of the filter chip (default: icon)
  filterIcon?: React.ComponentType<any>,
  // any css color: category name, icon and its tinted background
  color?: string,
  // classes of the icon circle instead of the tinted one (`bg-tint fill-tint`), ex. `bg-black fill-white`
  iconClassName?: string,
};

export type HistoryCategories = Record<string, HistoryCategory>;


/* !- Registry */

/**
 * Global categories of the history entries (`record.category` => name, icon, color).
 * Set once in the application, the `categories` prop extends / overrides it.
 */
let registry: HistoryCategories = {};

/**
 * @example
 * setHistoryCategories({
 *   payment: { title: 'Fizetés', icon: IconCreditCard, color: '#3d8b52' },
 *   message: { title: 'Üzenet', icon: IconComment, color: '#3456d1' },
 * });
 */
export const setHistoryCategories = (categories: HistoryCategories, merge = true) => {
  registry = merge ? { ...registry, ...categories } : { ...categories };
};

export const getHistoryCategories = (categories?: HistoryCategories): HistoryCategories =>
  (categories ? { ...registry, ...categories } : registry);

/**
 * Category of a record: its own `category`, otherwise the default one (if exists)
 */
export const getHistoryCategory = (
  categoryId: string | undefined,
  categories?: HistoryCategories,
  defaultCategory?: string,
): (HistoryCategory & { id: string, isDefault: boolean }) | null => {
  const all = getHistoryCategories(categories);
  const isOwn = !!(categoryId && all[categoryId]);
  const id = isOwn ? categoryId : defaultCategory;

  // isDefault: the record has no (known) category, the default one is used
  return id && all[id] ? { ...all[id], id, isDefault: !isOwn } : null;
};
