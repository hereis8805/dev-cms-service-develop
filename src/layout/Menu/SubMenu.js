import React from "react";
import { Collapse, List, Tooltip } from "@mui/material";

import SubMenuHeader from "./SubMenuHeader";

function SubMenu({ children, dense, isOpened, isOpenedSidebar, name, onToggle }) {
  return (
    <>
      {isOpenedSidebar || isOpened ? (
        <SubMenuHeader dense={dense} isOpened={isOpened} name={name} onToggle={onToggle} />
      ) : (
        <Tooltip>
          <SubMenuHeader dense={dense} isOpened={isOpened} name={name} onToggle={onToggle} />
        </Tooltip>
      )}
      <Collapse unmountOnExit in={isOpened} timeout="auto">
        <List
          disablePadding
          component="div"
          dense={dense}
          sx={{
            "& a": {
              paddingRight: 100,
              paddingLeft: isOpenedSidebar ? 4 : 2,
              transition: `padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms`
            }
          }}
        >
          {children}
        </List>
      </Collapse>
    </>
  );
}

export default SubMenu;
