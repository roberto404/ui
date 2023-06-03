
import md5 from 'crypto-js/md5';


/* !- Constants */

const FILE_PATTERN = /^(([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})[a-f0-9]{24})/;


/**
 * File model
 */
export class File
{
  baseFolder = '/library/'

  /**
  * @constructs
  * @private
  * @param  {integer} hash
  */
  constructor(file = {})
  {
    // if ()
    // {
    //   throw new Error('File construct error.');
    // }

    this.id = file.id;
    this.name = file.name;
    this.ext = file.ext || 'jpg';
    this.key = 'f4cDFa';
  }

  setName = () =>
  {
    this.name = md5(this.key + this.id).toString();
  }


  /* !- Getter Setter */

  getUrl = (size, devicePixelRatio) =>
  {
    if (!this.name || !FILE_PATTERN.exec(this.name))
    {
      if (!this.id)
      {
        return '';
        // throw new Error('File hash error.');
      }

      this.setName();
    }

    let sizePrefix = '';

    if (size)
    {
      sizePrefix = `_${size}`;
    }

    const path = this.name.replace(FILE_PATTERN, '$2/$3/$4/$5/$1');
    const dpr = devicePixelRatio ? `@${devicePixelRatio}x` : '';

    return `${this.baseFolder + path + sizePrefix + dpr}.${this.ext}`;
  }

  getThumbnail = () => this.getUrl('250x250')
  getAvatar = () => this.getUrl('32x32')
}

export default File;