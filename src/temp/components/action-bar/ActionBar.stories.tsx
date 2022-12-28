import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { text, number, select } from "@storybook/addon-knobs/react";

import { Button } from "../buttons/button/Button";
import { Icon } from "../icon/Icon";
import { ButtonDropdown } from "../buttons/button-dropdown/ButtonDropdown";
import { Menu, MenuItem } from "../menu/Menu";
import {
  ActionBar,
  ActionBarActions,
  ActionBarViewControls,
} from "./ActionBar";

storiesOf("ActionBar", module)
  .add("ActionBar", () => {
    return (
      <ActionBar
        countValue={number("countValue", 200)}
        countName={text("countName", "jobs")}
      >
        <ActionBarActions>
          <Button buttonType="transparent" compact>
            Any Btn
          </Button>
          <Button buttonType="transparent" compact>
            Any Btn
          </Button>
        </ActionBarActions>
        <ActionBarViewControls withSearch={false}>
          <ButtonDropdown label="Group" buttonType="transparent" compact>
            <Menu>
              <MenuItem onClick={action("dropdown item clicked")}>
                Button dropdown children 1
              </MenuItem>
              <MenuItem>Button dropdown children 2</MenuItem>
              <MenuItem>
                This is a long list item that extends past the maxWidth of the
                dropdown
              </MenuItem>
            </Menu>
          </ButtonDropdown>
          <ButtonDropdown label="Resize" buttonType="transparent" compact>
            <Menu>
              <MenuItem onClick={action("dropdown item clicked")}>
                Button dropdown children 1
              </MenuItem>
              <MenuItem>Button dropdown children 2</MenuItem>
              <MenuItem>
                This is a long list item that extends past the maxWidth of the
                dropdown
              </MenuItem>
            </Menu>
          </ButtonDropdown>
        </ActionBarViewControls>
      </ActionBar>
    );
  })
  .add("ActionBar with search", () => {
    return (
      <ActionBar
        countValue={number("countValue", 200)}
        countName={text("countName", "jobs")}
      >
        <ActionBarActions>
          <Button buttonType="transparent" compact>
            Any Btn
          </Button>
          <Button buttonType="transparent" compact>
            Any Btn
          </Button>
        </ActionBarActions>
        <ActionBarViewControls withSearch={true}>
          <ButtonDropdown label="Group" buttonType="transparent" compact>
            <Menu>
              <MenuItem onClick={action("dropdown item clicked")}>
                Button dropdown children 1
              </MenuItem>
              <MenuItem>Button dropdown children 2</MenuItem>
              <MenuItem>
                This is a long list item that extends past the maxWidth of the
                dropdown
              </MenuItem>
            </Menu>
          </ButtonDropdown>
          <ButtonDropdown label="Resize" buttonType="transparent" compact>
            <Menu>
              <MenuItem onClick={action("dropdown item clicked")}>
                Button dropdown children 1
              </MenuItem>
              <MenuItem>Button dropdown children 2</MenuItem>
              <MenuItem>
                This is a long list item that extends past the maxWidth of the
                dropdown
              </MenuItem>
            </Menu>
          </ButtonDropdown>
        </ActionBarViewControls>
      </ActionBar>
    );
  });
