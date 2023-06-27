import React, { useEffect } from "react";
// import { styled } from "@material-ui/core/styles";
import CloseButton from "@material-ui/icons/Book";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  content: {
    whiteSpace: "pre-line"
  }
});

function MuiModalCustom({ className, onClose, onConfirm, isOpen, children, title, content, btnLabel }) {
  const classes = useStyles();
  const close = (e) => {
    if (onClose) {
      onClose(e);
    }
  };

  const confirm = (e) => {
    if (onConfirm) {
      onConfirm(e);
    }
  };

  // useEffect(() => {
  //   document.body.style.cssText = `position: fixed; top: -${window.scrollY}px`;
  //   return () => {
  //     const scrollY = document.body.style.top;
  //     document.body.style.cssText = `position: ""; top: "";`;
  //     window.scrollTo(0, parseInt(scrollY || "0") * -1);
  //   };
  // }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent className={classes.content}>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={confirm} color="primary" autoFocus>
          {btnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MuiModalCustom;
