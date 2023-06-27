import React from "react";
import { Toolbar, SaveButton, DeleteButton, ListButton } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    display: "flex"
  },
  saveButton: {
    marginRight: "0.5rem"
  },
  deleteButton: {
    marginLeft: "auto"
  }
});

function EditMailListToolbar(props) {
  const classes = useStyles();

  return (
    <Toolbar {...props} className={classes.root}>
      <SaveButton className={classes.saveButton} />
      <ListButton />
      <DeleteButton className={classes.deleteButton} />
    </Toolbar>
  );
}

export default EditMailListToolbar;
