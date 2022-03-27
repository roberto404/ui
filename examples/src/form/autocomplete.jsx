import React from 'react';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';



import Form from '../../../src/form/pure';
import Autocomplete, { TagsMenu } from '../../../src/form/pure/autocomplete';
import Select from '../../../src/form/pure/select';
import Toggle from '../../../src/form/pure/toggle';
import Collection from '../../../src/form/pure/collection';





const fakeWords = ['tetch', 'psycless', 'mclandericked', 'dentment', 'urez', 'behesidutte', 'aplicorter', 'eipertor', 'glaphany', 'sematerfecon', 'hiba', 'watchetifuters', 'creatise', 'collup', 'derb', 'aircusuade',  'loheckle', 'taclininterish'];


const dataForComplex = [
  { id: '1', title: 'direction', category: 'select', options: [
    { id: '1', title: 'vertical' },
    { id: '2', title: 'horizontal' },
  ]},
  { id: '2', title: 'edge', category: 'select', options: [
    { id: '1', title: 'normal'},
    { id: '2', title: 'ABS' },
  ]},
];


export const CollectionItem = (props) =>
{
  const {
    id,
    onChange,
  } = props;

  let record = props.record;
  const isOptions = ['select', 'multiselect'].indexOf(record.category) !== -1;

  /**
   * onChange => { field, operator, value }
   */
  const onChangeHandler = ({ id, value }) =>
  {
    const collectionId = id.substring(id.indexOf('#') + 1);

    if (record[collectionId] !== value)
    {
      if (collectionId === 'category' && !isOptions)
      {
        delete record.options;
      }

      onChange({ ...record, [collectionId]: value });
    }
  };

  const onSelectHandler = (props) =>
  {
    record = {
      ...record,
      title: props.title,
      category: props.category,
      options: props.options,
    };

    onChange(record);
  }

  /**
   * form collection pass onChange method
   */
  return (
    <div className="grid-2 w-full h-center">
      <div className="col-3-12">
        <Autocomplete
          id={`${id}#title`}
          placeholder="ex. direction"
          onChange={onChangeHandler}
          onSelect={onSelectHandler}
          data={dataForComplex}
          value={record.title}
        />
      </div>
      <Toggle
        id={`${id}#mandatory`}
        onChange={onChangeHandler}
        className="col-1-12"
        value={record.mandatory}
      />
      <Select
        id={`${id}#category`}
        onChange={onChangeHandler}
        data={[
          { id: 'input', title: 'Input' },
          { id: 'boolean', title: 'Boolean' },
          { id: 'select', title: 'Select' },
          { id: 'multiselect', title: 'Multiselect' },
        ]}
        className="col-3-12"
        value={record.category}
        placeholder
      />
      { isOptions &&
      <div className="col-5-12">
        <Autocomplete
          id={`${id}#options`}
          onChange={onChangeHandler}
          placeholder=""
          // onSelect={onSelectHandler}
          // data={dataForComplex.map(({ options }) => options)}
          value={record.options}
          multiple
        />
      </div>
      }
    </div>
  );
};



const ExampleForm = () =>
{
  const autoCompleteHandler = ({ id, value, form }) =>
  {
    return true;
  }

  

  return (
    <div>
      <Form
        id="example"
        className="card p-2"
      >
        <h2>Classic</h2>

        <Autocomplete
          label="Autocomplete"
          id="autocomplete"
          placeholder="ex. mclandericked"
          data={fakeWords.map((word, i) => ({ id: i, title: word, bar: 'foo' }))}
        />

        <h2>Multiple</h2>

        <Autocomplete
          label="Multi Autocomplete"
          id="autocomplete2"
          placeholder="ex. mclandericked"
          multiple
          data={fakeWords.map((word, i) => ({ id: i, title: word, bar: 'foo' }))}
        />
        
        <h2>Custom Multiple Tags</h2>

        <Autocomplete
          label="Custom tags"
          id="autocomplete3"
          placeholder="ex. direction"
          tags={TagsMenu}
          multiple
          data={fakeWords.map((word, i) => ({ id: i, title: word, bar: 'foo' }))}
        /> 

        <h2>OnSelect in the collection</h2>

        <div className="grid-2 w-full border-bottom mb-1 pb-1 text-gray boder-gray uppercase text-xs">
          <div className="col-3-12">Title</div>
          <div className="col-1-12">*</div>
          <div className="col-3-12">Category</div>
          <div className="col-5-12">Options</div>
        </div>

        <Collection
          id="autocomplete4"
          UI={CollectionItem}
          value={[{ title: 'Title', category: 'select', options: [{ id: '1', title: 'foo' }] }]}
          className="w-full"
        />

        <h2>Lots of child data</h2>

        <Autocomplete
          label="Autocomplete"
          id="autocomplete5"
          data={produceNumericArray(0, 100).map(i => ({ id: i, title: i }))}
        />
      </Form>
    </div>
  )
};

export default ExampleForm;