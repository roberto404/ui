
export const LOGIN_FIELDS = {
  email: {
    id: 'email',
    label: 'field.email',
    placeholder: 'placeholder.email',
    type: 'email',
    length: '128',
    focus: true,
  },
  password: {
    id: 'password',
    label: 'field.password',
    length: '32',
    type: 'password',
    placeholder: 'placeholder.password',
  },
  password2: {
    id: 'password2',
    label: 'field.password2',
    length: '32',
    type: 'password',
    placeholder: 'placeholder.password',
  },
};

export const LOGIN_SCHEME = {
  email: {
    presence: {
      message: '^validator.presence',
    },
    email: {
      message: '^validator.format',
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
};
