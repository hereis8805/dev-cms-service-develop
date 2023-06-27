import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { add, format, parse } from "date-fns";
import { getMonthCps } from "axios/calculation/CalculationMonthly";
import DatePicker from "component/DatePicker";
import SelectSearchInput from "component/filters/SelectSearchInput";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { getToday } from "utils/date";
import { formatNumber } from "utils/string";
import { isEmpty } from "utils/commonUtils";
const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

const MG_PAYOUT_DETAILS_CONDITIONS = [
  {
    id: "CPCODE",
    name: "CP코드"
  },
  {
    id: "CP1",
    name: "CP명"
  }
];

const pageSize = 10;

const columns = [
  { field: "GCD_IDX", headerName: "No", width: 110 },
  { field: "GCD_BUSINESS_TYPE", headerName: "구분", width: 110 },
  { field: "GCD_OWNER_NAME", headerName: "CP명", width: 110 },
  { field: "GCD_OLD_GROUP", headerName: "CP코드", width: 110 },
  { field: "GRD_TOTAL_AMOUNT", headerName: "총매출", width: 110 },
  { field: "GRD_NET_AMOUNT", headerName: "순매출", width: 110 },
  { field: "GCD_AMOUNT", headerName: "총정산액", width: 110 },
  { field: "MANAGE_ID_SUM", headerName: "작품수", width: 110 }
];

function CalculationMonthlyCpDetailTest(props) {
  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({});
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const history = useHistory();
  function formatFloor(pNum) {
    return Math.floor(pNum);
  }

  const classes = useStyles();
  const { isLoading, refetch } = useQuery(
    ["getMonthCps"],
    () =>
      getMonthCps({
        filter: {
          selectDate: date,
          ...requestParam
          // searchType: 1,
          // searchKeyword: ""
        },
        range: `[${page * pageSize}, ${page === 0 ? pageSize - 1 : page * pageSize + 9}]`
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        setCount(data?.headers["x-total-count"]);
        setresultData(
          data?.data?.map((item) => {
            return {
              ...item,
              id: item.GCD_IDX,
              GRD_NET_AMOUNT: formatNumber(formatFloor(item.GRD_NET_AMOUNT)),
              GRD_TOTAL_AMOUNT: formatNumber(formatFloor(item.GRD_TOTAL_AMOUNT)),
              GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT))
              // isGroup: item.groups.length > 0 ? "그룹" : "단일"
            };
          })
        );
      }
    }
  );

  const onHandlePage = (newPage) => {
    setPage(newPage);
  };

  function onSubmit(values) {
    setRequestParam(values);
  }

  function handleChangeDate(nextDate) {
    setDate(nextDate);
    // refetch();
  }

  function handleBlurMgPayoutDetailsConditioins(nextFiters) {
    onSubmit(nextFiters);
  }

  useEffect(() => {
    refetch();
  }, [page, date, requestParam]);

  return (
    <>
      <Box sx={{ width: "100%", pt: 1 }}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
            mb: 2,
            p: 2
          }}
        >
          <Form
            initialValues={
              {
                // ...filterValues
                // cp_type_code: !filterValues.cp_type_code ? "ALL" : filterValues.cp_type_code
              }
            }
            onSubmit={onSubmit}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Grid container direction="row" justifyContent="space-between" alignItems="baseline">
                  <Grid item>
                    <Box />
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label="search"
                      color="primary"
                      type="submit"
                      onClick={() => {
                        handleChangeDate(format(add(parse(date, "yyyy-MM", new Date()), { months: -1 }), "yyyy-MM"));
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                    <DatePicker
                      views={["year", "month"]}
                      openTo="month"
                      format="yyyy-MM"
                      value={date}
                      onChange={(nextDate) => {
                        setDate(nextDate);
                        // refetch();
                        // onSubmit();
                      }}
                      margin="no"
                      MuiInput-underline
                    />
                    <IconButton
                      aria-label="search"
                      color="primary"
                      type="submit"
                      onClick={() => {
                        handleChangeDate(format(add(parse(date, "yyyy-MM", new Date()), { months: 1 }), "yyyy-MM"));
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
                <br />
                <Box sx={{ display: "flex" }}>
                  <SelectSearchInput
                    selects={MG_PAYOUT_DETAILS_CONDITIONS}
                    onBlur={handleBlurMgPayoutDetailsConditioins}
                  />
                  <Button type="submit" variant="contained" color="primary">
                    검색
                  </Button>
                </Box>
              </form>
            )}
          </Form>
        </Box>
      </Box>
      <Box
        sx={{
          height: 650,
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
          onrow
          pageSize={10}
          rowsPerPageOptions={[5]}
          // paginationMode="server"
          // checkboxSelection
          rowCount={count}
          onPageChange={onHandlePage}
          // page={page}
          onRowClick={(e) => {
            history.push(`/detail/${e.id}?selectDate=${date}`);
          }}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </>
  );
}

export default CalculationMonthlyCpDetailTest;
