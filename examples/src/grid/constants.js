import React from 'react';

export const DATA = [
  { "id": 1, "name": "Megan J. Cushman", "gender": '1', "visits": "2017-07-23" },
  { "id": 2, "name": "Taylor R. Fallin", "gender": '2', "visits": "2017-07-22" },
  { "id": 3, "name": "Jose C. Rosado", "gender": 1, "visits": "2017-07-22" },
  { "id": 4, "name": "Sammy C. Brandt", "gender": 1, "visits": "2017-07-22" },
  { "id": 5, "name": "June K. Jenkins", "gender": 2, "visits": "2017-06-10" },
  { "id": 6, "name": "Pamela R. Benson", "gender": 2, "visits": "2017-05-23" },
  { "id": 7, "name": "James H. Kelly", "gender": 1, "visits": "2017-07-23" },
  { "id": 8, "name": "Joseph D. Black", "gender": 1, "visits": "2017-07-23" },
  { "id": 9, "name": "Kellie E. Franklin", "gender": 2, "visits": "2017-07-23" },
  { "id": 10, "name": "Wayne D. Price", "gender": 1, "visits": "2017-07-23" },
  { "id": 11, "name": "Michael P. Danley", "gender": 1, "visits": "2016-07-23" },
  { "id": 12, "name": "Weston S. Taylor", "gender": 1, "visits": "2015-07-23" },
];

export const DATA_MESSAGES = [
  { id: 1, sender: 1, name: 'Michael', content: 'first message', createdDateTime: '2020-06-03 20:05:52' },
  { id: 2, sender: 1, name: 'Michael', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', createdDateTime: '2020-06-03 20:05:55' },
  { id: 5, sender: 2, name: 'Joseph', content: 're-second message', createdDateTime: '2020-06-03 20:06:55', deliveredDateTime: '2020-06-03 20:06:55' },
  { id: 3, sender: 1, name: 'Michael', content: 'first message', createdDateTime: '2020-06-04 20:05:52' },
  { id: 4, sender: 1, name: 'Michael', content: 'second message', createdDateTime: '2020-06-04 20:05:55' },
];


// const NOW = new Date();

export const SETTINGS =
{
  hook:
  {
    name: 'Name',
    visits:
    {
      title: 'Visits',
      format: ({ record }) => (
        <div>
          <div className="text-m bold">{record.visits}</div>
          <div className="text-xs text-gray">{record.name}</div>
        </div>
      ),
    },
    gender:
    {
      title: 'Gender',
      format: ({ value, helper }, config = {}) =>
        ((helper.gender) ? helper.gender[value] || value : value),
    },
  },
  helper:
  {
    gender: { 1: 'male', 2: 'female' },
  },
  paginate:
  {
    limit: 2,
  },
  order:
  {
    column: 'name',
    direction: 'desc',
  },
  filters:
  [
    {
      id: 'search',
      handler: (record, value) =>
        record.name
          .toString()
          .toLowerCase()
          .indexOf(value.toString().toLowerCase()) >= 0,
      arguments: [],
      status: false,
    },
    {
      id: 'isMale',
      handler: record => parseInt(record.gender) === 1,
      arguments: [],
      status: false,
    },
    {
      id: 'gender',
      handler: (record, value) =>
        parseInt(record.gender) === parseInt(value),
      arguments: [],
      status: false,
    },
    {
      id: 'visit',
      handler: ({ visits }, value) => visits === value,
      arguments: [],
      status: false,
    },
  ],
  };


  export const HOOK_LIST = {
    id:
    {
      title: 'Termék',
      width: '100%',
      align: 'left',
      format: ({ record }) =>
      (
        <div className="pl-1">
          <div className="ellipsis">{record.name}</div>
          <div className="text-s text-gray light ellipsis" style={{ height: '1.5em' }}>{record.visits}</div>
        </div>
      ),
    },
  };
