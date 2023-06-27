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
import { getPopupGpOldPlatforms } from "../../../axios/information/platform";
import { isEmpty3 } from "utils/commonUtils";

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
  { field: "NAME", headerName: "플랫폼명", width: 130 },
  { field: "CODE", headerName: "플랫폼코드", width: 130 }
];

function SinglePlatformPopup(props) {
  const { isPopupPlatform, setIsPopupPlatform, setSelectPlatform } = props;

  const [selectData, setSelectData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popupListData, setPopupListData] = useState([]);

  const handlePlatformDataInput = async () => {
    // // 선택한 팝업 작품 정보 전부 리턴
    // if (selectPlatform.ROW_TYPE === "단일") {
    //   setGcmManageId(selectPlatform.CODE);
    //   setGcmManageGroupId("");
    // } else if (selectPlatform.ROW_TYPE === "그룹") {
    //   setGcmManageId("");
    //   setGcmManageGroupId(selectPlatform.CODE);
    // }
    // setSelectPlatformRowType(selectPlatform.ROW_TYPE);
    // setGcmSeriesName(selectPlatform.NAME);
    // setGcmTypeCode(selectPlatform.TYPE);
    setSelectPlatform(selectData);
    setIsPopupPlatform(false);
  };

  const getPlatformPopup = async (selectPlatform) => {
    return await getPopupGpOldPlatforms(selectPlatform);
  };

  const handleClose = () => {
    setIsPopupPlatform(false);
  };

  const handlePlatformPopup = async () => {
    const reqParam = {
      searchKeyword
    };
    const data = await getPopupGpOldPlatforms(reqParam);
    setPopupListData(
      data?.data?.map((item) => {
        return {
          id: item.id,
          ROW_TYPE: item.ROW_TYPE,
          NAME: item.NAME,
          // CODE: item.OLD_DETAIL,
          CODE: !isEmpty3(item.OLD_DETAIL) ? item.OLD_DETAIL : item.OLD_PLATFORM,
          TYPE: item.TYPE
        };
      })
    );
  };

  useEffect(() => {
    handlePlatformPopup();
  }, []);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isPopupPlatform}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          플랫폼 조회 팝업
        </BootstrapDialogTitle>
        <SearchPopup
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          handlePopup={handlePlatformPopup}
        />
        <div style={{ height: 400, width: 350 }}>
          <DataGrid
            rows={popupListData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowDoubleClick={(e) => {
              setSelectPlatform(selectData);
              handleClose();
            }}
            // checkboxSelection
            // onSelectionModelChange={(itm) => setSelectPlatform(itm.toString())}
            onRowClick={(e) => setSelectData(e.row)}
          />
        </div>
        <DialogActions>
          <Button autoFocus onClick={handlePlatformDataInput}>
            등록
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
export default SinglePlatformPopup;
