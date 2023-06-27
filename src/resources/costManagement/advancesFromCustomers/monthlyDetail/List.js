import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid } from "@mui/material";
import { formatterKo, pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import { useEffect, useMemo, useRef, useState } from "react";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import { formatFloor, getTimestamp } from "utils/commonUtils";
import Search from "./Search";
import {
  unearnedRevenueMonthDetailsList,
  unearnedRevenueMonthDetailsListExcel
} from "axios/costManagement/unearnedRevenue/unearnedRevenue";
import { format, parse } from "date-fns";
import { formatNumber } from "utils/string";
import { Title } from "react-admin";
import { nowDate } from "utils/commonUtils";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";
import { formatter1 } from "common/enum/grid";

function AdvancesFromCustomersMonthlyDetailtList(props) {
  const [resultData, setresultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [searchMonth, setSearchMonth] = useRecoilState(searchMonthAtom);
  // const [requestParam, setRequestParam] = useState({
  //   searchKeyword: "",
  //   searchType: "",
  //   startDate: nowDate,
  //   endDate: nowDate
  // });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const file = useRef(null);
  const history = useHistory();

  const RenderDate = (value) => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push(`/prepaidHistory/${value.row.GP_PREPAID_SEQ}?selectDate=${value.row.GPM_ACTUAL_MONTH}`);
          }}
        >
          내역
        </Button>
      </>
    );
  };

  const columns = [
    { field: "id", headerName: "No..", flex: 0.5 },
    { field: "GP_PREPAID_SEQ", headerName: "선수수익코드", flex: 0.5 },
    { field: "GP_NAME", headerName: "내용", flex: 0.5, align: "left" },
    { field: "BUSINESS_NAME", headerName: "거래처", flex: 0.5 },
    { field: "GCM_SERIES_NAME", headerName: "작품명", flex: 0.5 },
    { field: "GP_CURRENCY", headerName: "통화", flex: 0.5 },
    {
      field: "BASIC_AMOUNT_SUM",
      headerName: "기초",
      flex: 0.5,
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    {
      field: "PAID_AMOUNT_SUM",
      headerName: "수령",
      flex: 0.5,
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    {
      field: "DEDUCTION_AMOUNT_SUM",
      headerName: "차감",
      flex: 0.5,
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    {
      field: "FINAL_AMOUNT_SUM",
      headerName: "기말",
      flex: 0.5,
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    { field: "GO_LINK", headerName: "내역보기", renderCell: RenderDate }
  ];

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      param: searchMonth?.advancesMonthly?.startDate,
      ...searchMonth?.advancesMonthly
    }),
    [page, pageSize, searchMonth]
  );

  const handleExcelDown = async (queryOptions) => {
    await unearnedRevenueMonthDetailsListExcel(queryOptions)
      .then((res) => {
        setExcelData(res.data);
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

  const { isLoading, refetch } = useQuery(
    ["unearnedRevenueMonthDetailsList"],
    () => unearnedRevenueMonthDetailsList(queryOptions),
    {
      enabled: false,
      onSuccess: (data) => {
        setCount(data?.headers["x-total-count"]);
        setresultData(
          data?.data?.map((item) => {
            return {
              ...item,
              ROWNUM: parseInt(item.ROWNUM),
              id: item.ROWNUM
              // GP_PREPAID_SEQ: item.GP_PREPAID_SEQ,
              // GPM_ACTUAL_MONTH: item.GPM_ACTUAL_MONTH,
              // GP_NAME: item.GP_NAME,
              // BUSINESS_NAME: item.BUSINESS_NAME,
              // GCM_SERIES_NAME: item.GCM_SERIES_NAME,
              // GP_CURRENCY: item.GP_CURRENCY,
              // BASIC_AMOUNT_SUM: formatNumber(formatFloor(item.BASIC_AMOUNT_SUM)),
              // PAID_AMOUNT_SUM: formatNumber(formatFloor(item.PAID_AMOUNT_SUM)),
              // DEDUCTION_AMOUNT_SUM: formatNumber(formatFloor(item.DEDUCTION_AMOUNT_SUM)),
              // FINAL_AMOUNT_SUM: formatNumber(formatFloor(item.FINAL_AMOUNT_SUM))
            };
          })
        );
        handleExcelDown(queryOptions);
      }
    }
  );

  const headers = columns.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  useEffect(() => {
    history.action === "PUSH" && setSearchMonth(initSearchMont);
  }, [history, setSearchMonth]);

  useEffect(() => {
    handleExcelDown(queryOptions);
    refetch();
  }, [page, pageSize, searchMonth, refetch, queryOptions]);

  return (
    <>
      <Title title="선수금 월별상세" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          {/* <Button
            variant="text"
            startIcon={<AddIcon />}
            // disabled={!deadline}
            onClick={() => {
              setIsPopup(true);
            }}
          >
            {"등록"}
          </Button> */}
          <Button variant="text" startIcon={<FileDownloadIcon />} onClick={() => file.current.link.click()}>
            내보내기
          </Button>
          <div style={{ display: "none" }}>
            <CSVLink
              ref={file}
              data={excelData}
              headers={headers}
              filename={`unearnedRevenueMonth-${getTimestamp()}.csv`}
              className="hidden"
            />
          </div>
        </Grid>
      </Grid>
      <Search setRequestParam={setSearchMonth} requestParam={searchMonth} />
      <DataGridCusutom
        uid="advancesMonthly"
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
        onRowClick={
          (e) => console.log("e : ", e)
          // history.push(`/infoManageWorkDetail/${e.id}?createType=${e.row?.ROW_TYPE === "단일" ? "single" : "multi"}`)
        }
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
      <MuiModalCustom
        isOpen={isPopup}
        onClose={() => {
          setIsPopup(false);
        }}
        title={"단일/그룹 코드 선택"}
      >
        <CreateTypeSelect url={"infoManageWorkDetail"} />
      </MuiModalCustom>
    </>
  );
}

export default AdvancesFromCustomersMonthlyDetailtList;
