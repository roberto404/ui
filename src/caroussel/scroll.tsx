import React, { useEffect, useRef, useState } from "react";

import { getColClassesByNum } from "./getColNum";
import { useHookUpdateProps } from '../hooks';


import ScrollBar from './scrollBar';



type PropTypes = {
  data: { id: number | string, slide: JSX.Element }[],
  colNum?: number,
  page?: number,
  totalPage?: number,
  onChangePage?: (nextPage: number) => void,
}



/**
 * 
 */
const ScrollCaroussel = (props: PropTypes) => {

  const {
    data = [],
    colNum = 2,
    page = 1,
    totalPage = 1,
    onChangePage,
  } = props;

  const elementRef = useRef(null);
  const pageRef = useRef(page);
  const [scroll, setScroll] = useState({ left: 0, width: 0, canvas: 0, percent: 0 });


  // reset position on props.page changes
  if (pageRef.current !== page && elementRef.current) {

    elementRef.current.scrollTo({
      left: calcScrollLeft(),
      behavior: 'smooth',
    });

    pageRef.current = page;
  }


  const calcScrollLeft = () => {

    const {
      scrollWidth,
    } = elementRef.current;

    const left = Math.round(scrollWidth / totalPage) * (page - 1);

    return left;
  }


  /**
   * Determine page position and if changed pass to onChangePage(nextPage)
   */
  const onScroll = (event) => {

    if (!event?.target) {
      return;
    }

    const {
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = event.target;

    setScroll({
      left: scrollLeft,
      width: scrollWidth,
      canvas: clientWidth,
      percent: scrollLeft / (scrollWidth - clientWidth),
    });

    const pageWidth = scrollWidth / totalPage;

    const nextPage = Math.round(scrollLeft / pageWidth) + 1;

    // scroll use paginator action
    if (totalPage > page && nextPage !== page) {
      pageRef.current = nextPage;

      if (typeof onChangePage === 'function') {
        onChangePage(nextPage);
      }
    }
  };

  const onScrollListener = useHookUpdateProps(onScroll, [page]);

  // component mount and unmount
  useEffect(() => {

    const element = elementRef.current;

    if (element) {
      element.addEventListener('scroll', onScrollListener);
    }

    onScroll({ target: element });

    // set page position on first load
    if (pageRef.current > 0) {
      element.scrollLeft = calcScrollLeft();
    }

    // will unmount or before new props apply
    return () => {
      if (element) {
        element.removeEventListener('scroll', onScrollListener);
      }
    };
  }, []);

  return (
    <div>
      <div className="slide-mask">
        {/* @todo lineHeight fontos lenne 1px gap miatt block utan de a productThumbot osszetori */}
        <div className="slides scroll" /*style={{ lineHeight: 0 }}*/ ref={elementRef}>
          {
            data.map(({ id, slide }) => (
              <div key={id} className={getColClassesByNum(colNum)}>
                {slide}
              </div>
            )
            )
          }
        </div>
      </div>
      {/* <ScrollBar scroll={scroll} /> */}
    </div>
  )
};


export default ScrollCaroussel;