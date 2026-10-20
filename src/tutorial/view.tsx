'use client';

import React from 'react';
import { useSelector } from 'react-redux';

/* !- Components */

import TutorialButton from './button';

/* !- Types */

import { StateTypes as RootStateTypes } from '../reducers';


/**
 * A view csoport aktív nézetéhez tartozó tutorials.id (nincs → undefined).
 *
 * @param group view csoport id (pl. `layout`), üresen a globális `view.active`
 * @param ids nézet id → tutorials.id
 *
 * @example
 * const id = useViewTutorialId('layout', { category: 2 });
 */
export const useViewTutorialId = (group: string | undefined, ids: Record<string, number>) =>
  useSelector(({ view }: RootStateTypes) => {
    const groupId = group || view.active;
    const active = (groupId && view.groups[groupId] || []).find(({ status }) => status);

    return active ? ids[active.id] : undefined;
  });


type PropTypes = {
  /** view csoport id (pl. `layout`), üresen a globális `view.active` */
  group?: string,
  /** nézet id → tutorials.id; amelyik nézet nincs benne, ott nem jelenik meg a gomb */
  ids: Record<string, number>,
  /** a gomb az aktív nézet tutorial id-jével (alapból `TutorialButton`) */
  children?: (id: number) => React.ReactNode,
};

/**
 * View-váltást figyelő tutorial gomb: a csoport aktív nézete alapján választja
 * a tutorials.id-t, és azzal rendereli a gombot. Ha a nézethez nincs tutorial, semmit nem renderel.
 *
 * @example
 * <TutorialView group="layout" ids={{ couponReport: 3 }}>
 *   {id => <ButtonTutorial id={id} />}
 * </TutorialView>
 */
const TutorialView = ({
  group,
  ids,
  children = id => <TutorialButton id={id} />,
}: PropTypes) => {
  const id = useViewTutorialId(group, ids);

  return id ? <>{children(id)}</> : null;
};

export default TutorialView;
