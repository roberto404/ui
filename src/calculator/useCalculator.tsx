import React from "react";
import { useDispatch } from "react-redux";

/* !- Redux Actions */

import { flush, popover } from "../layer/actions";

/* !- Components */

import Calculator, { CalculatorPropTypes } from "./index";

/**
 * Kalkulátor a ui layer popoverében, a kattintott elemhez igazítva.
 * Pipa / Enter: `onSubmit`, majd bezárul; Esc vagy kattintás mellé: bezárul.
 *
 * @example
 * const openCalculator = useCalculator();
 * <div onClick={(event) => openCalculator(event, { value: 1000, unit: 'mm', onSubmit })} />
 */
const useCalculator = () => {
  const dispatch = useDispatch();

  /**
   * `useMousePosition`: a kattintás helyéhez igazít (pl. hosszú SVG vonalnál), nem az elemhez
   * `className`: a popover rétegére (pl. `font-size: 80%` → kisebb kalkulátor)
   */
  return (
    event:
      | React.MouseEvent
      | { currentTarget: Element; clientX?: number; clientY?: number },
    props: CalculatorPropTypes,
    {
      useMousePosition = false,
      className,
    }: { useMousePosition?: boolean; className?: string } = {},
  ) => {
    const close = () => {
      dispatch(flush());
      props.onClose?.();
    };

    dispatch(
      popover(
        <Calculator
          {...props}
          onClose={close}
          onSubmit={(value) => {
            props.onSubmit(value);
            close();
          }}
        />,
        event,
        {
          className: className ? `calculator-layer ${className}` : "calculator-layer",
          useMousePosition,
        },
      ),
    );
  };
};

export default useCalculator;
