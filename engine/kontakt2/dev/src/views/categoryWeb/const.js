

import { getFields, getScheme, DEFAULT_FIELDS, DEFAULT_SCHEME } from '@1studio/ui/form/constants';


/* !- GRID */

export const SETTINGS = {
  hook:
  {
    title:
    {
      title: 'Kategória',
    },
    pid: 'pid',
    pos: 'pos',
  },
  paginate:
  {
    page: 1,
    limit: 0,
  },
  order:
  {
    column: 'pid',
    order: 'asc',
  },
};

/* !- FORM */


const fetchFields = [
  // 'status',
  'title',
  'pos',
  'pid',
];

export const FIELDS = getFields(fetchFields);
export const SCHEME = getScheme(fetchFields);

//
// export const FIELDS = {
//   ...getFields(fetchFields),
//   company: {
//     id: 'company',
//     label: 'company.field.title',
//     placeholder: 'company.placeholder.title',
//     length: '64',
//   },
//   address2: {
//     ...DEFAULT_FIELDS.address,
//     id: 'address2',
//   },
//   zipcode2: {
//     ...DEFAULT_FIELDS.zipcode,
//     id: 'zipcode2',
//   },
//   city2: {
//     ...DEFAULT_FIELDS.city,
//     id: 'city2',
//   },
// };
//
// export const SCHEME = {
//   ...getScheme(fetchFields),
//   password: {
//     ...DEFAULT_SCHEME.password,
//     presence: undefined,
//   },
//   password2: {
//     ...DEFAULT_SCHEME.password2,
//     presence: undefined,
//   },
//   company: {
//     presence: {
//       message: '^validator.presence',
//     },
//   },
//   address2: DEFAULT_SCHEME.address,
//   zipcode2: DEFAULT_SCHEME.zipcode,
//   city2: DEFAULT_SCHEME.city,
// }
