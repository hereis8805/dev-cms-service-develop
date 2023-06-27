import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

import { patchAccountsPassword, isLogin } from "../../axios/user/user";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 4 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

function PasswordModifyPopup(props) {
  const { popupPassword, setPopupPassword, guIdx, guUserId } = props;

  const [originPassword, setOriginPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const handleClose = () => {
    setPopupPassword(false);
  };

  const isEmpty3 = (val) => {
    if (
      val === "null" ||
      val === "NULL" ||
      val === "Null" ||
      val === "" ||
      val === null ||
      val === undefined ||
      (val !== null && typeof val === "object" && !Object.keys(val).length)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleIsLogin = async (param) => {
    return await isLogin(param);
  };

  const handlePutPassword = async () => {
    // 패스워드 검증
    if (isEmpty3(originPassword) && isEmpty3(newPassword) && isEmpty3(newPasswordConfirm)) {
      alert("필수값 누락");
      return;
    }

    if (newPassword != newPasswordConfirm) {
      alert("변경 비밀번호값을 다시 확인해주세요");
      return;
    }

    const loginParam = {
      loginId: guUserId,
      loginPw: originPassword
    };
    await handleIsLogin(loginParam)
      .then((data) => {
        const param = {
          GU_IDX: guIdx,
          password: newPassword
        };
        patchAccountsPassword(param);
        alert("비밀번호 변경완료");
        setPopupPassword(false);
      })
      .catch(() => {
        alert("기존 비밀번호가 잘못되었습니다.");
        return;
      });
  };

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={popupPassword}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          비밀번호 변경
        </BootstrapDialogTitle>
        <Grid container item spacing={2} p={2}>
          <Grid item xs>
            <Grid item xs>
              <TextField
                id="outlined-password-input"
                label="기존 비밀번호"
                type="password"
                autoComplete="current-password"
                value={originPassword}
                onChange={(e) => {
                  setOriginPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid container item spacing={2} p={2}></Grid>
            <Grid item xs>
              <TextField
                id="outlined-password-input"
                label="변경 비밀번호"
                type="password"
                autoComplete="current-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid container item spacing={2} p={2}></Grid>
            <Grid item xs>
              <TextField
                id="outlined-password-input"
                label="변경 비밀번호 확인"
                type="password"
                autoComplete="current-password"
                value={newPasswordConfirm}
                onChange={(e) => {
                  setNewPasswordConfirm(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <DialogActions>
          <Button autoFocus onClick={handlePutPassword}>
            변경
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
export default PasswordModifyPopup;
