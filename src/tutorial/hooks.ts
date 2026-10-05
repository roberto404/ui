import { useEffect, useRef, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useApiContext, useApiSuccessContext, Status } from '../api';

/* !- Actions */

import { setTutorial } from './actions';

/* !- Constants */

import { isTutorialSeen, setTutorialSeen } from './utils';

/* !- Types */

import { Tutorial, TutorialStateType } from './types';


/**
 * CTA: betölti a tutorialt az API-ból, majd elindítja.
 * A `loading` a betöltés idejére true (a hívó jeleníti meg, pl. TutorialButton `loading`),
 * hiba esetén az api modal-ja jelzi.
 *
 * @example
 * const { start, loading } = useStartTutorial();
 * <span onClick={() => start(12)}>{loading ? <Preloader /> : 'Súgó'}</span>
 */
export const useStartTutorial = () => {
  const dispatch = useDispatch();
  const apiSuccess = useApiSuccessContext();
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  const start = async (id: number, index = 0) => {
    if (loading) {
      return;
    }

    setLoading(true);

    const response = await apiSuccess<Tutorial>({ url: `tutorial/readOneToWebsite/${id}` })
      .catch(() => null);

    if (isMounted.current) {
      setLoading(false);
    }

    if (response?.status === Status.SUCCESS && response.records?.steps?.length) {
      setTutorialSeen(id);
      dispatch(setTutorial(response.records, index));
    }
  };

  return { start, loading };
};

/**
 * Automatikus indítás, csendben (nincs notification, hiba esetén sem):
 * - `id`: az adott tutorial, ha automatikus (status = 2)
 * - `url`: az első olyan automatikus tutorial, amelynek első lépése ezen az oldalon van
 * Csak egyszer indul el (localStorage), és nem szakít félbe futó tutorialt.
 */
export const useAutoTutorial = ({ id, url }: { id?: number, url?: string }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const api = useApiContext();

  useEffect(() => {
    if ((!id && !url) || (id && isTutorialSeen(id))) {
      return;
    }

    let isMounted = true;

    const request = id
      ? api<Tutorial>({ url: `tutorial/readOneToWebsite/${id}` })
        .then((response) => (response?.status === Status.SUCCESS ? [response.records] : []))
      : api<Tutorial[]>({ url: `tutorial/readAllByUrl?url=${encodeURIComponent(url || '')}` })
        .then((response) => (response?.status === Status.SUCCESS ? response.records : []));

    request
      .then((tutorials: Tutorial[]) => {
        const tutorial = (tutorials || []).find(item =>
          item
          && +item.status === 2
          && item.steps?.length
          && !isTutorialSeen(item.id),
        );

        if (!isMounted || !tutorial || (store.getState() as { tutorial?: TutorialStateType }).tutorial?.active) {
          return;
        }

        setTutorialSeen(tutorial.id);
        dispatch(setTutorial(tutorial));
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, [id, url]);
};
