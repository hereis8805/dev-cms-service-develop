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
import { getCpPopupCps, getNewCpSingleDetail, getNewGroupCps } from "../../axios/information/cp";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

// CP 조회 팝업
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
  { field: "id", headerName: "No.", width: 30 },
  { field: "NAME", headerName: "CP명", width: 180 },
  { field: "GROUP", headerName: "CP코드", width: 130 },
  {
    field: "OLD",
    headerName: "CP상세코드",
    width: 140
  }
];

function CpPopup(props) {
  const {
    popupCp,
    setPopupCp,
    selectCp,
    setSelectCp,
    setGpCpId,
    setGpCpGroupId,
    setCpName,
    selectCpRowType,
    setSelectCpRowType
  } = props;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [popupListData, setPopupListData] = useState([]);

  const handleCpDataInput = async () => {
    setSelectCpRowType(selectCp.ROW_TYPE);
    setGpCpId(selectCp.OLD);
    setGpCpGroupId(selectCp.GROUP);
    setCpName(selectCp.NAME);
    setPopupCp(false);
  };

  const getCpPopupCpList = async (selectCp) => {
    return await getCpPopupCps(selectCp);
  };

  const handleClose = () => {
    setPopupCp(false);
  };

  const handleCpPopup = async () => {
    const reqParam = {
      searchKeyword
    };
    const data = await getCpPopupCpList(reqParam);
    setPopupListData(
      data?.data?.map((item) => {
        return {
          id: item.id,
          ROW_TYPE: item.ROW_TYPE,
          NAME: item.NAME,
          GROUP: item.GROUP,
          OLD: item.OLD
        };
      })
    );
  };

  useEffect(() => {
    handleCpPopup();
  }, []);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={popupCp}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          CP 조회 팝업
        </BootstrapDialogTitle>
        <SearchPopup searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} handlePopup={handleCpPopup} />
        <div style={{ height: 400, width: 600 }}>
          <DataGrid
            rows={popupListData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            // onSelectionModelChange={(itm) => setSelectPlatform(itm.toString())}
            onRowClick={(e) => setSelectCp(e.row)}
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
export default CpPopup;
