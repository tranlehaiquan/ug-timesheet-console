import * as React from "react";
import classnames from "classnames";

import { Icon } from "../../icon/Icon";
import { Button } from "../../buttons/button/Button";
import { FormInputElement } from "../../forms/FormElements";

interface IActionBarSearchItemProps
  extends React.HTMLAttributes<HTMLInputElement> {
  /**
   * function for handling clear action
   */
  onClear?: () => void;
  className?: string;
}

export const ActionBarSearchItem: React.FC<IActionBarSearchItemProps> =
  React.forwardRef((props, ref) => {
    const [inputValue, setInputValue] = React.useState("");
    const [searchActive, setSearchActive] = React.useState(false);
    const refLocal = React.useRef(null);

    const refToUse = ref || refLocal;

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange && props.onChange(e);
      setInputValue(e.target.value);
    };

    const openHandler = (event: React.MouseEvent) => {
      !searchActive && setSearchActive(true);
    };

    const closeHandler = (event: React.MouseEvent | React.FocusEvent) => {
      if (inputValue === "") {
        searchActive && clearInputHandler(event);
        setSearchActive(!searchActive);
      }
    };

    const clearInputHandler = (event: React.MouseEvent | React.FocusEvent) => {
      setInputValue("");
      // onClear function needs to be used here due to inability to pass empty string with click event
      props.onClear && props.onClear();
      setSearchActive(!searchActive);
    };

    const { onClear, ...otherProps } = props;
    return (
      <React.Fragment>
        {searchActive && (
          <div className="sk-flex sk-items-center sk-w-auto sk-h-9 sk-outline-none sk-rounded sk-py-2 sk-relative">
            <FormInputElement
              {...otherProps}
              ref={refToUse as any}
              value={inputValue}
              className="sk-w-64 sk-pr-7"
              type="text"
              placeholder="Search"
              onChange={changeHandler}
              autoFocus
              data-sk-name="action-bar-search-input"
              onBlur={closeHandler}
            />
            {inputValue && (
              <Button
                className="sk-text-grey sk-absolute"
                style={{ right: "0" }}
                buttonType="transparent"
                compact={true}
                disabled={false}
                loading={false}
                onClick={clearInputHandler}
                data-sk-name="action-bar-search-clear-button"
              >
                <Icon name="remove" size={8} />
              </Button>
            )}
          </div>
        )}
        <Button
          data-sk-name="action-bar-search-button"
          className={classnames({ "sk-cursor-default": searchActive })}
          buttonType="transparent"
          compact={false}
          disabled={false}
          loading={false}
          onClick={openHandler}
        >
          <Icon name="search" size={16} />
        </Button>
      </React.Fragment>
    );
  });
