import * as React from "react";
import { PopperProps } from "react-popper";

const MAXHEIGHT = convertRemToPixels(38);

export const ResponsiveDropdown: React.FC<{
  children: (
    modifiers: NonNullable<PopperProps["modifiers"]>,
    placement: NonNullable<PopperProps["placement"]>
  ) => React.ReactElement;
}> = ({ children }) => {
  return children(
    { ...modifiers, preventOverflow: { enabled: true, fn: updateFunc } },
    placement
  );
};

const updateFunc = (data: any) => {
  const popperOffset = data.offsets.popper;

  const { bottom: triggerBottom, top: triggerTop } =
    data.instance.reference.getBoundingClientRect();
  const wrapper = data.instance.popper.querySelector(".sked-dropdownlist-list");
  if (wrapper) {
    const { height: elementHeight } = wrapper.getBoundingClientRect();

    const outBot = triggerBottom + popperOffset.height - window.innerHeight;
    const outTop = popperOffset.height - triggerTop;

    if (elementHeight - outBot < 46) {
      data.instance.modifiers.find(
        ({ name }: { name: string }) => name === "flip"
      ).enabled = true;
      wrapper.style["max-height"] = `${Math.min(
        Math.max(elementHeight - outTop, 46) - 10,
        MAXHEIGHT
      )}px`;
    } else {
      data.instance.modifiers.find(
        ({ name }: { name: string }) => name === "flip"
      ).enabled = false;
      wrapper.style["max-height"] = `${Math.min(
        Math.max(elementHeight - outBot, 46) - 10,
        MAXHEIGHT
      )}px`;
    }

    // if (popperOffset.right > window.innerWidth) {
    //   data.offsets.popper.left = triggerLeft - elementWidth + triggerWidth - 9
    // } else {
    //   data.offsets.popper.left = triggerLeft
    // }
  }
  return data;
};

const placement = "bottom-start";

const modifiers: NonNullable<PopperProps["modifiers"]> = {
  flip: { enabled: false },
  shift: { enabled: true },
  hide: {
    enabled: false,
  },
};

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
