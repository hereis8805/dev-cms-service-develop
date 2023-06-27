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
import { getPopupWorks } from "../../../axios/information/work";

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
  { field: "NAME", headerName: "작품명", width: 130 },
  { field: "CODE", headerName: "작품코드", width: 130 }
];

function SingleWorkPopup(props) {
  const { isPopupWork, setIsPopupWork, setSelectWork } = props;

  const [selectData, setSelectData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popupListData, setPopupListData] = useState([]);

  const handleWorkDataInput = async () => {
    // // 선택한 팝업 작품 정보 전부 리턴
    // if (selectWork.ROW_TYPE === "단일") {
    //   setGcmManageId(selectWork.CODE);
    //   setGcmManageGroupId("");
    // } else if (selectWork.ROW_TYPE === "그룹") {
    //   setGcmManageId("");
    //   setGcmManageGroupId(selectWork.CODE);
    // }
    // setSelectWorkRowType(selectWork.ROW_TYPE);
    // setGcmSeriesName(selectWork.NAME);
    // setGcmTypeCode(selectWork.TYPE);
    setSelectWork(selectData);
    setIsPopupWork(false);
  };

  const getWorkPopup = async (selectWork) => {
    return await getPopupWorks(selectWork);
  };

  const handleClose = () => {
    setIsPopupWork(false);
  };

  const handleWorkPopup = async () => {
    const reqParam = {
      searchKeyword
    };
    const data = await getWorkPopup(reqParam);
    setPopupListData(
      data?.data
        ?.map((item) => {
          return {
            id: item.id,
            ROW_TYPE: item.ROW_TYPE,
            NAME: item.NAME,
            CODE: item.CODE,
            TYPE: item.TYPE
          };
        })
        .filter((item) => item.ROW_TYPE === "단일")
    );
  };

  useEffect(() => {
    handleWorkPopup();
  }, []);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isPopupWork}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          작품 조회 팝업2
        </BootstrapDialogTitle>
        <SearchPopup searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} handlePopup={handleWorkPopup} />
        <div style={{ height: 400, width: 350 }}>
          <DataGrid
            rows={popupListData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowDoubleClick={(e) => {
              setSelectWork(selectData);
              handleClose();
            }}
            // checkboxSelection
            // onSelectionModelChange={(itm) => setSelectPlatform(itm.toString())}
            onRowClick={(e) => setSelectData(e.row)}
          />
        </div>
        <DialogActions>
          <Button autoFocus onClick={handleWorkDataInput}>
            등록
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
export default SingleWorkPopup;
