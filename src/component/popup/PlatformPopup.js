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

import SearchPopup from "./SearchPopup";
import {
  getPopupGpOldPlatforms,
  getPopupSinglePlatforms,
  getPopupGroupPlatforms
} from "../../axios/information/platform";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

// 플랫폼 조회 팝업
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
  { field: "OLD_PLATFORM", headerName: "플랫폼코드", width: 130 },
  {
    field: "OLD_DETAIL",
    headerName: "상세코드",
    width: 120
  }
];

function PlatformPopup(props) {
  const {
    popupPlatform,
    setPopupPlatform,
    selectPlatform,
    setSelectPlatform,
    setPlatformDetail,
    setPlatformGroup,
    setGpPlatformName,
    selectPlatformRowType,
    setSelectPlatformRowType
  } = props;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [popupListData, setPopupListData] = useState([]);

  const handlePlatformDataInput = async () => {
    // 선택한 팝업 PK 값으로 PK/플랫폼코드/플랫폼상세코드/플랫폼명 전부 리턴
    if (selectPlatform.ROW_TYPE === "단일") {
      setPlatformDetail(selectPlatform.OLD_DETAIL);
      setPlatformGroup("");
      setGpPlatformName(selectPlatform.NAME);
    } else if (selectPlatform.ROW_TYPE === "그룹") {
      setPlatformDetail("");
      setPlatformGroup(selectPlatform.OLD_PLATFORM);
      setGpPlatformName(selectPlatform.NAME);
    } else {
      console.log("Error!!");
    }

    setSelectPlatformRowType(selectPlatform.ROW_TYPE);
    setPopupPlatform(false);
  };

  const getSinglePlatformList = async (selectPlatform) => {
    return await getPopupSinglePlatforms(selectPlatform);
  };

  const getMultiPlatform = async (selectPlatform) => {
    return await getPopupGroupPlatforms(selectPlatform);
  };

  const handleClose = () => {
    setPopupPlatform(false);
  };

  const handlePlatformPopup = async () => {
    console.log("========");
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
          OLD_PLATFORM: item.OLD_PLATFORM,
          OLD_DETAIL: item.OLD_DETAIL
        };
      })
    );
  };

  useEffect(() => {
    handlePlatformPopup();
  }, []);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={popupPlatform}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          플랫폼 조회 팝업
        </BootstrapDialogTitle>
        <SearchPopup
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          handlePopup={handlePlatformPopup}
        />
        <div style={{ height: 400, width: 500 }}>
          <DataGrid
            rows={popupListData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            // onSelectionModelChange={(itm) => setSelectPlatform(itm.toString())}
            onRowClick={(e) => setSelectPlatform(e.row)}
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

export default PlatformPopup;
