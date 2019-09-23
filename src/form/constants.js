// @flow

export const FORM_ERRORS_KEY = '_errors';
export const FORM_SCHEME_KEY = '_scheme';



/**
 * Automatically add dashes {8}-{1}-{2}.
 * And handling the reduce (backspace)
 * @param  {string} value taxcode
 * @return {string}       taxcode extended with dash.
 */
const formatTaxcode = (value, reduce) =>
{
  // add dash after backspacing
  if (/^[0-9]{9}$/.exec(value) || /^[0-9]{8}-[0-9]{2}$/.exec(value))
  {
    return `${value.substring(0, value.length - 1)}-${value.substring(value.length - 1, value.length)}`;
  }
  // add dashes
  else if (!reduce && (/^[0-9]{8}$/.exec(value) || /^[0-9]{8}-[1-5]{1}$/.exec(value)))
  {
    return `${value}-`;
  }
  // remove dashes when backspacing
  else if (reduce && (/^[0-9]{8}-$/.exec(value) || /^[0-9]{8}-[1-5]{1}-$/.exec(value)))
  {
    return value.substring(0, value.length - 1);
  }

  return value;
};

/**
 * Automatically add gap {2} {3} {4}.
 * And handling the reduce (backspace)
 * @param  {string} value phone
 * @return {string}       phone extended with gap.
 */
const formatPhone = (value, reduce) =>
{
  // add dash after backspacing
  if (/^[0-9]{3}$/.exec(value) || /^[0-9]{2} [0-9]{4}$/.exec(value))
  {
    return `${value.substring(0, value.length - 1)} ${value.substring(value.length - 1, value.length)}`;
  }
  // add dashes
  else if (!reduce && (/^[0-9]{2}$/.exec(value) || /^[0-9]{2} [0-9]{3}$/.exec(value)))
  {
    return `${value} `;
  }
  // remove dashes when backspacing
  else if (reduce && (/^[0-9]{2} $/.exec(value) || /^[0-9]{2} [0-9]{3} $/.exec(value)))
  {
    return value.substring(0, value.length - 1);
  }

  return value;
};


export const DEFAULT_FIELDS = {
  status: {
    id: 'status',
    label: 'field.status',
    data: [
      { id: '0', title: 'field.status.inactive' },
      { id: '1', title: 'field.status.active' },
    ],
    default: '0',
  },
  title: {
    id: 'title',
    label: 'field.title',
    length: '128',
  },
  name: {
    id: 'name',
    label: 'field.name',
    placeholder: 'placeholder.name',
    length: '128',
  },
  email: {
    id: 'email',
    label: 'field.email',
    length: '128',
    type: 'email',
  },
  phone: {
    id: 'phone',
    label: 'field.phone',
    placeholder: 'placeholder.phone',
    regexp: '^[0-9 ]*$',
    prefix: 'prefix.phone',
    length: '11',
    format: formatPhone,
    type: 'tel',
  },
  password: {
    id: 'password',
    label: 'field.password',
    length: '32',
    type: 'password',
  },
  password2: {
    id: 'password2',
    label: 'field.password2',
    length: '32',
    type: 'password',
  },
  oldPassword: {
    id: 'oldPassword',
    label: 'field.oldPassword',
    length: '32',
    type: 'password',
  },
  address: {
    id: 'address',
    label: 'field.address',
    placeholder: 'company.placeholder.address',
    length: '32',
  },
  zipcode: {
    id: 'zipcode',
    label: 'field.zipcode',
    regexp: '^[0-9]{0,4}$',
    type: 'tel',
  },
  city: {
    id: 'city',
    label: 'field.city',
    data: [],
  },
  taxcode: {
    id: 'taxcode',
    label: 'field.taxcode',
    regexp: '^([0-9]{0,9}|[0-9]{8}-|[0-9]{8}-[1-5]{1}[0-9]{0,1}-?|[0-9]{8}-[1-5]{1}-[0-9]{0,2})$',
    format: formatTaxcode,
    type: 'tel',
  },
  terms: {
    id: 'terms',
    label: 'field.terms',
  },
  newsletter: {
    id: 'newsletter',
    label: 'field.newsletter',
  },
  pid: {
    id: 'pid',
    label: 'field.pid',
    placeholder: 'placeholder.select',
    dataTranslate: false,
  },
  pos: {
    id: 'pos',
    label: 'field.pos',
    // placeholder: 'placeholder.pos',
    dataTranslate: false,
  },
};


export const DEFAULT_SCHEME = {
  status: {
    presence: {
      message: '^validator.presence',
    },
  },
  title: {
    presence: {
      message: '^validator.presence',
    },
  },
  name: {
    presence: {
      message: '^validator.presence',
    },
    format: {
      pattern: '^([A-zÀ-ÿőűŐŰ]+\\.? )?[A-zÀ-ÿőűŐŰ]{2,} [A-zÀ-ÿőűŐŰ]{3,}( [A-zÀ-ÿőűŐŰ]{3,})*$',
      message: '^validator.name',
    },
  },
  email: {
    presence: {
      message: '^validator.presence',
    },
    email: {
      message: '^validator.format',
    },
  },
  phone: {
    presence: {
      message: '^validator.presence',
    },
    format: {
      pattern: '[0-9 ]{11}',
      message: '^validator.format',
      // message: '^A helyes formátum 11 számjegy.',
    },
  },
  password: {
    presence: {
      message: '^validator.presence',
    },
    length: {
      minimum: 5,
      message: '^validator.format',
      // tooShort: '^Minimum %{count} karakter kell megadni',
    },
  },
  password2: {
    presence: {
      message: '^validator.presence',
    },
    equality: {
      attribute: 'password',
      comparator: (v1, v2) => v1 === v2,
      message: '^validator.password2',
    },
  },
  oldPassword: {
    custom: {
      validator: (fieldValue, scheme, fieldId, formData) => fieldValue || !formData.password,
      message: '^validator.presence',
    },
  },
  address: {
    presence: {
      message: '^validator.presence',
    },
  },
  zipcode: {
    presence: {
      message: '^validator.presence',
    },
    format: {
      pattern: /^[1-9]{1}[0-9]{3}$/,
      message: '^validator.format',
    },
  },
  city: {
    presence: {
      message: '^validator.presence',
    },
  },
  taxcode: {
    presence: {
      message: '^validator.presence',
    },
    format: {
      pattern: /^[0-9]{8}-[1-5]{1}-[0-9]{2}$/,
      message: '^validator.format',
    },
  },
  terms: {
    presence: {
      message: '^validator.presence',
    },
  },
  newsletter: {
    // presence: {
    //   message: '^validator.presence',
    // },
  },
  pid: {
    presence: {
      message: '^validator.presence',
    },
    numericality: {
      onlyInteger: true,
      greaterThan: -1,
      message: '^validator.format',
    },
  },
  pos: {
    presence: {
      message: '^validator.presence',
    },
    numericality: {
      onlyInteger: true,
      greaterThan: -1,
      message: '^validator.format',
    },
  },
};


/**
 * Get predefined fields props
 * @param  {array} fetchFields [title, phone]
 * @return {object}             fields { title: {...}, phone: {...}}
 */
export const getFields = fetchFields =>
  fetchFields.reduce((result, field) =>
    ({
      ...result,
      [field]: DEFAULT_FIELDS[field],
    }),
    {},
  );

export const getScheme = fetchFields =>
  fetchFields.reduce((result, field) =>
    ({
      ...result,
      [field]: DEFAULT_SCHEME[field],
    }),
    {},
  );
