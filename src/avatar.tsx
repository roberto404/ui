import React from 'react';
import classNames from 'classnames';

import File from './form/file';


/* !- Types */

/** profile image file (API: users.avatarFileId -> { id, ext }) */
export type AvatarFile = {
  id: number;
  ext?: string;
};

type PropTypes = {
  avatar?: AvatarFile | null;
  /** the monogram (first letter) when there is no image */
  name?: string;
  /**
   * resized image from the library: '<width>x<height>', created on demand
   * (ask the double of the displayed size: the '@2x' url is not handled by the API)
   */
  size?: string;
  className?: string;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

/**
 * Load the resized profile image into the browser cache
 * @return resolves when it is loaded (or failed / there is no image) -> it can be shown at once
 */
export const preloadAvatar = (avatar: AvatarFile | null | undefined, size = '128x128'): Promise<void> =>
  new Promise((resolve) => {
    if (!avatar?.id) {
      resolve();
      return;
    }

    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = new File(avatar).getUrl(size);
  });

/**
 * Profile image (`.avatar`) or the monogram of the name
 *
 * @example
 * <Avatar avatar={{ id: 123, ext: 'jpg' }} name="Gulyás Róbert" size="128x128" />
 * // => background: /library/aa/bb/cc/dd/<hash>_128x128.jpg
 */
const Avatar = ({ avatar, name = '', size = '128x128', className, title, onClick }: PropTypes) => {
  const url = avatar?.id ? new File(avatar).getUrl(size) : '';

  return (
    <div
      className={classNames('avatar', className)}
      style={url ? { backgroundImage: `url(${url})` } : undefined}
      title={title}
      onClick={onClick}
    >
      {!url && <span>{name.charAt(0)}</span>}
    </div>
  );
};

export default Avatar;
