`NestedList Component`
======================


```javascript
// Use classic UI level component

import NestedList from '/grid/pure/nestedList';
import Connect from '/grid/connect';

const groupBy: ['category', 'date']

<Connect
  id="products"
  UI={NestedList}
  uiProps={{
    groupBy,
  }}
/>

// ->
<div class="nested-list">
 <div class="group level-0">
  <h1>category#1</h1>
  <div class="items">...</div>
 </div>
 <div class="group level-0">
  <h1>category#1</h1>
  <div class="items">...</div>
 </div>
</div>

```

```javascript
// Use private different UI level component

const foo = 'bar';

const Level1 = ({ index, level, items, children }) => <div className={`level-${level}`}>{children}</div>
const Level2 = ({ index, level, items, children }) => <div>{index}: {foo}</div>

<Connect
  id="products"
  UI={NestedList}
  uiProps={{
    groupBy,
    UI: [Level1, Level2]
  }}
/>
// ->
<div class="level-0">
 <div>category#1: bar</div>
 <div>category#1: bar</div>
</div>
```

Props
-----

| Prop | Type | Required | Default |
| ---- | ---- | -------- | ------- |
| UI | union(func,arrayOf) |  | ({ index, children, level }) =><br>(<br>  <div className={`group level${level}`}><br>    <h1>{index}</h1><br>    <div className="items">{children}</div><br>  </div><br>) |
| className | string |  | 'nested-list' |

### `UI`

type: `union(func|arrayOf)`
defaultValue: `({ index, children, level }) =>
(
  <div className={`group level${level}`}>
    <h1>{index}</h1>
    <div className="items">{children}</div>
  </div>
)`


### `className`

type: `string`
defaultValue: `'nested-list'`

