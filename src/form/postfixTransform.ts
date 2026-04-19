import formatThousand from "@1studio/utils/string/formatThousand";

export const getNumericValue = (value: string | number | null | undefined) => {
  if (value === '' || value === null || typeof value === 'undefined') {
    return undefined;
  }

  const numericValue = parseFloat(String(value).replace('%', '').replaceAll(/[^0-9.]/g, ''));

  return Number.isFinite(numericValue) ? numericValue : undefined;
};


export const amount =
{
  id: 'amount',
  label: 'Ft',
  stateFormat: (value: string | number | null | undefined) => {
    if (value === '' || value === null || typeof value === 'undefined') {
      return value;
    }

    const amountValue = getNumericValue(value);

    return typeof amountValue === 'number' ? formatThousand(amountValue) : value;
  },
  format: (value: string | number | null | undefined) => {
    if (value === '' || value === null || typeof value === 'undefined') {
      return value;
    }

    const amountValue = getNumericValue(value);

    return typeof amountValue === 'number' ? amountValue.toString() : value;
  },
};

export const percent = (basePrice: number) => {
  return ({
    id: 'percent',
    label: '%',
    stateFormat: (value: string | number | null | undefined) => {
      if (value === '' || value === null || typeof value === 'undefined') {
        return value;
      }

      const amountValue = getNumericValue(value);

      return typeof amountValue === 'number' && basePrice ?
        Math.round((amountValue / basePrice * 100)).toString() :
        value;
    },
    format: (value: string | number | null | undefined) => {
      if (value === '' || value === null || typeof value === 'undefined') {
        return value;
      }

      const percentValue = getNumericValue(value);

      return typeof percentValue === 'number' && basePrice ?
        (percentValue / 100 * basePrice).toString() :
        value;
    },
  });
};

export const createPercentPostfixTransform = (basePrice: number) => ({
  defaultMode: 'amount',
  options: [
    amount,
    percent(basePrice),
  ],
});