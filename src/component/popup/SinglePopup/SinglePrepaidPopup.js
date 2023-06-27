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
import { unearnedRevenuePopupList } from "axios/costManagement/unearnedRevenue/unearnedRevenue";

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
  { field: "NAME", headerName: "내용", width: 130 },
  { field: "CODE", headerName: "코드", width: 130 }
];

function SinglePrepaidPopup(props) {
  const { isPopupPrepaid, setIsPopupPrepaid, setSelectPrepaid } = props;

  const [selectData, setSelectData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popupListData, setPopupListData] = useState([]);

  const handlePrepaidDataInput = async () => {
    // // 선택한 팝업 작품 정보 전부 리턴
    // if (selectPrepaid.ROW_TYPE === "단일") {
    //   setGcmManageId(selectPrepaid.CODE);
    //   setGcmManageGroupId("");
    // } else if (selectPrepaid.ROW_TYPE === "그룹") {
    //   setGcmManageId("");
    //   setGcmManageGroupId(selectPrepaid.CODE);
    // }
    // setSelectPrepaidRowType(selectPrepaid.ROW_TYPE);
    // setGcmSeriesName(selectPrepaid.NAME);
    // setGcmTypeCode(selectPrepaid.TYPE);
    setSelectPrepaid(selectData);
    setIsPopupPrepaid(false);
  };

  const getPrepaidPopup = async (selectPrepaid) => {
    return await unearnedRevenuePopupList(selectPrepaid);
  };

  const handleClose = () => {
    setIsPopupPrepaid(false);
  };

  const handlePrepaidPopup = async () => {
    const reqParam = {
      searchKeyword
    };
    const data = await getPrepaidPopup(reqParam);
    setPopupListData(
      data?.data?.map((item, index) => {
        return {
          id: index + 1,
          ROW_TYPE: item.ROW_TYPE,
          NAME: item.GP_NAME,
          CODE: item.GP_PREPAID_SEQ,
          TYPE: item.TYPE
        };
      })
    );
  };

  useEffect(() => {
    handlePrepaidPopup();
  }, []);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isPopupPrepaid}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          선수금/선급금 조회 팝업
        </BootstrapDialogTitle>
        <SearchPopup
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          handlePopup={handlePrepaidPopup}
        />
        <div style={{ height: 400, width: 350 }}>
          <DataGrid
            rows={popupListData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowDoubleClick={(e) => {
              setSelectPrepaid(selectData);
              handleClose();
            }}
            // checkboxSelection
            // onSelectionModelChange={(itm) => setSelectPlatform(itm.toString())}
            onRowClick={(e) => setSelectData(e.row)}
          />
        </div>
        <DialogActions>
          <Button autoFocus onClick={handlePrepaidDataInput}>
            등록
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
export default SinglePrepaidPopup;
