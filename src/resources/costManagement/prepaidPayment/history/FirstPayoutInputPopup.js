import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@material-ui/core/TextField";
import { useNotify, useRefresh } from "react-admin";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

const isEmpty3 = (val) => {
  if (
    val === 0 ||
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

function FirstPayoutInputPopup(props) {
  const { infoData, updateFirstPayoutInput } = props;
  const notify = useNotify();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [gpBaseBalance, setGpBaseBalance] = useState(0);
  const [gpRealBalance, setGpRealBalance] = useState(0);

  const handleUpdateFirstPayoutInput = async () => {
    await handleUpdateFirstPayoutInputReFresh(gpBaseBalance, gpRealBalance);
    await updateFirstPayoutInput({
      GP_PREPAID_SEQ: infoData.GP_PREPAID_SEQ,
      GP_IDX: infoData.GP_IDX,
      GP_BASE_BALANCE: gpBaseBalance,
      GP_REAL_BALANCE: gpRealBalance
    });
    // alert("저장되었습니다.");
    notify("저장되었습니다.", { type: "success" });
    handleClose();
    // window.location.reload();
  };

  const handleUpdateFirstPayoutInputReFresh = async (gpBaseBalance, gpRealBalance) => {
    setGpBaseBalance(gpBaseBalance);
    setGpRealBalance(gpRealBalance);
  };

  return (
    <div>
      {isEmpty3(infoData.GP_BASE_BALANCE) || isEmpty3(infoData.GP_REAL_BALANCE) ? (
        <Button variant="contained" color="primary" onClick={handleOpen}>
          최초 지급액
        </Button>
      ) : (
        ""
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            최초 지급액 입력
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="계약"
              defaultValue={isEmpty3(gpBaseBalance) ? infoData.GP_BASE_BALANCE : gpBaseBalance}
              onKeyUp={(e) => {
                setGpBaseBalance(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="실제"
              defaultValue={isEmpty3(gpRealBalance) ? infoData.GP_REAL_BALANCE : gpRealBalance}
              onKeyUp={(e) => {
                setGpRealBalance(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdateFirstPayoutInput}>
              등록
            </Button>
            &nbsp;&nbsp;
            <Button variant="contained" color="primary" onClick={handleClose}>
              닫기
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default FirstPayoutInputPopup;
