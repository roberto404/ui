`Grid SelectGroupBy Component.`
===============================

Collect unique data from rawData and connected to grid state via Redux.


```javascript
<GridSelectGroupBy
  id="category"
  label="Category"
  ?grid="robot"
/>
```

Props
-----

| Prop | Type | Required | Default |
| ---- | ---- | -------- | ------- |
| helper | arrayOf[object Object] |  | [] |
| id | string |  | 'dropdownGroupByFilter' |
| label | string |  | '' |
| placeholder | string |  | '' |
| reducer | func |  | (result, record, id) =><br>{<br>  if (Array.isArray(record[id]))<br>  {<br>    record[id].forEach((field) =><br>    {<br>      if (result.indexOf(field) === -1)<br>      {<br>        result.push(field);<br>      }<br>    });<br>  }<br>  else if (['string', 'number'].indexOf(typeof record[id]) !== -1)<br>  {<br>    const value = record[id].toString();<br><br>    if (result.indexOf(value) === -1)<br>    {<br>      result.push(value);<br>    }<br>  }<br>  return result;<br>} |

### `helper`

Change dropdown id to title from helper object


type: `arrayOf[object Object]`
defaultValue: `[]`


### `id`

Redux form state id


type: `string`
defaultValue: `'dropdownGroupByFilter'`


### `label`

Filter label


type: `string`
defaultValue: `''`


### `placeholder`

Field placeholder


type: `string`
defaultValue: `''`


### `reducer`

type: `func`
defaultValue: `(result, record, id) =>
{
  if (Array.isArray(record[id]))
  {
    record[id].forEach((field) =>
    {
      if (result.indexOf(field) === -1)
      {
        result.push(field);
      }
    });
  }
  else if (['string', 'number'].indexOf(typeof record[id]) !== -1)
  {
    const value = record[id].toString();

    if (result.indexOf(value) === -1)
    {
      result.push(value);
    }
  }
  return result;
}`

