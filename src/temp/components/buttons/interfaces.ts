import { Placement } from "@popperjs/core";
import { IPopOutProps, IButtonProps } from "../..";

export interface IButtonDropdownCommon extends Partial<IButtonProps> {
  placement?: Placement;
  /**
   * Dropdown content is placed in a PopOut which is wrapped in a Portal by default.
   * You can override that container using this prop.
   */
  popOutContainer?: IPopOutProps["popOutContainer"];
}
