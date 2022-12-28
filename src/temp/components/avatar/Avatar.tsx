import * as React from "react";
import classnames from "classnames";
import { omit } from "lodash";

import { Tooltip } from "../popups/tooltip/Tooltip";

type AvatarSizes = "tiny" | "small" | "medium" | "large";
export interface IAvatar extends React.HTMLAttributes<HTMLDivElement> {
  /** This will be used for the 'letter' display and be the
   * default tooltip text if showTooltip is true
   * */
  name: string;
  /**
   * The url to use to fetch the avatar image
   */
  imageUrl?: string;
  /**
   * 'medium' is the default
   */
  size?: AvatarSizes;
  /**
   * Wrap the avatar in a tooltip
   */
  showTooltip?: boolean;
  /**
   * If you want your tooltip text to say something other
   * than the 'name' prop, you can supply the text to this prop
   */
  tooltipText?: string;
}

/**
 * Simple component for displaying avatars
 * @requires Tooltip
 */
export class Avatar extends React.PureComponent<IAvatar, {}> {
  sizeClassMap: { [key in AvatarSizes]: string } = {
    tiny: "sked-avatar--tiny",
    small: "sked-avatar--small",
    medium: "",
    large: "sked-avatar--large",
  };

  getInitials(name: string = "") {
    if (name.length > 1) {
      const [first, last] = name.trim().split(" ");
      return (
        first && last
          ? `${first.charAt(0)}${last.charAt(0)}`
          : first.substring(0, 2)
      ).toUpperCase();
    }
    return name.toUpperCase();
  }

  wrapInTooltip(avatar: JSX.Element) {
    return (
      <Tooltip
        content={this.props.tooltipText || this.props.name}
        position={"top"}
        delayShow={250}
      >
        {avatar}
      </Tooltip>
    );
  }

  renderAvatar() {
    const { name, size, className, imageUrl, ...rest } = this.props;
    const otherProps = omit(rest, ["showTooltip", "tooltipText"]);
    return (
      <div
        className={classnames(
          "sked-avatar",
          className,
          this.sizeClassMap[size]
        )}
        {...otherProps}
      >
        {imageUrl ? (
          <img className="sked-avatar__image" src={imageUrl} />
        ) : (
          this.getInitials(name)
        )}
      </div>
    );
  }

  render() {
    return this.props.showTooltip
      ? this.wrapInTooltip(this.renderAvatar())
      : this.renderAvatar();
  }
}
