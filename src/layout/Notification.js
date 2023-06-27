import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";

import {
  hideNotification,
  getNotification,
  undo,
  complete,
  undoableEventEmitter,
  useTranslate,
} from "ra-core";

const useStyles = makeStyles(
  (theme) => ({
    error: {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.error.contrastText,
    },
    warning: {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.contrastText,
    },
    undo: {
      color: theme.palette.primary.light,
    },
  }),
  { name: "RaNotification" }
);

const Notification = (props) => {
  const {
    classes: classesOverride,
    type = "info",
    className,
    autoHideDuration = 4000,
    ...rest
  } = props;
  const [open, setOpen] = useState(false);
  const notification = useSelector(getNotification);
  const dispatch = useDispatch();
  const translate = useTranslate();
  const styles = useStyles(props);

  useEffect(() => {
    setOpen(!!notification);
  }, [notification]);

  const handleRequestClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleExited = useCallback(() => {
    if (notification && notification.undoable) {
      dispatch(complete());
      undoableEventEmitter.emit("end", { isUndo: false });
    }
    dispatch(hideNotification());
  }, [dispatch, notification]);

  const handleUndo = useCallback(() => {
    dispatch(undo());
    undoableEventEmitter.emit("end", { isUndo: true });
  }, [dispatch]);

  return (
    <Snackbar
      open={open}
      message={
        notification &&
        notification.message &&
        translate(notification.message, notification.messageArgs)
      }
      autoHideDuration={
        (notification && notification.autoHideDuration) || autoHideDuration
      }
      disableWindowBlurListener={notification && notification.undoable}
      onExited={handleExited}
      onClose={handleRequestClose}
      ContentProps={{
        className: classnames(
          styles[(notification && notification.type) || type],
          className
        ),
      }}
      action={
        notification && notification.undoable ? (
          <Button
            color="primary"
            className={styles.undo}
            size="small"
            onClick={handleUndo}
          >
            {translate("ra.action.undo")}
          </Button>
        ) : null
      }
      {...rest}
    />
  );
};

export default Notification;
