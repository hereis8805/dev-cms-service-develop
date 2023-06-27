import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Grid } from "@mui/material";
import { getForexRatios } from "axios/etc/forexRatios";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { forexRatiosAtom } from "store/atom";
import { getToday } from "utils/date";
import moment from "moment";

const columns = [
  { field: "id", headerName: "No.", flex: 0.5 },
  { field: "GER_ACTUAL", headerName: "매출반영월" },
  { field: "CNH", headerName: "CNH" },
  { field: "JPY", headerName: "JPY" },
  { field: "USD", headerName: "USD" },
  { field: "THB", headerName: "THB" },
  { field: "EUR", headerName: "EUR" }
];

function ForexRatiosList(props) {
  const [resultData, setresultData] = useState([]);
  const [isPopup, setIsPopup] = useState(false);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const setForexRatios = useSetRecoilState(forexRatiosAtom);
  // const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const history = useHistory();

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isLoading, refetch } = useQuery(["getForexRatios"], () => getForexRatios(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item, index) => {
          return {
            ...item,
            id: index + 1
          };
        })
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="외한 비율 관리" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => {
              setIsPopup(true);
              //   history.push("/forexRatiosCreate");
            }}
          >
            {"등록"}
          </Button>
        </Grid>
      </Grid>
      {/* <h3>외환 비율 관리</h3> */}
      <DataGridCusutom
        rows={resultData}
        rowCount={count}
        loading={isLoading}
        onrow
        // page={page}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        // paginationMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
        onRowClick={(e) => {
          const chkNowDateYearMonth = moment(new Date()).format("YYYYMM");
          const chkGerActualYearMonth = moment(new Date(e.row.GER_ACTUAL + "-" + "01")).format("YYYYMM");
          if (chkNowDateYearMonth <= chkGerActualYearMonth) {
            history.push(`/forexRatiosDetail/${e.row.GER_ACTUAL}`);
          }
        }}
      />
      <MuiModalCustom
        isOpen={isPopup}
        onClose={() => {
          setIsPopup(false);
        }}
        title={"매출반영월 선택"}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
          <DatePicker
            views={["year", "month"]}
            variant="static"
            openTo="month"
            format="yyyy-MM"
            value={date}
            onChange={(nextDate) => {
              setDate(nextDate);
            }}
            margin="no"
            MuiInput-underline
            size="small"
          />
        </MuiPickersUtilsProvider>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const filterList = resultData.filter((item) => item.GER_ACTUAL === format(date, "yyyyMM"));
              setForexRatios(filterList);
              //   console.log("filterList : ", filterList);
              setIsPopup(false);
              history.push(`/forexRatiosCreate/${format(date, "yyyy-MM")}`);
            }}
          >
            확인
          </Button>
        </Box>
      </MuiModalCustom>
    </>
  );
}

export default ForexRatiosList;
