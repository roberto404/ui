import React from "react";

/**
 * @example
<div>
  {nl2br(`
1
2
3
`)}
</div>
 */
export const nl2br = (text: string) =>
  text
    .trim()
    .split('\n')
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

/**
 * tagged template literal,
 * @example
<div>{nl2br`
1
2
3
`}</div>
 */
const nl2brTemplate = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): JSX.Element[] => {
  const text = strings.reduce(
    (acc, str, i) => acc + str + (values[i] ?? ''),
    ''
  );

  return nl2br(text);
};



export default nl2brTemplate;