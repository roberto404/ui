import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useApiSuccessContext, Status } from '../api';

/* !- Actions */

import { setTutorial } from './actions';

/* !- Types */

import { Tutorial } from './types';


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
      dispatch(setTutorial(response.records, index));
    }
  };

  return { start, loading };
};
