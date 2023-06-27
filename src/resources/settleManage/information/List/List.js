import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { add, format, parse } from "date-fns";
import { getWorkList } from "axios/information/work";
import DatePicker from "component/CustomDatePicker";
import SelectSearchInput from "component/filters/SelectSearchInput";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { getToday } from "utils/date";
import { formatNumber } from "utils/string";
import { isEmpty } from "utils/commonUtils";
import { CSVLink, CSVDownload } from "react-csv";

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
    id: "1",
    name: "구분"
  },
  {
    id: "2",
    name: "유형"
  },
  {
    id: "3",
    name: "작품명"
  },
  {
    id: "4",
    name: "작품코드"
  }
];

const pageSize = 10;

const columns = [
  {
    field: "IDX",
    headerName: "No",
    width: 110,
    headerClassName: "super-app-theme--header",
    flex: 1,
    headerAlign: "center"
  },
  {
    field: "ROW_TYPE",
    headerName: "구분",
    width: 110,
    headerClassName: "super-app-theme--header",
    flex: 1,
    headerAlign: "center"
  },
  {
    field: "GCM_TYPE_CODE",
    headerName: "유형",
    width: 110,
    headerClassName: "super-app-theme--header",
    flex: 1,
    headerAlign: "center"
  },
  {
    field: "GCM_SERIES_NAME",
    headerName: "작품명",
    width: 110,
    headerClassName: "super-app-theme--header",
    flex: 1,
    headerAlign: "center"
  },
  {
    field: "GCM_MANAGE_ID",
    headerName: "작품코드",
    width: 110,
    headerClassName: "super-app-theme--header",
    flex: 1,
    headerAlign: "center"
  },
  {
    field: "GC_NAMES",
    headerName: "CP명",
    width: 110,
    headerClassName: "super-app-theme--header",
    flex: 1,
    headerAlign: "center"
  }
];

function List(props) {
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
    ["getWorkList"],
    () =>
      getWorkList({
        filter: {
          ...requestParam
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
              id: item.IDX,
              ROW_TYPE: item.ROW_TYPE,
              GCM_TYPE_CODE: getGcmTypeCodeVal(item.GCM_TYPE_CODE),
              GCM_SERIES_NAME: item.GCM_SERIES_NAME,
              GCM_MANAGE_ID: item.GCM_MANAGE_ID,
              GC_NAMES: item.GC_NAMES
            };
          })
        );
      }
    }
  );

  const getGcmTypeCodeVal = (gcmTypeCode) => {
    let retVal = "";

    if (gcmTypeCode === "N") {
      retVal = "소설";
    } else if (gcmTypeCode === "C") {
      retVal = "만화";
    } else if (gcmTypeCode === "E") {
      retVal = "이모티콘";
    } else if (gcmTypeCode === "A") {
      retVal = "오디오북";
    } else if (gcmTypeCode === "W") {
      retVal = "웹툰단행본";
    } else if (gcmTypeCode === "M") {
      retVal = "메타버스";
    }

    return retVal;
  };

  const onHandlePage = (newPage) => {
    setPage(newPage);
  };

  function onSubmit(values) {
    console.log(values);
    setRequestParam({ searchKeyword: "그룹", searchType: "1" });
  }

  function handleBlurMgPayoutDetailsConditioins(nextFiters) {
    onSubmit(nextFiters);
  }

  // YYYYMMDDHHMMSS 계산
  function getTimestamp() {
    const date = new Date();
    let year = date.getFullYear().toString();

    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month.toString() : month.toString();

    let day = date.getDate();
    day = day < 10 ? "0" + day.toString() : day.toString();

    let hour = date.getHours();
    hour = hour < 10 ? "0" + hour.toString() : hour.toString();

    let minites = date.getMinutes();
    minites = minites < 10 ? "0" + minites.toString() : minites.toString();

    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds.toString() : seconds.toString();

    return year + month + day + hour + minites + seconds;
  }

  const headers = [
    { label: "No.", key: "IDX" },
    { label: "구분", key: "ROW_TYPE" },
    { label: "유형", key: "GCM_TYPE_CODE" },
    { label: "작품명", key: "GCM_SERIES_NAME" },
    { label: "작품코드", key: "GCM_MANAGE_ID" },
    { label: "CP명", key: "GC_NAMES" }
  ];

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
                    <Button
                      variant="contained"
                      // disabled={!deadline}
                      // onClick={onHandleDeadline}
                    >
                      {"등록"}
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="contained">
                      <CSVLink data={resultData} headers={headers} filename={`work-${getTimestamp()}.csv`}>
                        {"내보내기"}
                      </CSVLink>
                    </Button>
                  </Grid>
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
          onrow
          pageSize={10}
          rowsPerPageOptions={[5]}
          // paginationMode="server"
          // checkboxSelection
          rowCount={count}
          onPageChange={onHandlePage}
          // page={page}
          onRowClick={(e) => {
            history.push(`/informationWorkDetail/${e.id}`);
          }}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </>
  );
}

export default List;
