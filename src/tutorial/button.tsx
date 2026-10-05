'use client';

import React from 'react';
import classNames from 'classnames';

/* !- Hooks */

import { useStartTutorial } from './hooks';


type PropTypes = {
  /** tutorials.id */
  id: number,
  /** ettől a lépéstől indul (0-tól) */
  index?: number,
  className?: string,
  title?: string,
  /** alapból a `title` szöveges linkként */
  children?: React.ReactNode,
  /** betöltés alatt a children helyén (alapból preloader) */
  loading?: React.ReactNode,
};

/**
 * CTA: kattintásra betölti a tutorialt a kontakt2 API-ból, majd elindítja.
 * Betöltés alatt a children helyén a `loading` látszik.
 *
 * @example
 * <TutorialButton id={12} />
 * <TutorialButton id={12} loading="Betöltés...">Hogyan működik?</TutorialButton>
 */
const TutorialButton = ({
  id,
  index = 0,
  className,
  title = 'Súgó',
  children,
  loading = <div className="preloader text-xs" />,
}: PropTypes) => {
  const { start, loading: isLoading } = useStartTutorial();

  const onClickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    start(id, index);
  };

  return (
    <button
      className={classNames('initial tutorial-button pointer', { 'is-loading': isLoading }, className)}
      title={title}
      aria-busy={isLoading}
      disabled={isLoading}
      onClick={onClickHandler}
    >
      {isLoading ? loading : (children || title)}
    </button>
  );
};

export default TutorialButton;
