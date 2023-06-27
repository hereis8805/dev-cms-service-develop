import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  TextField
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import {
  getMonthCpsCsvExport,
  getMonthCpsDeatil,
  patchMonthCpsRecalculates
} from "axios/calculation/CalculationMonthly";
import React, { useRef, useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import DatePicker from "component/DatePicker";
import { Form } from "react-final-form";
import { getToday } from "utils/date";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useToggle from "hooks/useToggle";
import DefaultNotification from "layout/Notification";
import { Window } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from "react-csv";
import { formatFloor, getTimestamp } from "utils/commonUtils";
import { formatNumber } from "utils/string";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

function CalculationMonthlyCpDetailTestDetail(props) {
  const { notification = DefaultNotification } = props;
  //   console.log("props : ", notification);
  const history = useHistory();
  const classes = useStyles();
  const param = history.location.pathname.split("/")[2];
  const searchParam = history.location.search.split("=")[1];
  const [formDate, setFormDate] = useState(searchParam);
  const [toDate, setToDate] = useState(searchParam);
  const [resultData, setResultData] = useState([]);
  const [resultData1, setResultData1] = useState([]);
  const [popData, setPopData] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isShowingSnackbar, onToggleSnackbar] = useToggle(false);
  const [snackbarState, setSnackbarState] = useState({
    type: "",
    message: ""
  });
  const file = useRef(null);
  const [excelData, setExcelData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const { mutateAsync } = useMutation(patchMonthCpsRecalculates);
  // const { mutateAsync  } = useMutation(getMonthCpsCsvExport);
  const { refetch: recalculatesRetch } = useQuery(
    ["patchMonthCpsRecalculates"],
    () =>
      patchMonthCpsRecalculates({
        selectDate: searchParam,
        param,
        recalculate: popData
      }),
    {
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        console.log(data);
      }
    }
  );

  /*
  const { refetch: csvExportRetch } = useQuery(
    ["getMonthCpsCsvExport"],
    () =>
      getMonthCpsCsvExport({
        selectDate: searchParam,
        param
      }),
    {
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        console.log(data);
      }
    }
  );
  */

  const { data, isLoading, refetch } = useQuery(
    ["getMonthCpsDeatil"],
    () =>
      getMonthCpsDeatil({
        selectDate: searchParam,
        param
      }),
    {
      enabled: true,
      retry: false,
      onSuccess: (data) => {
        const resultList = [data.data.settlementInfo].map((item, index) => {
          return {
            ...item,
            key: index,
            GRD_TOTAL_AMOUNT: formatNumber(formatFloor(item.GRD_TOTAL_AMOUNT)),
            GRD_NET_AMOUNT: formatNumber(formatFloor(item.GRD_NET_AMOUNT)),
            GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT))
          };
        });
        setResultData(resultList);
        setResultData1(
          data.data.settlementList?.map((item) => {
            return { ...item, id: item.GCD_IDX, GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT)) };
          }) ?? []
        );
        handleExcelDown({
          selectDate: searchParam,
          param
        });
      }
    }
  );

  async function handleRecalculates() {
    try {
      await mutateAsync({
        selectDate: searchParam,
        param,
        recalculate: popData
      });
      setSnackbarState({
        type: "success",
        message: "정산 추가 성공"
      });
      onToggleSnackbar();
      setOpen2(false);
      window.location.reload();
    } catch (err) {
      setSnackbarState({
        type: "error",
        message: "데이터 검증 실패\n관리자에게 문의하세요."
      });
      onToggleSnackbar();
      console.log(err);
    }
    // recalculatesRetch();
    // console.log("tt");
  }

  function handleExportCsv(params) {
    // csvExportRetch();
  }

  function onSubmit(values) {
    // setRequestParam(values);
  }

  const RenderDate = (props) => {
    return (
      <strong>
        {/* <Button7
            component="button"
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            // Remove button from tab sequence when cell does not have focus
          >
            추가
          </Button7> */}
        <Button variant="contained" size="small" onClick={handleClickOpen}>
          추가
        </Button>
      </strong>
    );
  };

  const columns = [
    //   { field: "id", headerName: "No", width: 110 },
    {
      field: "GCD_BUSINESS_TYPE",
      headerName: "구분",
      width: 60,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GCD_OWNER_NAME",
      headerName: "CP명",
      width: 60,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GCD_OLD_GROUP",
      headerName: "CP코드",
      width: 60,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GRD_TOTAL_AMOUNT",
      headerName: "총매출",
      width: 60,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GRD_NET_AMOUNT",
      headerName: "순매출",
      width: 60,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GCD_AMOUNT",
      headerName: "정산액",
      width: 60,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "MANAGE_ID_SUM",
      headerName: "재정산금",
      width: 60,
      renderCell: RenderDate,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    }
  ];

  const columns1 = [
    //   { field: "id", headerName: "No", width: 110 },
    {
      field: "GCD_IDX",
      headerName: "No.",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GCD_SALE_MONTH",
      headerName: "정산월",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "SERIES_NAME",
      headerName: "작품명",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GCD_MANAGE_ID",
      headerName: "작품코드",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GRD_PREPAID_CODE",
      headerName: "선급금코드",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "ss",
      headerName: "정산타입",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GCD_SETTLEMENT_TYPE",
      headerName: "정산기준",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    },
    {
      field: "GCD_AMOUNT",
      headerName: "정산금",
      width: 110,
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center"
    }
  ];

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

  const headers = columns1.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  const handleExcelDown = async () => {
    await getMonthCpsCsvExport({
      selectDate: searchParam,
      param
    })
      .then((res) => {
        setExcelData(res.data);
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

  useEffect(() => {
    handleExcelDown({
      selectDate: searchParam,
      param
    });
  }, []);

  //   console.log("history : ", history);
  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="baseline">
        정산정보 / {searchParam}
        <strong>
          <Button
            component="button"
            variant="contained"
            size="small"
            type="button"
            style={{ marginLeft: 16 }}
            startIcon={<FileDownloadIcon />}
            onClick={() => file.current.link.click()}
          >
            정산내역서 보기
          </Button>
        </strong>
        <div style={{ display: "none" }}>
          <CSVLink
            ref={file}
            data={excelData}
            headers={headers}
            filename={`test-${getTimestamp()}.csv`}
            className="hidden"
          />
        </div>
      </Grid>
      <br />
      <Box
        sx={{
          height: 142,
          width: "100%",
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
          mb: 2,
          p: 2,
          "& .super-app-theme--header": {
            backgroundColor: "lightgray",
            fontWeight: "bold"
          }
        }}
      >
        <DataGrid
          className={classes.root}
          rows={resultData}
          columns={columns}
          loading={isLoading}
          Pagination={null}
          hideFooterPagination={true}
          hideFooter={true}
          hideFooterSelectedRowCount={true}
          //   onrow
          //   pageSize={10}
          //   rowsPerPageOptions={[5]}
          //   checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      <br />

      <Form
        initialValues={
          {
            //   ...zlistContext.filterValues
          }
        }
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
                mb: 2,
                p: 2,
                borderSpacing: 3
              }}
            >
              <Grid container direction="row" justifyContent="center" alignItems="center">
                <DatePicker
                  views={["year", "month"]}
                  openTo="month"
                  format="yyyy-MM"
                  value={formDate}
                  maxDate={toDate}
                  onChange={(e) => {
                    setFormDate(e);
                    // onSubmit({ selectDate: e });
                  }}
                  margin="no"
                  MuiInput-underline
                />
                -
                <DatePicker
                  views={["year", "month"]}
                  openTo="month"
                  format="yyyy-MM"
                  minDate={formDate}
                  value={toDate}
                  onChange={(e) => setToDate(e)}
                  margin="no"
                  MuiInput-underline
                />
              </Grid>
            </Box>
            <Box
              sx={{
                height: 450,
                width: "100%",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
                mb: 2,
                p: 2,
                "& .super-app-theme--header": {
                  backgroundColor: "lightgray",
                  fontWeight: "bold"
                }
              }}
            >
              <DataGrid
                className={classes.root}
                rows={resultData1}
                columns={columns1}
                loading={isLoading}
                // Pagination={null}
                onrow
                pageSize={10}
                rowsPerPageOptions={[5]}
                // checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Box>
          </form>
        )}
      </Form>
      <Grid container direction="row" justifyContent="flex-end" alignItems="end">
        <Button
          component="button"
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={handleClickOpen2}
          // Remove button from tab sequence when cell does not have focus
        >
          저장
        </Button>
      </Grid>

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <BootstrapDialogTitle id="alert-dialog-title" onClose={handleClose}>
            재정산금 입력
          </BootstrapDialogTitle>
          <DialogContent style={{ height: "100px" }}>
            <TextField
              id="filled-basic"
              label="재정산금"
              style={{ marginTop: "15px" }}
              value={popData}
              onChange={(e) => {
                // console.log(e);
                setPopData(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" size="small" type="button" onClick={() => setOpen(false)}>
              등록
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={open2}
          onClose={handleClose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>수정확인</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">변경된 내용을 저장하시겠습니까?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRecalculates}>확인</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isShowingSnackbar}
        autoHideDuration={3000}
        onClose={onToggleSnackbar}
      >
        <Alert onClose={onToggleSnackbar} severity={snackbarState.type} sx={{ width: "100%" }} variant="filled">
          {snackbarState.message}
        </Alert>
      </Snackbar>
      {/* {notification ? createElement(notification) : null} */}
    </div>
  );
}

export default CalculationMonthlyCpDetailTestDetail;
