import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import SearchPopup from "../SearchPopup";
import { getCpPopupCps } from "../../../axios/information/cp";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

// 작품 조회 팝업
function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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

const columns = [
  { field: "id", headerName: "No.", width: 70 },
  { field: "NAME", headerName: "CP명", width: 130 },
  { field: "CODE", headerName: "CP코드", width: 130 }
];

function SingleCpPopup(props) {
  const { isPopupCp, setIsPopupCp, setSelectCp } = props;

  const [selectData, setSelectData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popupListData, setPopupListData] = useState([]);

  const handleCpDataInput = async () => {
    // // 선택한 팝업 작품 정보 전부 리턴
    // if (selectCp.ROW_TYPE === "단일") {
    //   setGcmManageId(selectCp.CODE);
    //   setGcmManageGroupId("");
    // } else if (selectCp.ROW_TYPE === "그룹") {
    //   setGcmManageId("");
    //   setGcmManageGroupId(selectCp.CODE);
    // }
    // setSelectCpRowType(selectCp.ROW_TYPE);
    // setGcmSeriesName(selectCp.NAME);
    // setGcmTypeCode(selectCp.TYPE);
    setSelectCp(selectData);
    setIsPopupCp(false);
  };

  const getCpPopup = async (selectCp) => {
    return await getCpPopupCps(selectCp);
  };

  const handleClose = () => {
    setIsPopupCp(false);
  };

  const handleCpPopup = async () => {
    const reqParam = {
      searchKeyword
    };
    const data = await getCpPopup(reqParam);
    setPopupListData(
      data?.data?.map((item) => {
        return {
          id: item.id,
          ROW_TYPE: item.ROW_TYPE,
          NAME: item.NAME,
          CODE: item.GROUP,
          TYPE: item.TYPE
        };
      })
    );
  };

  useEffect(() => {
    handleCpPopup();
  }, []);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isPopupCp}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          CP 조회 팝업
        </BootstrapDialogTitle>
        <SearchPopup searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} handlePopup={handleCpPopup} />
        <div style={{ height: 400, width: 350 }}>
          <DataGrid
            rows={popupListData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowDoubleClick={(e) => {
              setSelectCp(selectData);
              handleClose();
            }}
            // checkboxSelection
            // onSelectionModelChange={(itm) => setSelectPlatform(itm.toString())}
            onRowClick={(e) => setSelectData(e.row)}
          />
        </div>
        <DialogActions>
          <Button autoFocus onClick={handleCpDataInput}>
            등록
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
export default SingleCpPopup;
