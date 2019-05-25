
/* !- React Elements */

import Input from './input';


/**
* Textarea Component
*
* @extends Input
* @example
* <Textarea
*  { ...InputProps }
*  rows={3}
*  rowsMax={3}
* />
*/
class Textarea extends Input
{
}

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Textarea.defaultProps =
{
  ...Input.defaultProps,
  multiLine: true,
  rows: 2,
  rowsMax: 8,
};

export default Textarea;
