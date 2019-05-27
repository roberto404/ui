
function stringOfLength(string, length)
{
  var newString = '';
  for (var i = 0; i < length; i++) {
    newString += string;
  }
  return newString;
}

function generateTitle(name)
{
  var title = '`' + name + '`';
  return title + '\n' + stringOfLength('=', title.length) + '\n';
}

function generateExample(example)
{
  return '\n' + '```javascript' + '\n' + example + '\n' + '```' + '\n';
}

function generateDescription(content)
{
  let description = '';
  let example;
  const lines = content.split('\n');

  lines.forEach((line, index) =>
  {
    if (line.trim() === '@example')
    {
      if (example)
      {
        description += generateExample(example.join('\n'));
      }
      example = [];
    }
    else if (Array.isArray(example))
    {
      example.push(line);

      if (index === lines.length - 1)
      {
        description += generateExample(example.join('\n'));
      }
    }
    else
    {
      description += `${line}\n`;
    }
  });

  return description;
}

function generateTitleAndDescription(content)
{
  const lines = content.split('\n');

  return (
    generateTitle(lines[0]) +
    generateDescription(lines.slice(1).join('\n'))
  );
}

function generatePropType(type)
{
  var values;

  if (typeof type === 'undefined')
  {
    return values;
  }

  if (Array.isArray(type.value))
  {
    values = '(' +
    type.value.map(function(typeValue) {
      return typeValue.name || typeValue.value;
    }).join('|') +
    ')';
  }
  else
  {
    values = type.value;
  }

  return 'type: `' + type.name + (values ? values: '') + '`\n';
}

function generatePropDefaultValue(value)
{
  if (typeof value !== 'object')
    return false;

  return 'defaultValue: `' + value.value + '`\n';
}

function generateProp(propName, prop) {
  return (
    '### `' + propName + '`' + (prop.required ? ' (required)' : '') + '\n' +
    '\n' +
    (prop.description ? generateDescription(prop.description) + '\n\n' : '') +
    (prop.type ? generatePropType(prop.type) : '') +
    (prop.defaultValue ? generatePropDefaultValue(prop.defaultValue) : '') +
    '\n'
  );
}

function generatePropsTable(props)
{
  return (
    '| Prop | Type | Required | Default |\n' +
    '| ---- | ---- | -------- | ------- |\n' +
    Object.keys(props).sort().map((propName) =>
    {
      const propProps = props[propName];
      const defaultValue = (typeof propProps.defaultValue === 'object') ?
        propProps.defaultValue.value.replace(/\n/g, '<br>') : '';
      const required = propProps.required ? '*' : '';

      if (typeof propProps.type === 'undefined')
      {
        console.log('\x1b[41m%s\x1b[0m', `Missing propTypes: ${propName}`);
        return `| ${propName} | ? | ${required} | ${defaultValue} |`;
      }

      let propType = generatePropType(propProps.type);
      propType = propType.slice(propType.indexOf('`') + 1, propType.lastIndexOf('`')).replace('|', ',');


      return `| ${propName} | ${propType} | ${required} | ${defaultValue} |`;
    }).join('\n') + '\n'
  );
}

function generateProps(props)
{
  var title = 'Props';

  return (
    title + '\n' +
    stringOfLength('-', title.length) + '\n' +
    '\n' +
    generatePropsTable(props) + '\n' +
    Object.keys(props).sort().map(function(propName) {
      return generateProp(propName, props[propName]);
    }).join('\n')
  );
}

function generateMarkdown(name, reactAPI)
{
  let markdownString = generateTitleAndDescription(reactAPI.description) + '\n';

  if (reactAPI.props)
    markdownString += generateProps(reactAPI.props);

  return markdownString;
}

module.exports = generateMarkdown;
