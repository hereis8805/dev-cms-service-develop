import React from "react";

import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";

function UploadedFile({ fileName, onDeleteFile }) {
  return (
    <ListItem
      secondaryAction={
        !!onDeleteFile ? (
          <IconButton edge="end" aria-label="delete" onClick={onDeleteFile}>
            <DeleteIcon />
          </IconButton>
        ) : null
      }
      sx={{
        paddingLeft: 0,
      }}
    >
      <ListItemIcon>
        <AttachFileIcon />
      </ListItemIcon>
      <ListItemText
        disableTypography
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        primary={fileName}
      />
    </ListItem>
  );
}

export default UploadedFile;
