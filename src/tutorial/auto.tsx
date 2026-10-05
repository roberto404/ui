'use client';

/* !- Hooks */

import { useAutoTutorial } from './hooks';


type PropTypes = {
  /** direkt bekötés: ez a tutorial indul, ha automatikus (status = 2) */
  id?: number,
  /** url alapú: az első automatikus tutorial, amelynek első lépése ezen az oldalon van */
  url?: string,
};

/**
 * Automatikus indítás (felhasználónként egyszer, localStorage), markup nélkül.
 *
 * @example
 * // website2: direkt bekötés az oldalon
 * <TutorialAuto id={12} />
 *
 * // kontakt2: url alapú, az app gyökerében
 * <TutorialAuto url={location.pathname} />
 */
const TutorialAuto = ({ id, url }: PropTypes) => {
  useAutoTutorial({ id, url });
  return null;
};

export default TutorialAuto;
