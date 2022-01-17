/**
 * CompositeDecorator helper
 * 
 * Callback will invoke the ranges for all maches found
 * 
 * @param {RegExp} regex Eg.: new RegExp('hello', 'g');
 * @param {ContentBlock} contentBlock 
 * @param {function} callback 
 */
const findWithRegex = (regex, contentBlock, callback) =>
{
  const paragraph = contentBlock.getText();

  let match, start, end;

  while ((match = regex.exec(paragraph)) !== null)
  {
    start = match.index;
    end = start + match[0].length;
    
    callback(start, end, match);
  }
};

export default findWithRegex;