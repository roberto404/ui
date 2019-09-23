

import { getFields, getScheme } from '@1studio/ui/form/constants';


/* !- GRID */

export const SETTINGS = {
  // hook:
  // {
  //   title:
  //   {
  //     title: 'Kategória',
  //   },
  //   pid: 'pid',
  //   pos: 'pos',
  // },
  paginate:
  {
    page: 1,
    limit: 0,
  },
  // order:
  // {
  //   column: 'pid',
  //   order: 'asc',
  // },
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
