`Grid Pure Component`
=====================


```javascript
import Grid from '@1studio/ui/grid/grid'
const gridData = [
  { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
  { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
  { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
  { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
];

<Grid data={gridData} />

```

```javascript
const gridData = [
  { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
  { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
  { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
  { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
];
const gridSettings =
  {
    hook:
    {
      name: 'Name',
      visits:
      {
        title: 'Visits',
        format: ({ value }) => new Date(value).toLocaleDateString(),
      },
      gender:
      {
        title: 'Gender',
        format: ({ value, config }) => config.gender[value],
      },
    },
    helper:
    {
      gender: { 1: 'male', 2: 'female' },
    },
    order:
    {
      column: 'name',
      order: 'desc'
    }
  };
<Grid
  data={gridData}
  hook={gridSettings.hook}
  helper={gridSettings.helper}
/>
```

Props
-----

| Prop | Type | Required | Default |
| ---- | ---- | -------- | ------- |
| bodyClassName | string |  | 'tbody' |
| checkboxSelect | bool |  | false |
| className | string |  | 'grid' |
| data | arrayOf[object Object] |  | [] |
| expandSelect | bool |  | false |
| freezeHeader | bool |  | false |
| headClassName | string |  | 'thead' |
| height | string |  | '' |
| helper | objectOf[object Object] |  | {} |
| hook | objectOf[object Object] |  | {} |
| infinity | bool |  | false |
| multipleSelect | bool |  | true |
| noResults | union(string,element) |  | 'No Results.' |
| onChangeOrder | func |  | function() {} |
| onClickCell | func |  | function() {} |
| orderColumn | union(string,func) |  | '' |
| orderDirection | enum('asc','desc'|'') |  | '' |
| rowElement | func |  | ({ children, onClick, data, className }) =><br>  <div className={className} onClick={onClick}>{children}</div> |
| selectable | bool |  | false |
| showHeader | bool |  | true |

### `bodyClassName`

type: `string`
defaultValue: `'tbody'`


### `checkboxSelect`

type: `bool`
defaultValue: `false`


### `className`

type: `string`
defaultValue: `'grid'`


### `data`

Content of the Grid

```javascript
   [
     { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
     ...,
   ];
```


type: `arrayOf[object Object]`
defaultValue: `[]`


### `expandSelect`

When select a new record it is automatically expand the selection list


type: `bool`
defaultValue: `false`


### `freezeHeader`

Always visible header, you must set height


type: `bool`
defaultValue: `false`


### `headClassName`

type: `string`
defaultValue: `'thead'`


### `height`

type: `string`
defaultValue: `''`


### `helper`

Serve data for hook


```javascript
{
 userId: { 1: 'John', 2: 'Doe', ... },
}
or
{
 userId: [
   { id: 1, title: 'John' },
   { id: 2, title: 'Doe' },
 ]
}
```


type: `objectOf[object Object]`
defaultValue: `{}`


### `hook`

Determine visible column,
Change column title and format the columns value

```javascript
{
 name: 'Name',
 visits:
 {
   title: 'Visits',
   format: ({ value }) => new Date(value).toLocaleDateString(),
   status: 1,
   width: '50%',
 }
}

// ->
@type {string}
title: change rawData key to custom column title.

@type {function}
@param {string} column record key
tooltip: create help badge to title, onClick call this function

@type {function}
@param {object} object {
 column: current record key
 columnHook: current column hook props
 helper: table helpers
 record: current row = data.record
 value: current row and column value = record key value
 data: current visible data = paginated data
 index: record index within data
 }
@return {string}
format: change the record value

@type {number}
status: determine the visibility of columns

@type {string}
width: cell relative width in percent Eg: '50%'
```


type: `objectOf[object Object]`
defaultValue: `{}`


### `infinity`

Enable infinity scroll (ReactList)
UITableView Inspired
https://github.com/coderiety/react-list


type: `bool`
defaultValue: `false`


### `multipleSelect`

Enable select more than one item from grid


type: `bool`
defaultValue: `true`


### `noResults`

This text appear when data props is empty


type: `union(string|element)`
defaultValue: `'No Results.'`


### `onChangeOrder`

OnChangeOrder handler
@param {string} columnId

```javascript
   <Grid
     onChangeOrder={columnId => console.log(columnId)}
     />
```


type: `func`
defaultValue: `function() {}`


### `onClickCell`

OnClickCell handler
@param {int} rowIndex number of row
@param {int} colIndex number of cell

```javascript
   <Grid
     onClickCell={(rowIndex, colIndex) => console.log(rowIndex, colIndex)}
     />
```


type: `func`
defaultValue: `function() {}`


### `orderColumn`

Column title indicator, which shows ordered column
Order direction will show in this column title


type: `union(string|func)`
defaultValue: `''`


### `orderDirection`

Column title indicator, which shows order direction


type: `enum('asc'|'desc'|'')`
defaultValue: `''`


### `rowElement`

Custom grid row componet

```javascript
const Row = ({ data, columns }) => (
 <tr>
  {columns.map(column => <td key={column}>{data[column]}</td>)}
 </tr>
);

Row.propTypes =
{
 data: PropTypes.objectOf(PropTypes.oneOfType([
   PropTypes.string,
   PropTypes.number,
 ])).isRequired,
 columns: PropTypes.arrayOf(PropTypes.string),
};

Row.defaultProps =
{
 columns: [],
};

<Grid
rowElement={Row}
/>
```


type: `func`
defaultValue: `({ children, onClick, data, className }) =>
  <div className={className} onClick={onClick}>{children}</div>`


### `selectable`

Enable select one item from grid


type: `bool`
defaultValue: `false`


### `showHeader`

Determine visiblity of table's header


type: `bool`
defaultValue: `true`

