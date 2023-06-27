import React from "react";
import { useTranslate } from "react-admin";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function SubMenuHeader({ dense, name, isOpened, onToggle }) {
  const translate = useTranslate();

  return (
    <MenuItem button dense={dense} onClick={onToggle}>
      <ListItemIcon
        sx={{
          minWidth: spacing(5)
        }}
      >
        {isOpened ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </ListItemIcon>
      <Typography variant="inherit" color="textSecondary">
        {translate(name)}
      </Typography>
    </MenuItem>
  );
}

export default SubMenuHeader;
