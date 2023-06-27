import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@material-ui/core/TextField";

import { updateMonthHistory } from "axios/costManagement/prepaidPayment/prepaidHistory";

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

function MonthHistoryUpdatePopup(props) {
  const { gpPrepaidSeq, gpmIdx, selectMonth, selectDate, rowData } = props;

  const [open, setOpen] = React.useState(false);
  const handleOpen = async () => {
    setGpmContact(rowData.GPM_CONTACT);
    setGpmReal(rowData.GPM_REAL);
    setGpmContactTermination(rowData.GPM_CONTACT_TERMINATION);
    setGpmRealTermination(rowData.GPM_REAL_TERMINATION);
    setGpmDescription(rowData.GPM_DESCRIPTION);

    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [gpmContact, setGpmContact] = React.useState(0);
  const [gpmReal, setGpmReal] = React.useState(0);
  const [gpmContactTermination, setGpmContactTermination] = React.useState(0);
  const [gpmRealTermination, setGpmRealTermination] = React.useState(0);
  const [gpmDescription, setGpmDescription] = React.useState("");

  const handleUpdateBasePrice = async () => {
    const result = await updateMonthHistory({
      GP_PREPAID_SEQ: gpPrepaidSeq,
      GPM_IDX: gpmIdx,
      GPM_CONTACT: gpmContact,
      GPM_REAL: gpmReal,
      GPM_CONTACT_TERMINATION: gpmContactTermination,
      GPM_REAL_TERMINATION: gpmRealTermination,
      GPM_DESCRIPTION: gpmDescription
    });
    setGpmContact({ ...result.data.GPM_CONTACT });
    setGpmReal({ ...result.data.GPM_REAL });
    setGpmContactTermination({ ...result.data.GPM_CONTACT_TERMINATION });
    setGpmRealTermination({ ...result.data.GPM_REAL_TERMINATION });
    setGpmDescription({ ...result.data.GPM_DESCRIPTION });
    alert("저장되었습니다.");
    handleClose();
    window.location.reload();
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
            {selectMonth}월 내역
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="당기지급 계약"
              defaultValue={gpmContact}
              onKeyUp={(e) => {
                setGpmContact(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="당기지급 실제"
              defaultValue={gpmReal}
              onKeyUp={(e) => {
                setGpmReal(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="당기해지 계약"
              defaultValue={gpmContactTermination}
              onKeyUp={(e) => {
                setGpmContactTermination(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="당기해지 실제"
              defaultValue={gpmRealTermination}
              onKeyUp={(e) => {
                setGpmRealTermination(e.target.value);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="비고"
              defaultValue={gpmDescription}
              onKeyUp={(e) => {
                setGpmDescription(e.target.value);
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

export default MonthHistoryUpdatePopup;
