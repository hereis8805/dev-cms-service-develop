import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { getMonthCpsDeatil } from "axios/calculation/CalculationMonthly";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import DatePicker from "component/DatePicker";
import { Form } from "react-final-form";
import { getToday } from "utils/date";
import Dialog from "@mui/material/Dialog";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

function CalculationMonthlyCpDetailTestDetail(props) {
  const history = useHistory();
  const classes = useStyles();
  const param = history.location.pathname.split("/")[2];
  const searchParam = history.location.search.split("=")[1];
  const [formDate, setFormDate] = useState(searchParam);
  const [toDate, setToDate] = useState(searchParam);
  const [resultData, setResultData] = useState([]);
  const [resultData1, setResultData1] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data, isLoading, refetch } = useQuery(
    ["getMonthCps"],
    () =>
      getMonthCpsDeatil({
        selectDate: "2022-05",
        // searchType: 1,
        // searchKeyword: ""
        param
      }),
    {
      enabled: true,
      onSuccess: (data) => {
        setResultData([data.data.settlementInfo]);
        setResultData1(
          data.data.settlementList?.map((item) => {
            return { ...item, id: item.GCD_IDX };
          }) ?? []
        );

        // setCount(data?.headers["x-total-count"]);
        //   data?.data?.map((item) => {
        //     return {
        //       ...item,
        //       id: item.GCD_IDX,
        //       GRD_NET_AMOUNT: formatNumber(formatFloor(item.GRD_NET_AMOUNT)),
        //       GRD_TOTAL_AMOUNT: formatNumber(formatFloor(item.GRD_TOTAL_AMOUNT)),
        //       GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT))
        //       // isGroup: item.groups.length > 0 ? "그룹" : "단일"
        //     };
        //   })
        // );
      }
    }
  );

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
    { field: "GCD_BUSINESS_TYPE", headerName: "구분", width: 110 },
    { field: "GCD_OWNER_NAME", headerName: "CP명", width: 110 },
    { field: "GCD_OLD_GROUP", headerName: "CP코드", width: 110 },
    { field: "GRD_TOTAL_AMOUNT", headerName: "총매출", width: 110 },
    { field: "GRD_NET_AMOUNT", headerName: "순매출", width: 110 },
    { field: "GCD_AMOUNT", headerName: "정산액", width: 110 },
    { field: "MANAGE_ID_SUM", headerName: "재정산금", width: 110, renderCell: RenderDate }
  ];

  const columns1 = [
    //   { field: "id", headerName: "No", width: 110 },
    { field: "GCD_IDX", headerName: "No.", width: 110 },
    { field: "GCD_SALE_MONTH", headerName: "정산월", width: 110 },
    { field: "SERIES_NAME", headerName: "작품명", width: 110 },
    { field: "GCD_MANAGE_ID", headerName: "작품코드", width: 110 },
    { field: "GRD_PREPAID_CODE", headerName: "선급금코드", width: 110 },
    { field: "ss", headerName: "정산타입", width: 110 },
    { field: "GCD_SETTLEMENT_TYPE", headerName: "정산기준", width: 110 },
    { field: "GCD_AMOUNT", headerName: "정산금", width: 110 }
  ];

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
            style={{ marginLeft: 16 }}
            // Remove button from tab sequence when cell does not have focus
          >
            정산내역서 보기
          </Button>
        </strong>
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
          p: 2
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
                p: 2
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
                checkboxSelection
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
          <DialogTitle id="alert-dialog-title">재정산금 입력</DialogTitle>
          <DialogContent style={{ height: "100px" }}>
            <TextField id="filled-basic" label="재정산금" style={{ marginTop: "15px" }} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" size="small" onClick={handleClose}>
              추가
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default CalculationMonthlyCpDetailTestDetail;
