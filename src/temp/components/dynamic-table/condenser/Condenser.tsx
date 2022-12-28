import * as React from "react";
import { Tooltip } from "../../popups/tooltip/Tooltip";

export interface ICondenserProps {
  children?: string | React.ReactNode;
}

export const Condenser: React.FC<ICondenserProps> = ({ children }) => {
  const ref = React.useRef();
  const [overflow, setOverflow] = React.useState(false);

  const checkOverflow = () => {
    if (ref && ref.current) {
      const wrapper: HTMLElement = ref.current;
      setOverflow(wrapper.clientWidth < wrapper.scrollWidth);
    }
  };

  return (
    <Tooltip
      preventShow={!overflow}
      content={children}
      delayShow={250}
      position="top"
      className="sk-truncate"
    >
      <div
        data-sk-name="children-container"
        ref={ref}
        className="sk-truncate"
        onMouseEnter={checkOverflow}
      >
        {children}
      </div>
    </Tooltip>
  );
};
