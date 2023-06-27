import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@material-ui/core/TextField";

import { getPrepaidPaymentHistory, updateBasePriceUpdate } from "axios/costManagement/prepaidPayment/prepaidHistory";
import { useNotify } from "react-admin";

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

function BasePriceUpdatePopup(props) {
  const notify = useNotify();
  const { gpPrepaidSeq, gpIdx, selectDate } = props;

  const [open, setOpen] = React.useState(false);
  const handleOpen = async () => {
    const prepaidPaymentHistoryResult = await getPrepaidPaymentHistory({
      GP_PREPAID_SEQ: gpPrepaidSeq,
      selectYear: selectDate
    });
    const prepaidPaymentHistoryInfo = prepaidPaymentHistoryResult.data.info;
    setGpBaseModify(prepaidPaymentHistoryInfo.GP_BASE_MODIFY);
    setGpRealModify(prepaidPaymentHistoryInfo.GP_REAL_MODIFY);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [gpBaseModify, setGpBaseModify] = React.useState(0);
  const [gpRealModify, setGpRealModify] = React.useState(0);

  const handleUpdateBasePrice = async () => {
    const result = await updateBasePriceUpdate({
      GP_PREPAID_SEQ: gpPrepaidSeq,
      GP_IDX: gpIdx,
      GP_BASE_MODIFY: gpBaseModify,
      GP_REAL_MODIFY: gpRealModify
    });
    setGpBaseModify({ ...result.data.GP_BASE_MODIFY });
    setGpRealModify({ ...result.data.GP_REAL_MODIFY });
    notify("저장되었습니다.", { type: "success" });
    // alert("저장되었습니다.");
    handleClose();
    // window.location.reload();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        수정
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            기초 수정
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="계약"
              defaultValue={gpBaseModify}
              onKeyUp={(e) => {
                setGpBaseModify(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="실제"
              defaultValue={gpRealModify}
              onKeyUp={(e) => {
                setGpRealModify(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdateBasePrice}>
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

export default BasePriceUpdatePopup;
