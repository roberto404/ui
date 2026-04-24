import React from 'react';


/* !- React Elements */

// ...


/* !- Types */

type PropTypes = {
  title: string,
  subTitle: string,
  url: string,
  tag: string,
  button?: string,
  onChange: () => void,
}


/**
 * 
 */
const Sidebar = ({
  title = '',
  subTitle = '',
  url = '',
  tag = '',
  button,
  onChange,
}: PropTypes) => {
  const onChangeInputHandler = onChange;

  return (
    <div>
      <input
        value={title}
        id="title"
        onChange={onChangeInputHandler}
        placeholder="Kép címe"
        className="mb-1"
      />
      <textarea
        value={subTitle}
        id="subTitle"
        onChange={onChangeInputHandler}
        placeholder="Kép alcíme"
        className="mb-1"
      />
      <input
        value={url}
        id="url"
        onChange={onChangeInputHandler}
        placeholder="Hivatkozott weboldal"
        className="mb-1"
      />
      <input
        value={button}
        id="button"
        onChange={onChangeInputHandler}
        placeholder="Gomb felirat"
        className="mb-1"
      />
      <input
        value={tag}
        id="tag"
        onChange={onChangeInputHandler}
        placeholder="Címkék"
      />
    </div>
  );
}

export default Sidebar;