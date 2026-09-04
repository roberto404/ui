import ItemProgress from './itemProgress';
import ItemApi from './itemApi';
import ItemApiPromise from './itemApiPromise';

export const templates = {
  ItemProgress,
  ItemApi,
  ItemApiPromise,
} as const;

export type Templates = keyof typeof templates;


export const TemplatesType: { [K in Templates]: K } = Object.keys(templates).reduce(
  (acc, key) => {
    acc[key as Templates] = key as Templates;
    return acc;
  },
  {} as { [K in Templates]: K }
);
